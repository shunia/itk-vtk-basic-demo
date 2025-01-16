import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

export default defineConfig({
    plugins: [
        viteStaticCopy({
            targets: [
                { src: './node_modules/itk-wasm/dist/pipeline/**/*', dest: 'itk' },
                { src: './node_modules/@itk-wasm/image-io/dist/pipelines/**/*', dest: 'itk' },
            ]
        })
    ],
    optimizeDeps: {
        exclude: ['itk-wasm', '@itk-wasm/image-io']
    }
});