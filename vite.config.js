import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    allowedHosts: ['localhost', '127.0.0.1', "436f4e138eae.ngrok-free.app"],
    fs: {
      strict: false,
    }
  }
})
