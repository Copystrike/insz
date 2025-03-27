import build from '@hono/vite-build/bun';
import devServer from '@hono/vite-dev-server';
import bunAdapter from '@hono/vite-dev-server/bun';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from "vite";

export default defineConfig(({ mode }) => {
    // Common plugins for all modes
    const commonPlugins = [tailwindcss()];

    if (mode === "client") {
        console.log("Building client...");
        return {
            plugins: commonPlugins, // Include Tailwind for client build
            build: {
                rollupOptions: {
                    input: "./src/client.tsx",
                    output: {
                        entryFileNames: "assets/[name]-[hash].js",
                    },
                },
                outDir: "./public",
                copyPublicDir: true,
                emptyOutDir: true,
                manifest: true,
            },
            publicDir: "./src/public",
        };
    }

    console.log("Building server...");
    const entry = "./src/index.tsx";
    return {
        server: { port: 3000 },
        plugins: [
            ...commonPlugins, // Include Tailwind for server build
            devServer({ adapter: bunAdapter, entry }),
            build({ entry }),
        ],
    };
});