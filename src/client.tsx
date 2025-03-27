import { StrictMode } from "hono/jsx";
import { hydrateRoot } from "hono/jsx/dom/client";
import { ClientInszDecoder } from "./components/client/decoder.client";
import './styles.css';


const components = {
    "decode-root": ClientInszDecoder,
};

Object.entries(components).forEach(([rootId, Component]) => {
    const root = document.getElementById(rootId);
    if (!root) return;

    hydrateRoot(root, <StrictMode><Component /></StrictMode>);
});