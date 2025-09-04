import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
    plugins: [
        react(),
        tailwindcss()
    ],
    resolve: {
        alias: {
            '@src': '/src',
            '@components': '/src/components',
            '@features': '/src/features',
            '@store': '/src/store',
            '@routes': '/src/routes',
            '@assets': '/src/assets',
            '@type': '/src/types'
        }
    }
})