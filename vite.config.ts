import { defineConfig } from 'vite';

export default defineConfig({
    optimizeDeps: {
        exclude: ['itk-wasm', '@itk-wasm/image-io']
    }
});