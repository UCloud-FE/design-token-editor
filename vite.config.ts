import { vitePluginCommonjs } from 'vite-plugin-commonjs';
import reactRefresh from '@vitejs/plugin-react-refresh';
import { defineConfig } from 'vite';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [reactRefresh(), vitePluginCommonjs()],
    build: {
        lib: {
            entry: path.resolve(__dirname, 'src/react/DesignTokenEditor.tsx'),
            name: 'design-token-editor',
            fileName: (format) => `design-token-editor.${format}.js`,
        },
        rollupOptions: {
            // make sure to externalize deps that shouldn't be bundled
            // into your library
            external: ['react'],
            output: {
                // Provide global variables to use in the UMD build
                // for externalized deps
                globals: {
                    react: 'React',
                },
            },
        },
        commonjsOptions: {
            defaultIsModuleExports: false,
        },
    },
});
