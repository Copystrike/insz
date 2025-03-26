import { defineConfig } from "vite";
import build from '@hono/vite-build/bun';
import devServer from '@hono/vite-dev-server';

export default defineConfig(({ mode }) => {
    const entry = "./src/index.tsx";
    return {
        plugins: [
            build({
                entry: entry,
                outputDir: "./dist"
            }),
            devServer({
                entry: entry,
            }),
        ]
    };
});