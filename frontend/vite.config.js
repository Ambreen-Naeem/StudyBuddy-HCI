import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite configuration.
// The dev server proxies any request beginning with /api to the Flask
// backend running on http://localhost:5000 so the frontend can call
// relative URLs (e.g. /api/auth/login) without CORS headaches in dev.
export default defineConfig({
  plugins: [react()],
  server: {
    // Honor a PORT assigned by the tooling/harness; fall back to 5173 in normal dev.
    port: Number(process.env.PORT) || 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
