import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Expose environment variables to the client
    'process.env': {}
  },
  server: {
    port: process.env.VITE_PORT || 5173,
    host: true
  }
})
