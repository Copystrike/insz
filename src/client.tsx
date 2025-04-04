import { StrictMode } from "hono/jsx";
import { createRoot, hydrateRoot } from "hono/jsx/dom/client";
import { ClientInszDecoder } from "./components/client/decoder.client";
import './styles.css';
import type { ClientTranslations } from "./utils/i18n";

type ComponentRegistration = {
    id: string;
    component: any;
};

// Create a function to extract serialized props from the DOM element
function getSerializedProps(element: HTMLElement): { translations?: ClientTranslations; locale?: string; } {
    try {
        // Look for data attributes containing our serialized props
        const translationsAttr = element.dataset.translations;
        const localeAttr = element.dataset.locale;

        // Parse translations if available
        const translations = translationsAttr ? JSON.parse(translationsAttr) : undefined;

        return {
            translations,
            locale: localeAttr || 'en', // Default to 'en' if no locale is provided
        };
    } catch (error) {
        console.error('Failed to parse serialized props:', error);
        return {};
    }
}

const componentRegistry: ComponentRegistration[] = [
    {
        id: "decode-root",
        component: ClientInszDecoder,
    },
];

// Handle SSR hydration
componentRegistry.forEach(({ id, component: Component }) => {
    const ssrElement = document.getElementById(id);
    if (ssrElement?.dataset.ssr) {
        // Get serialized props from the DOM element
        const props = getSerializedProps(ssrElement);

        hydrateRoot(
            ssrElement,
            <StrictMode>
                <Component {...props} />
            </StrictMode>,
        );
    }
});

// Handle SPA mounting
componentRegistry.forEach(({ id, component: Component }) => {
    const spaElement = document.getElementById(id);

    if (spaElement && spaElement.dataset.ssr) {
        // Get serialized props from the DOM element
        const props = getSerializedProps(spaElement);
        console.log('Mounting component with props:', props);

        const root = createRoot(spaElement);
        root.render(
            <StrictMode>
                <Component {...props} />
            </StrictMode>,
        );
    }
});