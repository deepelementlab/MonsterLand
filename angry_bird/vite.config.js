import { defineConfig } from 'vite';

export default defineConfig({
    base: './',
    build: {
        // Phaser是大型框架，1500KB是正常的
        chunkSizeWarningLimit: 1600,
        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser']
                }
            }
        }
    }
});
