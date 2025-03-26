import { StrictMode } from "hono/jsx";
import { hydrateRoot } from "hono/jsx/dom/client";

const root = document.getElementById("root");
if (!root) {
    throw new Error("Root element not found");
}

hydrateRoot(
    root,
    <StrictMode>
        <h1>Welcome to the Client Component</h1>
    </StrictMode>
);