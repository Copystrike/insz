// src/components/LanguageSwitcher.tsx
import type { FC } from 'hono/jsx';
import { supportedLanguages } from '../config';
import type { TFunction } from '../utils/i18n';
import { twindVirtualSheet } from '..';
import { create } from 'twind';

interface LanguageSwitcherProps {
    lang: string;
    currentPath: string;
    t?: TFunction;
}

const LanguageSwitcher: FC<LanguageSwitcherProps> = ({ lang, currentPath, t }) => {
    const { tw } = create({ sheet: twindVirtualSheet });

    const getLangSwitchUrl = (targetLang: string): string => {
        const pathSegments = currentPath.split('/').filter(Boolean);
        if (pathSegments.length > 0 && supportedLanguages.some(l => l.code === pathSegments[0])) {
            pathSegments[0] = targetLang;
        } else {
            pathSegments.unshift(targetLang);
        }
        return '/' + pathSegments.join('/');
    };

    if (supportedLanguages.length <= 1) return null;

    // Filter languages to only show those different from current
    const otherLanguages = supportedLanguages.filter(
        supportedLang => supportedLang.code !== lang
    );

    return (
        <div className="text-sm py-2 px-4 bg-gray-100 text-gray-700 text-center">
            {t ? t('language.viewWebsiteIn') : 'Bekijk deze website in het'} {' '}
            {otherLanguages.map((langInfo, index) => (
                <span key={langInfo.code}>
                    <a
                        href={getLangSwitchUrl(langInfo.code)}
                        className="font-medium text-blue-600 hover:underline"
                        aria-label={`Switch to ${langInfo.name}`}
                        title={`Switch to ${langInfo.name}`}
                    >
                        {langInfo.name}
                    </a>
                    {index < otherLanguages.length - 1 ? ' / ' : ''}
                </span>
            ))}
        </div>
    );
};

export default LanguageSwitcher;