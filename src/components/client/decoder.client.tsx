// src/components/ClientDecoder.tsx
import { useState, useEffect, useRef, useMemo } from 'hono/jsx';
// Assuming these types are correctly defined in the specified path
import type { DecodedInfo, DecodedInfoResult, DecodedInfoFatalError, InszAlgorithm } from '../../utils/insz-decoder';
// Assuming this function is correctly defined in the specified path
import { simulateDecodeINSZ } from '../../utils/insz-decoder';

interface ClientDecoderProps {
    // Optional props like locale can be added here if needed
    // locale?: 'en' | 'nl' | 'fr';
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

/**
 * Maps algorithm keys to their user-friendly display names.
 */
const algorithmDisplayNames: Record<InszAlgorithm, string> = {
    'auto': 'Automatisch (19xx/20xx)',
    '19xx': 'Forceer 19xx',
    '20xx': 'Forceer 20xx',
};

/**
 * Maps algorithm century keys to simpler names for suggestions.
 */
const algorithmSuggestionNames: Record<'19xx' | '20xx', string> = {
    '19xx': '19xx',
    '20xx': '20xx',
};

/**
 * Simple HTML escaping function.
 * @param str The string to escape.
 * @returns The escaped string.
 */
const escapeHTML = (str: string) => {
    // Check if running in a browser environment before using DOM elements
    if (typeof document !== 'undefined') {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }
    // CORRECTED Fallback for non-browser environments (like SSR)
    return str
        .replace(/&/g, "&")
        .replace(/</g, "<")
        .replace(/>/g, ">")
        .replace(/"/g, "\"")
        .replace(/'/g, "'");
};


// --- ResultContent Component ---
/**
 * Renders the detailed results based on the decoded information.
 * Handles fatal errors, valid results, checksum errors, and missing checksums.
 */
function ResultContent({ result, locale = 'nl' }: { result: DecodedInfo, locale?: string; }) {

    // --- Fatal Error Case ---
    if (result.status === 'error') {
        let errorMessage: string;
        switch (result.errorKey) {
            case "INVALID_INPUT_TYPE": errorMessage = "Ongeldig invoertype."; break;
            case "INVALID_LENGTH": errorMessage = `Ongeldige lengte. Verwacht 9 of 11 cijfers, maar ${result.lengthFound ?? 'onbekend aantal'} ontvangen.`; break;
            case "INVALID_FORMAT": errorMessage = "Ongeldig formaat. Mag enkel cijfers bevatten."; break;
            case "INVALID_SEQUENCE": errorMessage = `Ongeldig reeksnummer (${result.invalidSequenceValue ?? 'N/B'}). Moet tussen 001 en 998 liggen.`; break;
            case "INVALID_DATE":
                const dateStr = result.dateParts ? `${result.dateParts.dd}/${result.dateParts.mm}/${result.dateParts.year ?? result.dateParts.yy}` : 'N/B';
                errorMessage = `Ongeldige datum (${dateStr}). De datum bestaat niet in de kalender.`;
                break;
            default: errorMessage = "Onbekende validatiefout."; break;
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
    const genderText = res.simulatedGenderKey === "common.male" ? "Man" : "Vrouw";
    const birthOrder = res.birthOrder;
    const suffix = getPositionSuffix(birthOrder!, locale); // Use non-null assertion assuming birthOrder is always present here
    const birthOrderMessage = birthOrder ? `De ${birthOrder}${suffix} ${genderText.toLowerCase()} geregistreerd op die dag` : "N/B";

    // Determine checksum display text, class, and notes based on status
    let checksumText: string, checksumClass: string, checksumNote = "";
    switch (res.status) {
        case 'valid':
            checksumText = "Correct";
            checksumClass = "text-green-800";
            break;
        case 'checksum_invalid':
            checksumText = "Ongeldig";
            checksumClass = "text-red-700 font-bold";
            if (res.algorithmUsed === 'auto') {
                const exp19 = res.expectedChecksum19xx !== undefined ? String(res.expectedChecksum19xx).padStart(2, '0') : '??';
                const exp20 = res.expectedChecksum20xx !== undefined ? String(res.expectedChecksum20xx).padStart(2, '0') : '??';
                checksumNote = `(Verwacht: ${exp20} voor 20xx of ${exp19} voor 19xx)`;
            } else if (res.calculatedChecksum !== undefined && res.birthYear !== undefined) {
                checksumNote = `(Verwacht: ${String(res.calculatedChecksum).padStart(2, '0')} voor ${res.birthYear})`;
            }
            break;
        case 'checksum_missing':
            checksumText = "Ontbreekt";
            checksumClass = "text-orange-600 font-bold";
            if (res.algorithmUsed === 'auto') {
                const exp19 = res.expectedChecksum19xx !== undefined ? String(res.expectedChecksum19xx).padStart(2, '0') : '??';
                const exp20 = res.expectedChecksum20xx !== undefined ? String(res.expectedChecksum20xx).padStart(2, '0') : '??';
                checksumNote = `(Zou ${exp19} zijn voor 19xx of ${exp20} voor 20xx)`;
            } else if (res.calculatedChecksum !== undefined && res.birthYear !== undefined) {
                checksumNote = `(Zou ${String(res.calculatedChecksum).padStart(2, '0')} zijn voor ${res.birthYear})`;
            }
            break;
        default: // Fallback
            checksumText = "N/B";
            checksumClass = "text-gray-500";
            break;
    }

    // --- Render the detailed results ---
    return (
        <div className="space-y-3 text-sm text-gray-800 font-mono">
            {/* Input Value */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Invoer:</span>
                <span className="break-all">{res.input}</span>
            </div>

            {/* Raw Components */}
            {res.components && (
                <>
                    <div className="flex">
                        <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Datumdeel (JJMMDD):</span>
                        <span>{res.components.datePart ?? 'N/B'}</span>
                    </div>
                    <div className="flex">
                        <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Reeksnummer (SSS):</span>
                        <span>{res.components.sequencePart ?? 'N/B'}</span>
                    </div>
                    <div className="flex">
                        <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Controlegetal (CC):</span>
                        <span>{res.components.checksumPart ?? <span className="text-orange-600">Ontbreekt</span>}</span>
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
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Algoritme Instelling:</span>
                <span className="font-semibold">{algorithmDisplayNames[res.algorithmUsed]}</span>
            </div>

            {/* Checksum Suggestion */}
            {res.algorithmUsed === 'auto' && res.suggestedAlgorithm && (
                <div className="flex">
                    <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Checksum Suggestie:</span>
                    <span className="text-gray-600">Geldig voor {algorithmSuggestionNames[res.suggestedAlgorithm]}</span>
                </div>
            )}

            {/* Checksum Status */}
            <div className="flex items-center">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Controlegetal:</span>
                <span className={checksumClass}>{checksumText}</span>
                {checksumNote && <span className="text-xs text-gray-500 ml-2">{checksumNote}</span>}
            </div>

            {/* Birth Date */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Geboortedatum:</span>
                <span>{res.simulatedBirthDate ?? "N/B"}</span>
                {res.guessedYear && <span className="text-xs text-orange-600 ml-2">(Jaar aangenomen)</span>}
            </div>

            {/* Gender */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Geslacht:</span>
                <span>{genderText}</span>
            </div>

            {/* Birth Order */}
            <div className="flex">
                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">Geboortevolgorde:</span>
                <span>{birthOrderMessage}</span>
            </div>

            {/* Disclaimer */}
            <p className={`text-xs ${res.status === 'valid' ? 'text-gray-500' :
                res.status === 'checksum_invalid' ? 'text-red-600' :
                    'text-orange-600' // checksum_missing
                } pt-2 text-center`}>
                {res.status === 'checksum_invalid' && <strong>LET OP: Controlegetal is ongeldig! </strong>}
                {res.status === 'checksum_missing' && <strong>LET OP: Controlegetal ontbreekt! Validatie onmogelijk. </strong>}
                {res.guessedYear && <strong>Jaar is aangenomen. </strong>}
                Afleiding gebaseerd op standaard algoritmes, enkel ter informatie.
            </p>
        </div>
    );
}


// --- Main Wrapper Component ---
// Correctly places id='decode-root' on the main container.
export function InszDecoder({ }: ClientDecoderProps) {
    return (
        <div id='decode-root' className="w-full"> {/* ID is here, component takes full width */}
            {/* Renders the client-side component which contains dropdown and cards */}
            <ClientInszDecoder />
        </div>
    );
}

// --- Core Client Decoder Component ---
// Contains algorithm state, dropdown, input, and output logic using layered input.
export function ClientInszDecoder({ /* locale = 'nl' */ }: ClientDecoderProps) {
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
            html += ' ';
        } else {
            // If input is empty, ensure backdrop still occupies space correctly
            // An non-breaking space ensures height is maintained based on line-height
            html = ' ';
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
                    <label htmlFor="insz-algorithm" className="text-sm font-medium text-gray-700"> Algoritme: </label>
                    <select
                        id="insz-algorithm"
                        name="insz-algorithm"
                        className="block w-full max-w-xs pl-3 pr-10 py-2 text-base border-gray-300 focus:ring-blue-500 sm:text-sm rounded-md shadow-sm"
                        value={selectedAlgorithm}
                        onChange={handleAlgorithmChange}
                    >
                        <option value="auto">Automatisch (19xx/20xx)</option>
                        <option value="19xx">Forceer 19xx</option>
                        <option value="20xx">Forceer 20xx</option>
                    </select>
                </div>
            </div>

            {/* Input and Output Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

                {/* Input Card - Layered Approach */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col">
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Decoder Rijksregisternummer / NISS</h2>
                    </div>
                    <div className={`p-4 sm:p-6 flex-grow flex flex-col ${resultContainerClass}`}>
                        {/* Relative container for positioning backdrop and textarea */}
                        <div className="relative flex-grow">
                            <label htmlFor="insz-client-textarea" className="sr-only"> Decoder Rijksregisternummer / NISS </label>

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
                                placeholder="Voer 9 of 11 cijfers in..."
                                rows={3} // Suggest initial rows, height controlled by h-48
                                spellCheck={false}
                                autoComplete="off"
                            ></textarea>

                        </div>
                        {/* Disabled button */}
                        <div className="mt-4 text-center opacity-50 cursor-not-allowed" title="Resultaten worden live bijgewerkt">
                            <button
                                type="button"
                                disabled
                                className="inline-flex justify-center items-center py-2.5 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-400 w-full sm:w-auto"
                            >
                                Decoderen
                            </button>
                        </div>
                    </div>
                </div>

                {/* Output Card */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col">
                    <div className="bg-gray-50 p-3 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-800">Resultaten</h2>
                    </div>
                    {/* Content area with dynamic background/border */}
                    <div className={`p-4 sm:p-6 flex-grow rounded-b-xl border ${resultContainerClass}`}>
                        {/* Initial placeholder text */}
                        {!decodedResult && !debouncedValue && (
                            <div className="h-full flex items-center justify-center text-center text-gray-500">
                                <p>Voer een 9- of 11-cijferig rijksregisternummer in.</p>
                            </div>
                        )}
                        {/* Render the actual results or error using the ResultContent component */}
                        {decodedResult && (
                            <ResultContent result={decodedResult} /* locale={locale} */ />
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}