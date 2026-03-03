import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // Never emit source maps in production — keeps source code private
    sourcemap: false,
    // Split vendor chunk for better caching
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          motion: ['framer-motion'],
        },
      },
    },
  },
  // Restrict dev server to localhost only
  server: {
    host: 'localhost',
  },
})
