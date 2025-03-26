// src/views/Layout.tsx
import type { FC } from 'hono/jsx';
import { PropsWithChildren } from 'hono/jsx';
import Header from '../components/header';
import Footer from '../components/footer';
import type { TFunction, TranslationKeys } from '../utils/i18n';
import LanguageSwitcher from '../components/language-switcher';
import { getStyleTag, shim, virtualSheet, VirtualSheet } from 'twind/shim/server';
import { raw } from 'hono/html';
import { create, tw } from 'twind';
import { twindVirtualSheet } from '..';

type LayoutProps = PropsWithChildren<{
    t: TFunction;
    lang: string;
    currentPath: string;
    titleKey: TranslationKeys;
    virtualSheet: VirtualSheet;
}>;

const Layout: FC<LayoutProps> = async ({ t, lang, currentPath, titleKey, children }) => {
    // Uses meta.titleBase (updated in locales) and titleKey
    const pageTitle = `${t(titleKey)} - ${t('meta.titleBase')}`;

    const body = (
        <body className={tw`flex-col min-h-screen bg-gray-50 text-gray-800`}>
            <LanguageSwitcher lang={lang} currentPath={currentPath} t={t} />
            <Header t={t} lang={lang} currentPath={currentPath} />
            <main className={tw`flex-grow`}>{children}</main>
            <Footer t={t} lang={lang} />
        </body>
    ).toString();

    const shimmedBody = shim(body);

    const styleTag = getStyleTag(twindVirtualSheet);

    return (
        <html lang={lang}>
            <head>
                <meta charset="UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <title>{pageTitle}</title>
                {raw(styleTag)}
            </head>
            {raw(shimmedBody)}

        </html>
    );
};

export default Layout;