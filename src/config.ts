export const defaultLanguage = 'nl'; // Or 'nl' if you prefer

export const supportedLanguages = [
    { code: 'nl', name: 'Nederlands', import: () => import('./locales/nl').then(m => m.nl) },
    { code: 'fr', name: 'Français', import: () => import('./locales/fr').then(m => m.fr) },
    { code: 'en', name: 'English', import: () => import('./locales/en').then(m => m.en) },
];

export const supportedLangCodes = supportedLanguages.map(l => l.code);