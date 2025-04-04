import { StrictMode } from "hono/jsx";
import { createRoot, hydrateRoot } from "hono/jsx/dom/client";
import { ClientInszDecoder } from "./components/client/decoder.client";
import './styles.css';

type ComponentRegistration = {
    id: string;
    component: any;
};

/**
 * Extract all serialized props from a DOM element's data attributes
 * This function dynamically extracts any data-* attributes that represent serialized props
 * and deserializes them into the appropriate JavaScript values.
 * 
 * @param element The DOM element containing serialized props in data attributes
 * @returns An object containing all deserialized props
 */
function getSerializedProps(element: HTMLElement): Record<string, any> {
    try {
        const props: Record<string, any> = {};

        // Get all data attributes
        const { dataset } = element;

        // Process each data attribute
        for (const [key, value] of Object.entries(dataset)) {
            // Skip the "ssr" attribute as it's not a prop
            if (key === 'ssr') continue;

            // For each attribute, try to parse JSON if it looks like JSON
            if (value) {
                try {
                    // If the value starts with { or [ it's likely JSON
                    if ((value.startsWith('{') && value.endsWith('}')) ||
                        (value.startsWith('[') && value.endsWith(']'))) {
                        props[key] = JSON.parse(value);
                    } else {
                        // Otherwise treat as a regular string
                        props[key] = value;
                    }
                } catch (parseError) {
                    // If JSON parsing fails, use the raw string value
                    console.warn(`Failed to parse data-${key} as JSON, using raw value`, parseError);
                    props[key] = value;
                }
            }
        }

        return props;
    } catch (error) {
        console.error('Failed to extract serialized props:', error);
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