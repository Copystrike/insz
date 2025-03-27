// src/pages/DecodePage.tsx
import type { FC } from 'hono/jsx';
import type { TFunction } from '../utils/i18n';
import { Tml } from '../utils/i18n';
import { twindVirtualSheet } from '..';
import { create } from 'twind';
import { InszDecoder } from '../components/client/decoder.client';


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


            {/* End of SSR Placeholder */}
            <InszDecoder />

        </div >
    );
};

export default DecodePage;