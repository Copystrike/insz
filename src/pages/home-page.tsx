import type { FC } from 'hono/jsx';
import Card from '../components/card';
import type { TFunction } from '../utils/i18n';
import { Tml } from '../utils/i18n'; // Import Tml for HTML content
import {  twindVirtualSheet } from '..';
import { create } from 'twind';

interface HomePageProps {
    t: TFunction;
    lang: string;
}

const HomePage: FC<HomePageProps> = ({ t, lang }) => {
    const { tw } = create({ sheet: twindVirtualSheet });

    return (
        <div className={tw`container mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12`}>
            {/* Hero Section */}
            <section className={tw`text-center mb-12 sm:mb-16`}>
                <h1 className={tw`text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 mb-4`}>
                    {t('home.title')}
                </h1>
                <p className={tw`text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto mb-8`}>
                    {t('home.subtitle')}
                </p>
                <a
                    href={`/${lang}/decode`}
                    className={tw`inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg shadow-md transition duration-300 ease-in-out transform hover:-translate-y-1`}
                >
                    {t('home.tryDecoder')}
                </a>
            </section>

            {/* Content Sections - Using Tml where translations contain HTML */}
            <div className={tw`grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10`}>
                <Card title={t('home.whatIsTitle')}>
                    <div className={tw`text-gray-700 space-y-4`}>
                        {Tml(t, 'home.whatIsP1')}
                        <p>{t('home.whatIsP2')}</p>
                    </div>
                </Card>

                <Card title={t('home.structureTitle')}>
                    <div className={tw`text-gray-700 space-y-3`}>
                        {Tml(t, 'home.structureYYMMDD')}
                        <p className={tw`text-sm text-gray-500`}>{t('home.structureNote')}</p>
                        {Tml(t, 'home.structureSSS')}
                        {Tml(t, 'home.structureCC')}
                    </div>
                </Card>

                <Card title={t('home.importanceTitle')} className={tw`md:col-span-2`}>
                    <ul className={tw`list-disc list-inside text-gray-700 space-y-2`}>
                        <li>{t('home.importanceLi1')}</li>
                        <li>{t('home.importanceLi2')}</li>
                        <li>{t('home.importanceLi3')}</li>
                        <li>{t('home.importanceLi4')}</li>
                        <li>{t('home.importanceLi5')}</li>
                    </ul>
                </Card>

                <Card title={t('home.privacyTitle')} className={tw`md:col-span-2 bg-yellow-50 border border-yellow-200`}>
                    <h4 className={tw`text-lg font-semibold text-yellow-800 mb-2`}>{t('home.privacyWarning')}</h4>
                    <p className={tw`text-yellow-700 space-y-3`}>
                        <span>{t('home.privacyP1')}</span>
                        <span>{t('home.privacyP2')}</span>
                        {Tml(t, 'home.privacyP3')}
                    </p>
                </Card>
            </div>
        </div>
    );
};

export default HomePage;