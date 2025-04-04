import type { FC } from 'hono/jsx';
import type { TFunction } from '../utils/i18n';
import { Tml, extractClientTranslations } from '../utils/i18n';
import { twindVirtualSheet } from '..';
import { create } from 'twind';
import { InszDecoder } from '../components/client/decoder.client';
import type { AppTranslations } from '../locales/en';

interface DecodePageProps {
    t: TFunction;
    lang: string;
    inputValue?: string;
    translations: AppTranslations;
}

const DecodePage: FC<DecodePageProps> = ({ t, lang, inputValue = '', translations }) => {
    const { tw } = create({ sheet: twindVirtualSheet });
    
    // Extract only the client-side translations to pass to the client component
    const clientTranslations = extractClientTranslations(translations);

    return (
        <div className={tw`container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12`}>
            <h1 className={tw`text-3xl sm:text-4xl font-bold text-gray-900 mb-6 text-center`}>
                {t('decode.title')}
            </h1>

            {/* --- DISCLAIMER --- */}
            <div className={tw`bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-8 rounded-md max-w-5xl mx-auto`} role="alert">
                <p>{Tml(t, 'decode.disclaimer')}</p>
            </div>
            {/* --- END DISCLAIMER --- */}


            {/* Pass translations and locale to the client component */}
            <InszDecoder 
                translations={clientTranslations}
                locale={lang}
            />

        </div >
    );
};

export default DecodePage;