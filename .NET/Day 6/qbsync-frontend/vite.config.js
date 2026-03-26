import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'https://localhost:7122',  // ✅ Must match your backend URL
        changeOrigin: true,
        secure: false,                     // ✅ Required for self-signed cert
        rewrite: (path) => path            // ✅ Keep /api prefix
      }
    }
  }
})