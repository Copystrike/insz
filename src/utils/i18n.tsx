import { AppTranslations } from '../locales/en';

// Helper to safely access nested properties
function getTranslationValue(obj: any, key: string): string | undefined {
    const keys = key.split('.');
    let current = obj;
    for (const k of keys) {
        // Added check for null/undefined to be safer
        if (current === null || current === undefined || typeof current !== 'object' || !(k in current)) {
            return undefined; // Path does not exist
        }
        current = current[k];
    }
    // Ensure the final value is actually a string before returning
    return typeof current === 'string' ? current : undefined;
}

// Type for the translation function
export type TFunction = (key: TranslationKeys, replacements?: Record<string, string>) => string;

// Function to create the 't' function
export function createT(translations: AppTranslations): TFunction {
    return (key: TranslationKeys, replacements?: Record<string, string>): string => {
        const rawValue = getTranslationValue(translations, key);

        // CRITICAL FIX: Ensure 'value' is always a string before proceeding.
        // Fallback to the key itself if translation is not found or not a string.
        let value: string = typeof rawValue === 'string' ? rawValue : String(key); // Use String(key) just in case key isn't string

        // Perform replacements on the guaranteed string 'value'
        if (replacements) {
            for (const RKey in replacements) {
                // Use a RegExp for global replacement to handle multiple occurrences like {var} {var}
                const regex = new RegExp(`\\{${RKey}\\}`, 'g');
                value = value.replace(regex, replacements[RKey]);
            }
        }
        return value; // Now guaranteed to return a string
    };
}

// Type for client translations - a subset of the full translations
export type ClientTranslations = {
    langCode: string;
    client: {
        decoder: Record<string, string>;
    };
    common: {
        male: string;
        female: string;
        notAvailable: string;
    };
};

// Function to extract only client-side translations
export function extractClientTranslations(translations: AppTranslations): ClientTranslations {
    return {
        langCode: translations.langCode,
        client: translations.client,
        common: translations.common
    };
}

// Helper type for decrementing depth (Prev)
type Prev = [never, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

type Join<K, P> = K extends string | number
    ? P extends string | number
    ? `${K}${P extends "" ? "" : "."}${P}`
    : never
    : never;

type Paths<T, D extends number = 10> = [D] extends [never]
    ? never
    : T extends object
    ? {
        [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
    : never;


// Generate the union type of all possible translation keys
export type TranslationKeys = Paths<AppTranslations>;

// --- Keep the Tml function ---
export function Tml(t: TFunction, key: TranslationKeys, replacements?: Record<string, string>) {
    const rawHtml = t(key, replacements);
    return <div dangerouslySetInnerHTML={{ __html: rawHtml }} />;
}