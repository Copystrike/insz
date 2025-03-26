import type { FC } from 'hono/jsx';
import type { TFunction } from '../utils/i18n';
import { create } from 'twind';
import { twindVirtualSheet } from '..';

interface HeaderProps {
    t: TFunction;
    lang: string;
    currentPath: string;
}


const Header: FC<HeaderProps> = ({ t, lang, currentPath }) => {
    const { tw } = create({ sheet: twindVirtualSheet });

    return (
        <header className={tw`bg-gradient-to-r from-blue-700 via-blue-800 to-gray-900 text-white shadow-lg sticky top-0 z-50`}>
            <nav className={tw`container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center`}>
                <a href={`/${lang}`} className={tw`text-2xl font-bold hover:text-blue-300 transition duration-300`}>
                    {t('meta.titleBase')}
                </a>
                <ul className={tw`flex space-x-6`}>
                    <li>
                        <a href={`/${lang}`} className={tw`text-lg hover:text-blue-300 transition duration-300`}>
                            {t('nav.introduction')}
                        </a>
                    </li>
                    <li>
                        <a href={`/${lang}/decode`} className={tw`text-lg hover:text-blue-300 transition duration-300`}>
                            {t('nav.decode')}
                        </a>
                    </li>
                </ul>
            </nav>
        </header>
    );
};

export default Header;