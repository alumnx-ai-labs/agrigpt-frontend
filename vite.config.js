import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api/agent': {
                target: 'https://newapi.alumnx.com/agrigpt/agent',
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api\/agent/, '')
            }
        }
    }
})
