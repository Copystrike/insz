import type { FC } from 'hono/jsx';
import type { TFunction } from '../utils/i18n';
import { create } from 'twind';
import { twindVirtualSheet } from '..';

interface NotFoundPageProps {
    t: TFunction;
    lang: string;
}

const NotFoundPage: FC<NotFoundPageProps> = ({ t, lang }) => {
    const { tw } = create({ sheet: twindVirtualSheet });

    return (
        <div className={tw`flex flex-col items-center justify-center min-h-[60vh] text-center px-4`}>
            <h1 className={tw`text-6xl font-bold text-blue-600 mb-4`}>404</h1>
            <h2 className={tw`text-2xl font-semibold text-gray-800 mb-2`}>{t('notFound.title')}</h2>
            <p className={tw`text-gray-600 mb-6`}>{t('notFound.subtitle')}</p>
            <a
                href={`/${lang}`}
                className={tw`bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition duration-300`}
            >
                {t('notFound.goHome')}
            </a>
        </div>
    );
};

export default NotFoundPage;