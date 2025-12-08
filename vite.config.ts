import { defineConfig } from 'vite'

// https://vite.dev/config/
// Note: This is a vanilla TypeScript project (no React)
// We're building a browser mechanics lab with plain DOM manipulation
export default defineConfig({
  // No plugins needed - we're using vanilla TypeScript
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
