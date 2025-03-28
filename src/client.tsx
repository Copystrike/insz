import { StrictMode } from "hono/jsx";
import { createRoot, hydrateRoot } from "hono/jsx/dom/client";
import { ClientInszDecoder } from "./components/client/decoder.client";
import './styles.css'

type ComponentRegistration = {
    id: string;
    component: any;
};

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
        hydrateRoot(
            ssrElement,
            <StrictMode>
                <Component />
            </StrictMode>,
        );
    }
});

// Handle SPA mounting
componentRegistry.forEach(({ id, component: Component }) => {
    const spaElement = document.getElementById(id);
    if (spaElement && !spaElement.dataset.ssr) {
        const root = createRoot(spaElement);
        root.render(
            <StrictMode>
                <Component />
            </StrictMode>,
        );
    }
});