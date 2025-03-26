// src/pages/DecodePage.tsx
import type { FC } from 'hono/jsx';
import type { TFunction } from '../utils/i18n';
import { Tml } from '../utils/i18n';
import { twindVirtualSheet } from '..';
import { create } from 'twind';

interface DecodePageProps {
    t: TFunction;
    lang: string;
    inputValue?: string;
}

const DecodePage: FC<DecodePageProps> = ({ t, lang, inputValue = '' }) => {

    const { tw } = create({ sheet: twindVirtualSheet });


    return (
        <div className={tw`container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12`}>
            <h1 className={tw`text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center`}>
                {t('decode.title')}
            </h1>

            {/* --- DISCLAIMER --- */}
            <div className={tw`bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-md max-w-5xl mx-auto`} role="alert">
                <p className={tw`font-bold`}>{t('decode.disclaimerTitle')}</p>
                {Tml(t, 'decode.disclaimerP1')}
                <div className={tw`mt-2`}>{Tml(t, 'decode.disclaimerP2')}</div>
                <div className={tw`mt-2`}>{Tml(t, 'decode.disclaimerP3')}</div>
            </div>
            {/* --- END DISCLAIMER --- */}

            {/* --- Container for Client Component --- */}
            {/* This div will be targeted by the client-side script for hydration */}
            {/* Pass initial value via data attribute */}
            <div
                id="decoder-root"
                className={tw`max-w-5xl mx-auto`}
                data-initial-value={inputValue} // Embed initial value
                data-lang={lang} // Embed language
            >
                {/* Optional: Server-Side Rendered Placeholder (for initial paint before hydration) */}
                {/* This structure should roughly match ClientDecoder's initial state rendering */}
                <div className={tw`grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8`}>
                    {/* Left Column Placeholder */}
                    <div className={tw`bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col`}>
                        <div className={tw`bg-gray-50 p-3 border-b border-gray-200`}>
                            <h2 className={tw`text-lg font-semibold text-gray-800`}>{t('decode.formLabel')}</h2>
                        </div>
                        <div className={tw`p-4 sm:p-6 flex-grow flex flex-col`}>
                            <div className={tw`flex-grow`}>
                                <textarea
                                    id="insz-ssr"
                                    name="insz-ssr"
                                    defaultValue={inputValue} // SSR uses defaultValue
                                    className={tw`w-full h-48 px-4 py-3 border border-gray-300 rounded-md shadow-sm text-base font-mono resize-none bg-gray-100`} // Slightly styled as placeholder
                                    placeholder={t('decode.formPlaceholder')}
                                    maxLength={15}
                                    rows={3}
                                    readOnly // Make SSR version readonly before hydration
                                ></textarea>
                            </div>
                            <div className={tw`mt-4 text-center opacity-50`}>
                                <button type="button" disabled className={tw`inline-flex justify-center items-center py-2.5 px-8 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-gray-400 w-full sm:w-auto`}>
                                    {t('decode.buttonText')}
                                </button>
                            </div>
                        </div>
                    </div>
                    {/* Right Column Placeholder */}
                    <div className={tw`bg-white shadow-lg rounded-xl overflow-hidden border border-gray-200 flex flex-col`}>
                        <div className={tw`bg-gray-50 p-3 border-b border-gray-200`}>
                            <h2 className={tw`text-lg font-semibold text-gray-800`}>{t('decode.resultsTitle')}</h2>
                        </div>
                        <div className={tw`p-4 sm:p-6 flex-grow`}>
                            <div className={tw`h-full flex items-center justify-center text-center text-gray-500 bg-gray-50 rounded-md p-4`}>
                                <p>{/* Loading or initial placeholder text */}</p>
                            </div>
                        </div>
                    </div>
                </div>
                {/* End of SSR Placeholder */}
            </div>

        </div>
    );
};

export default DecodePage;