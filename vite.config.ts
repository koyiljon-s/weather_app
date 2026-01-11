// vite.config.ts
import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),          // ← add this line
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    },
  }
})