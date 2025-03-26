// src/components/Footer.tsx
import type { FC } from 'hono/jsx';
import type { TFunction } from '../utils/i18n';
import { Tml } from '../utils/i18n'; // Import Tml for HTML entities
import { create } from 'twind';
import { twindVirtualSheet } from '..';

interface FooterProps {
    t: TFunction;
    lang: string;
}

const Footer: FC<FooterProps> = ({ t }) => {
    const { tw } = create({ sheet: twindVirtualSheet });

    const currentYear = new Date().getFullYear();
    return (
        <footer className={tw`bg-gray-100 text-gray-600 py-6 mt-auto border-t border-gray-200`}>
            <div className={tw`container mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm`}>
                {/* Uses footer.copyright (updated in locales) */}
                {Tml(t, 'footer.copyright', { year: currentYear.toString() })}
                <p className={tw`mt-1`}>{t('footer.informational')}</p>
                {/* Uses footer.simulationWarning (updated in locales) */}
                <p className={tw`mt-1 text-red-600 font-semibold`}>{t('footer.simulationWarning')}</p>
            </div>
        </footer>
    );
};

export default Footer;