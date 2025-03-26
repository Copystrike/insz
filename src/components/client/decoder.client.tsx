// src/components/ClientDecoder.tsx
import { useState, useEffect } from 'hono/jsx'; // Use hooks from hono/jsx
import type { DecodedInfo } from '../../utils/insz-decoder';
import { simulateDecodeINSZ } from '../../utils/insz-decoder';
import type { TFunction } from '../../utils/i18n';
import { Tml } from '../../utils/i18n';

interface ClientDecoderProps {
    t: TFunction;
    lang: string; // Keep lang for potential future use
    initialValue?: string; // Passed from server
}

export function ClientDecoder({ t, lang, initialValue = '' }: ClientDecoderProps) {
    const [inputValue, setInputValue] = useState<string>(initialValue);
    const [decodedResult, setDecodedResult] = useState<DecodedInfo | null>(null);
    const [isInitialLoadWithInput, setIsInitialLoadWithInput] = useState(!!initialValue); // Flag for initial decode

    // Effect to decode whenever inputValue changes (or on initial load if initialValue exists)
    useEffect(() => {
        // Don't decode empty strings unless it was the initial non-empty value
        if (!inputValue && !isInitialLoadWithInput) {
            setDecodedResult(null); // Clear result if input is cleared by user
            return;
        }

        // Simulate decoding
        const result = simulateDecodeINSZ(inputValue);
        setDecodedResult(result);

        // Reset the initial load flag after the first run if needed
        if (isInitialLoadWithInput) {
            setIsInitialLoadWithInput(false);
        }

        // Basic debounce concept (optional, can be refined with libraries)
        // const handler = setTimeout(() => {
        //    if (!inputValue) {
        //      setDecodedResult(null);
        //      return;
        //    }
        //    const result = simulateDecodeINSZ(inputValue);
        //    setDecodedResult(result);
        // }, 200); // Decode after 200ms of inactivity
        // return () => clearTimeout(handler);

    }, [inputValue]); // Rerun effect when inputValue changes


    const handleInputChange = (e: Event) => {
        if (e.currentTarget instanceof HTMLTextAreaElement) {
            setInputValue(e.currentTarget.value);
        }
    };

    return (
        // Replicate the two-column layout structure here
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {/* --- Left Column: Input --- */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col">
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">{t('decode.formLabel')}</h2>
                </div>
                {/* No <form> needed for client-side updates, but keep structure */}
                <div className="p-4 sm:p-6 flex-grow flex flex-col">
                    <div className="flex-grow">
                        <label htmlFor="insz-client" className="sr-only">
                            {t('decode.formLabel')}
                        </label>
                        <textarea
                            id="insz-client" // Use different ID to avoid clash with potential SSR fallback
                            name="insz-client"
                            value={inputValue} // Bind value to state
                            onInput={handleInputChange} // Update state on input
                            className="w-full h-48 px-4 py-3 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-base font-mono resize-none"
                            placeholder={t('decode.formPlaceholder')}
                            maxLength={15}
                            rows={3}
                        ></textarea>
                    </div>
                    {/* Optional: Keep button for accessibility or non-JS fallback scenarios?
             If kept, it might need different logic or just be visual */}
                    <div className="mt-4 text-center opacity-50 cursor-not-allowed" title="Updates happen live as you type">
                        <button
                            type="button" // Change to type="button" as it doesn't submit a form now
                            disabled
                            className="inline-flex justify-center items-center py-2.5 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-400 focus:outline-none w-full sm:w-auto"
                        >
                            {t('decode.buttonText')}
                        </button>
                    </div>
                </div>
            </div>

            {/* --- Right Column: Output --- */}
            <div className="bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col">
                <div className="bg-gray-50 p-3 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">{t('decode.resultsTitle')}</h2>
                </div>
                <div className="p-4 sm:p-6 flex-grow">
                    {/* Conditional Rendering based on client-side state */}
                    {!decodedResult && !inputValue && (
                        <div className="h-full flex items-center justify-center text-center text-gray-500 bg-gray-50 rounded-md p-4">
                            <p>Enter an INSZ number in the format YYMMDD-SSS-CC to see the simulated decoded output here.</p>
                        </div>
                    )}

                    {decodedResult && decodedResult.errorKey && (
                        <div className="h-full flex items-center justify-center text-center bg-red-50 rounded-md p-4 border border-red-200">
                            <p className="text-red-700 font-medium">{t(decodedResult.errorKey)}</p>
                        </div>
                    )}

                    {decodedResult && !decodedResult.errorKey && (
                        <div className="space-y-3 text-sm text-gray-800 bg-green-50 p-4 rounded-md border border-green-200 font-mono">
                            <div className="flex">
                                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('decode.resultsInput')}:</span>
                                {/* Display client-side inputValue state */}
                                <span className="break-all">{inputValue}</span>
                            </div>
                            <div className="flex">
                                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('decode.resultsFormatCheck')}:</span>
                                <span>{decodedResult.isValidFormat ? Tml(t, 'decode.resultsFormatOk') : Tml(t, 'decode.resultsFormatInvalid')}</span>
                            </div>
                            <div className="flex">
                                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('decode.resultsBirthDate')}:</span>
                                <span>{decodedResult.simulatedBirthDate ? `${decodedResult.simulatedBirthDate}` : t('common.notAvailable')}</span>
                            </div>
                            <div className="flex">
                                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('decode.resultsGender')}:</span>
                                <span>{decodedResult.simulatedGenderKey ? t(decodedResult.simulatedGenderKey) : t('common.notAvailable')}</span>
                            </div>
                            <div className="flex">
                                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('decode.resultsSequence')}:</span>
                                <span>{decodedResult.simulatedSequence ? `${decodedResult.simulatedSequence}` : t('common.notAvailable')}</span>
                            </div>
                            <div className="flex">
                                <span className="font-medium text-gray-900 w-40 sm:w-48 flex-shrink-0">{t('decode.resultsChecksum')}:</span>
                                <span>{decodedResult.simulatedChecksumValid ? Tml(t, 'decode.resultsChecksumValid') : Tml(t, 'decode.resultsChecksumInvalid')}</span>
                            </div>
                            <p className="text-xs text-gray-500 pt-2 text-center">{t('decode.resultsReminder')}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}