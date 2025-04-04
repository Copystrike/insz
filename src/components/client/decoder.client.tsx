import { useState, useEffect, useRef, useMemo } from 'hono/jsx';
import type { DecodedInfo, DecodedInfoResult, InszAlgorithm } from '../../utils/insz-decoder';
import { simulateDecodeINSZ } from '../../utils/insz-decoder';
import type { ClientTranslations } from '../../utils/i18n';

interface ClientDecoderProps {
    translations?: ClientTranslations;
    locale?: string;
}

// --- UI Helper Functions ---

/**
 * Generates the correct ordinal suffix for a number (e.g., 1st, 2nd, 3de, 4ste).
 * Currently supports Dutch ('nl') and English ('en').
 * @param n The number.
 * @param locale The locale ('nl' or 'en').
 * @returns The suffix string.
 */
function getPositionSuffix(n: number, locale: string = 'nl'): string {
    if (n <= 0) return ''; // Should not happen for valid sequences
    if (locale === 'nl') {
        // Dutch suffix logic (simplified: 'ste' for 1, 8, >=20 and 11-19; 'de' otherwise)
        return (n === 1 || n === 8 || n >= 20 || (n % 100 >= 11 && n % 100 <= 19)) ? 'ste' : 'de';
    } else { // Default to English 'st', 'nd', 'rd', 'th'
        if (n % 100 >= 11 && n % 100 <= 13) return 'th'; // 11th, 12th, 13th
        switch (n % 10) {
            case 1: return 'st'; // 1st, 21st, etc.
            case 2: return 'nd'; // 2nd, 22nd, etc.
            case 3: return 'rd'; // 3rd, 23rd, etc.
            default: return 'th'; // 4th, 5th, etc.
        }
    }
}


// --- ResultContent Component ---
/**
 * Renders the detailed results based on the decoded information.
 * Handles fatal errors, valid results, checksum errors, and missing checksums.
 */
function ResultContent({ result, translations, locale = 'nl' }: {
    result: DecodedInfo,
    translations?: ClientTranslations,
    locale?: string;
}) {

    // Default translations in case none are provided - fallbacks
    const t = (key: string, defaultValue: string): string => {
        if (!translations) return defaultValue;

        // Try to get from client translations
        if (key.startsWith('client.decoder.')) {
            const decoderKey = key.replace('client.decoder.', '');
            return translations.client?.decoder?.[decoderKey] || defaultValue;
        }
        // Try to get from common translations
        else if (key.startsWith('common.')) {
            const commonKey = key.replace('common.', '') as keyof typeof translations.common;
            // Type assertion using keyof to tell TypeScript this is a valid key
            if (commonKey === 'male' || commonKey === 'female' || commonKey === 'notAvailable') {
                return translations.common[commonKey] || defaultValue;
            }
            return defaultValue;
        }

        return defaultValue;
    };

    // --- Fatal Error Case ---
    if (result.status === 'error') {
        let errorMessage: string;
        switch (result.errorKey) {
            case "INVALID_INPUT_TYPE":
                errorMessage = t('client.decoder.errorInvalidType', "Invalid input type.");
                break;
            case "INVALID_LENGTH":
                errorMessage = `${t('client.decoder.errorInvalidLength', "Invalid length. Expected 9 or 11 digits, but")} ${result.lengthFound ?? t('client.decoder.unknownCount', 'unknown count')} ${t('client.decoder.received', 'received')}.`;
                break;
            case "INVALID_FORMAT":
                errorMessage = t('client.decoder.errorInvalidFormat', "Invalid format. Must contain only digits.");
                break;
            case "INVALID_SEQUENCE":
                errorMessage = `${t('client.decoder.errorInvalidSequence', "Invalid sequence number")} (${result.invalidSequenceValue ?? 'N/A'}). ${t('client.decoder.errorInvalidSequenceRange', "Must be between 001 and 998.")}`;
                break;
            case "INVALID_DATE":
                const dateStr = result.dateParts ? `${result.dateParts.dd}/${result.dateParts.mm}/${result.dateParts.year ?? result.dateParts.yy}` : 'N/A';
                errorMessage = `${t('client.decoder.errorInvalidDate', "Invalid date")} (${dateStr}). ${t('client.decoder.errorDateNotExist', "The date does not exist in the calendar.")}`;
                break;
            default:
                errorMessage = t('client.decoder.errorUnknown', "Unknown validation error.");
                break;
        }
        // Display centered error message
        return (
            <div className="h-full flex items-center justify-center text-center">
                <p className="text-red-700 font-medium">{errorMessage}</p>
            </div>
        );
    }

    // --- Result Case (Valid, Checksum Invalid, Checksum Missing) ---
    // Type assertion: If status is not 'error', it must be DecodedInfoResult
    const res = result as DecodedInfoResult;

    // Calculate derived display values
    let genderText = '';
    if (res.simulatedGenderKey === "common.male") {
        genderText = t('common.male', "Male (Simulated)");
    } else {
        genderText = t('common.female', "Female (Simulated)");
    }

    const birthOrder = res.birthOrder;
    const suffix = getPositionSuffix(birthOrder!, locale); // Use non-null assertion assuming birthOrder is always present here
    const birthOrderMessage = birthOrder
        ? `${t('client.decoder.theNth', "The")} ${birthOrder}${suffix} ${genderText.toLowerCase()} ${t('client.decoder.registeredThatDay', "registered that day")}`
        : t('common.notAvailable', "N/A");

    // Determine checksum display text, class, and notes based on status
    let checksumText: string, checksumClass: string, checksumNote = "";
    switch (res.status) {
        case 'valid':
            checksumText = t('client.decoder.checksumCorrect', "Correct");
            checksumClass = "text-green-800";
            break;
        case 'checksum_invalid':
            checksumText = t('client.decoder.checksumInvalid', "Invalid");
            checksumClass = "text-red-700 font-bold";
            if (res.algorithmUsed === 'auto') {
                const exp19 = res.expectedChecksum19xx !== undefined ? String(res.expectedChecksum19xx).padStart(2, '0') : '??';
                const exp20 = res.expectedChecksum20xx !== undefined ? String(res.expectedChecksum20xx).padStart(2, '0') : '??';
                checksumNote = `(${t('client.decoder.checksumExpected', "Expected")}: ${exp20} ${t('client.decoder.checksumForYear', "for")} 20xx ${t('client.decoder.or', "or")} ${exp19} ${t('client.decoder.checksumForYear', "for")} 19xx)`;
            } else if (res.calculatedChecksum !== undefined && res.birthYear !== undefined) {
                checksumNote = `(${t('client.decoder.checksumExpected', "Expected")}: ${String(res.calculatedChecksum).padStart(2, '0')} ${t('client.decoder.checksumForYear', "for")} ${res.birthYear})`;
            }
            break;
        case 'checksum_missing':
            checksumText = t('client.decoder.checksumMissing', "Missing");
            checksumClass = "text-orange-600 font-bold";
            if (res.algorithmUsed === 'auto') {
                const exp19 = res.expectedChecksum19xx !== undefined ? String(res.expectedChecksum19xx).padStart(2, '0') : '??';
                const exp20 = res.expectedChecksum20xx !== undefined ? String(res.expectedChecksum20xx).padStart(2, '0') : '??';
                checksumNote = `(${t('client.decoder.checksumWouldBe', "Would be")} ${exp19} ${t('client.decoder.checksumForYear', "for")} 19xx ${t('client.decoder.or', "or")} ${exp20} ${t('client.decoder.checksumForYear', "for")} 20xx)`;
            } else if (res.calculatedChecksum !== undefined && res.birthYear !== undefined) {
                checksumNote = `(${t('client.decoder.checksumWouldBe', "Would be")} ${String(res.calculatedChecksum).padStart(2, '0')} ${t('client.decoder.checksumForYear', "for")} ${res.birthYear})`;
            }
            break;
        default: // Fallback
            checksumText = t('common.notAvailable', "N/A");
            checksumClass = "text-gray-500";
            break;
    }

    // --- Render the detailed results ---
    return (
        <div className="space-y-3 text-sm text-gray-800 font-mono">
            {/* Input Value */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.input', "Input:")}</span>
                <span className="break-all">{res.input}</span>
            </div>

            {/* Raw Components */}
            {res.components && (
                <>
                    <div className="flex">
                        <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.datePart', "Date Part (YYMMDD):")}</span>
                        <span>{res.components.datePart ?? t('common.notAvailable', "N/A")}</span>
                    </div>
                    <div className="flex">
                        <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.sequencePart', "Sequence Number (SSS):")}</span>
                        <span>{res.components.sequencePart ?? t('common.notAvailable', "N/A")}</span>
                    </div>
                    <div className="flex">
                        <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.checksumPart', "Checksum (CC):")}</span>
                        <span>{res.components.checksumPart ?? <span className="text-orange-600">{t('client.decoder.checksumMissing', "Missing")}</span>}</span>
                    </div>
                    <hr className={
                        res.status === 'valid' ? "border-green-200" :
                            res.status === 'checksum_invalid' ? "border-red-200" :
                                "border-orange-200" // checksum_missing
                    } />
                </>
            )}

            {/* --- Derived Information Section --- */}

            {/* Algorithm Setting */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.algorithm', "Algorithm Setting:")}</span>
                <span className="font-semibold">
                    {res.algorithmUsed === 'auto'
                        ? t('client.decoder.algorithmAuto', "Automatic (19xx/20xx)")
                        : res.algorithmUsed === '19xx'
                            ? t('client.decoder.algorithm19xx', "Force 19xx")
                            : t('client.decoder.algorithm20xx', "Force 20xx")}
                </span>
            </div>

            {/* Checksum Suggestion */}
            {res.algorithmUsed === 'auto' && res.suggestedAlgorithm && (
                <div className="flex">
                    <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.checksumSuggestion', "Checksum Suggestion:")}</span>
                    <span className="text-gray-600">{t('client.decoder.validFor', "Valid for")} {res.suggestedAlgorithm}</span>
                </div>
            )}

            {/* Checksum Status */}
            <div className="flex items-center">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.checksumStatus', "Checksum:")}</span>
                <span className={checksumClass}>{checksumText}</span>
                {checksumNote && <span className="text-xs text-gray-500 ml-2">{checksumNote}</span>}
            </div>

            {/* Birth Date */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.birthDate', "Birth Date:")}</span>
                <span>{res.simulatedBirthDate ?? t('common.notAvailable', "N/A")}</span>
                {res.guessedYear && <span className="text-xs text-orange-600 ml-2">({t('client.decoder.yearAssumed', "Year is assumed.")})</span>}
            </div>

            {/* Gender */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.gender', "Gender:")}</span>
                <span>{genderText}</span>
            </div>

            {/* Birth Order */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('client.decoder.birthOrder', "Birth Order:")}</span>
                <span>{birthOrderMessage}</span>
            </div>

            {/* Disclaimer */}
            <p className={`text-xs ${res.status === 'valid' ? 'text-gray-500' :
                res.status === 'checksum_invalid' ? 'text-red-600' :
                    'text-orange-600' // checksum_missing
                } pt-2 text-center`}>
                {res.status === 'checksum_invalid' && <strong>{t('client.decoder.cautionChecksumInvalid', "CAUTION: Checksum is invalid!")} </strong>}
                {res.status === 'checksum_missing' && <strong>{t('client.decoder.cautionChecksumMissing', "CAUTION: Checksum is missing! Validation impossible.")} </strong>}
                {res.guessedYear && <strong>{t('client.decoder.yearAssumed', "Year is assumed.")} </strong>}
                {t('client.decoder.disclaimer', "Derivation based on standard algorithms, for informational purposes only.")}
            </p>
        </div>
    );
}

/**
 * Maps algorithm keys to their user-friendly display names.
 */
function getAlgorithmDisplayName(algorithmKey: InszAlgorithm, translations?: ClientTranslations): string {
    if (!translations) {
        // Default fallbacks
        const defaultNames: Record<InszAlgorithm, string> = {
            'auto': 'Automatic (19xx/20xx)',
            '19xx': 'Force 19xx',
            '20xx': 'Force 20xx'
        };
        return defaultNames[algorithmKey];
    }

    const t = translations.client?.decoder;
    if (!t) return algorithmKey; // Fallback if translations not available

    switch (algorithmKey) {
        case 'auto': return t.algorithmAuto || 'Automatic (19xx/20xx)';
        case '19xx': return t.algorithm19xx || 'Force 19xx';
        case '20xx': return t.algorithm20xx || 'Force 20xx';
        default: return algorithmKey;
    }
}

// --- Main Wrapper Component ---
// Correctly places id='decode-root' on the main container.
export function InszDecoder({ translations, locale = 'nl' }: ClientDecoderProps) {
    // Serialize the translations and locale as data attributes
    const serializedTranslations = translations ? JSON.stringify(translations) : '';

    return (
        <div
            id='decode-root'
            className="w-full"
            data-ssr="true"
            data-translations={serializedTranslations}
            data-locale={locale}
        >
            <ClientInszDecoder translations={translations} locale={locale} />
        </div>
    );
}

// --- Core Client Decoder Component ---
// Contains algorithm state, dropdown, input, and output logic using layered input.
export function ClientInszDecoder({ translations, locale = 'nl' }: ClientDecoderProps) {
    // Helper function to get translated text

    const t = (key: string, defaultValue: string): string => {
        if (!translations) return defaultValue;

        // Try to get from client translations
        if (key.startsWith('client.decoder.')) {
            const decoderKey = key.replace('client.decoder.', '');
            return translations.client?.decoder?.[decoderKey] || defaultValue;
        }
        // Try to get from common translations
        else if (key.startsWith('common.')) {
            const commonKey = key.replace('common.', '') as keyof typeof translations.common;
            // Type assertion using keyof to tell TypeScript this is a valid key
            if (commonKey === 'male' || commonKey === 'female' || commonKey === 'notAvailable') {
                return translations.common[commonKey] || defaultValue;
            }
            return defaultValue;
        }

        return defaultValue;
    };

    // --- State ---
    const [inputValue, setInputValue] = useState<string>(''); // Holds the PLAIN TEXT value (digits only)
    const [debouncedValue, setDebouncedValue] = useState<string>(inputValue);
    const [decodedResult, setDecodedResult] = useState<DecodedInfo | null>(null);
    // Algorithm state is managed within this component
    const [selectedAlgorithm, setSelectedAlgorithm] = useState<InszAlgorithm>('auto');
    // Refs for synchronization
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    // --- Effects ---
    // Debounce user input
    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(inputValue);
        }, 300); // Debounce delay
        return () => {
            clearTimeout(handler); // Cleanup timeout on unmount or input change
        };
    }, [inputValue]);

    // Trigger decoding when debounced value or selected algorithm changes
    useEffect(() => {
        if (!debouncedValue) {
            setDecodedResult(null); // Clear results if input is empty
            return;
        }
        // Call the simulation function with current input and selected algorithm
        const result = simulateDecodeINSZ(debouncedValue, selectedAlgorithm);
        setDecodedResult(result);
    }, [debouncedValue, selectedAlgorithm]); // Dependencies: re-run if input or algorithm change

    // --- Event Handlers ---
    // Update input state from the TEXTAREA
    const handleInputChange = (e: Event) => {
        const target = e.currentTarget as HTMLTextAreaElement;
        // Keep only digits, max 11
        const digitsOnly = target.value.replace(/\D/g, '').slice(0, 11);
        setInputValue(digitsOnly);
    };

    // Update algorithm state when dropdown changes
    const handleAlgorithmChange = (e: Event) => {
        const target = e.currentTarget as HTMLSelectElement;
        setSelectedAlgorithm(target.value as InszAlgorithm);
    };

    // Scroll synchronization handler for layered input
    const handleScroll = (e: Event) => {
        const textarea = e.currentTarget as HTMLTextAreaElement;
        if (backdropRef.current) {
            // Sync backdrop scroll position with textarea scroll position
            backdropRef.current.scrollTop = textarea.scrollTop;
            backdropRef.current.scrollLeft = textarea.scrollLeft;
        }
    };

    // --- HTML Generation for Colored Spans in Backdrop ---
    const colorizedHtml = useMemo(() => {
        let html = '';
        const text = inputValue; // Use the plain digit state
        const dateColor = 'red';
        const sequenceColor = '#DAA520'; // Goldenrod
        const checksumColor = 'blue';

        const len = text.length;
        if (len > 0) html += `<span style="color: ${dateColor};">${text.substring(0, Math.min(len, 6))}</span>`;
        if (len > 6) html += `<span style="color: ${sequenceColor};">${text.substring(6, Math.min(len, 9))}</span>`;
        if (len > 9) html += `<span style="color: ${checksumColor};">${text.substring(9, Math.min(len, 11))}</span>`;

        // Add a non-breaking space ONLY if html has content to prevent collapse
        if (html) {
            html += ' ';
        } else {
            // If input is empty, ensure backdrop still occupies space correctly
            // An non-breaking space ensures height is maintained based on line-height
            html = ' ';
        }

        return html;
    }, [inputValue]); // Only recalculate when plain text inputValue changes

    // --- Dynamic Styling ---
    // Determine background/border color for the result box
    let resultContainerClass = "";
    if (decodedResult) {
        switch (decodedResult.status) {
            case 'error': resultContainerClass = "bg-red-50 border-red-200"; break;
            case 'valid': resultContainerClass = "bg-green-50 border-green-200"; break;
            case 'checksum_invalid': resultContainerClass = "bg-red-50 border-red-200"; break;
            case 'checksum_missing': resultContainerClass = "bg-orange-50 border-orange-200"; break;
            default: resultContainerClass = "bg-gray-50 border-gray-200"; break; // Fallback
        }
    } else { // Initial state
        resultContainerClass = "bg-gray-50 border-gray-200";
    }

    // Define common styles for textarea and backdrop for consistency
    // Explicitly adding line-height (Tailwind: leading-normal)
    const sharedInputClasses = "w-full h-48 border border-box text-base font-mono leading-normal resize-none overflow-auto whitespace-pre-wrap break-words box-border border-none";
    // Styles for the background div (colors) - ensure border width matches textarea even if transparent
    const backdropClasses = `${sharedInputClasses} absolute top-0 left-0 pointer-events-none select-none overflow-hidden border-transparent text-black rounded-md shadow-sm border-gray-300 ${resultContainerClass}`; // Match border color but make transparent
    // Styles for the actual textarea (visible caret, INVISIBLE text)
    const textareaClasses = `${sharedInputClasses} relative bg-transparent caret-black  focus:ring-2 focus:ring-blue-500 focus:border-transparent z-10 rounded-md border-gray-300 shadow-sm`; // Ensure focus styles work


    // --- Render Component ---
    return (
        // Use Fragment <> because the parent InszDecoder provides the main div with id
        <>
            {/* Algorithm Selection Dropdown */}
            <div className="mb-4 flex justify-center">
                <div className="flex items-center space-x-2">
                    <label htmlFor="insz-algorithm" className="text-sm font-medium text-gray-700">
                        {t('client.decoder.selectAlgorithm', 'Algorithm:')}
                    </label>
                    <select
                        id="insz-algorithm"
                        name="insz-algorithm"
                        className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-blue-500 sm:text-sm rounded-md shadow-sm"
                        value={selectedAlgorithm}
                        onChange={handleAlgorithmChange}
                    >
                        <option value="auto">{t('client.decoder.algorithmAuto', 'Automatic (19xx/20xx)')}</option>
                        <option value="19xx">{t('client.decoder.algorithm19xx', 'Force 19xx')}</option>
                        <option value="20xx">{t('client.decoder.algorithm20xx', 'Force 20xx')}</option>
                    </select>
                </div>
            </div>

            {/* Input and Output Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                {/* Input Card - Layered Approach */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col">
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {t('client.decoder.decoderTitle', 'Decoder National Register Number')}
                        </h2>
                    </div>
                    <div className={`p-4 sm:p-6 flex-grow flex flex-col ${resultContainerClass}`}>
                        {/* Relative container for positioning backdrop and textarea */}
                        <div className="relative flex-grow">
                            <label htmlFor="insz-client-textarea" className="sr-only">
                                {t('client.decoder.decoderTitle', 'Decoder National Register Number')}
                            </label>

                            {/* Background div for displaying colors */}
                            <div
                                ref={backdropRef}
                                aria-hidden="true" // Hide from assistive technologies
                                className={backdropClasses} // Use defined classes
                                dangerouslySetInnerHTML={{ __html: colorizedHtml }}
                            ></div>

                            {/* Actual Textarea (invisible text, visible cursor) */}
                            <textarea
                                ref={textareaRef}
                                id="insz-client-textarea"
                                name="insz-client"
                                value={inputValue} // Controlled by plain digit state
                                onInput={handleInputChange}
                                onScroll={handleScroll} // Sync scroll with backdrop
                                className={textareaClasses} // Use defined classes
                                // Force text transparency using inline style - IMPORTANT
                                style={{ color: 'transparent' }}
                                placeholder={t('client.decoder.enterNumber', "Enter a 9 or 11-digit national register number.")}
                                rows={3} // Suggest initial rows, height controlled by h-48
                                spellCheck={false}
                                autoComplete="off"
                            ></textarea>

                        </div>
                        {/* Disabled button */}
                        <div className="mt-4 text-center opacity-50 cursor-not-allowed" title="Results are updated live">
                            <button
                                type="button"
                                disabled
                                className="inline-flex justify-center items-center py-2.5 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-400 w-full sm:w-auto"
                            >
                                {t('decode.buttonText', 'Decode')}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Card */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col">
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">
                            {t('decode.resultsTitle', 'Results')}
                        </h2>
                    </div>
                    {/* Content area with dynamic background/border */}
                    <div className={`p-4 sm:p-6 flex-grow rounded-b-xl border ${resultContainerClass}`}>
                        {/* Initial placeholder text */}
                        {!decodedResult && !debouncedValue && (
                            <div className="h-full flex items-center justify-center text-center text-gray-500">
                                <p>{t('client.decoder.enterNumber', "Enter a 9 or 11-digit national register number.")}</p>
                            </div>
                        )}
                        {/* Render the actual results or error using the ResultContent component */}
                        {decodedResult && (
                            <ResultContent result={decodedResult} translations={translations} locale={locale} />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}