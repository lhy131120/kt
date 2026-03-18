import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import process from 'process'
import path from 'path'
import { fileURLToPath } from 'url'
import tailwindcss from '@tailwindcss/vite'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  base: process.env.NODE_ENV === 'production' ? '/kt/' : '/',
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom']
  }
})