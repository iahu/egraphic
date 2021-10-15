import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@state': path.join(__dirname, './src/state'),
      '@components': path.join(__dirname, './src/components'),
    },
    preserveSymlinks: true,
  },
  optimizeDeps: {
    exclude: ['@egret/fusion-components', 'monaco-editor', 'monaco-graphql'],
  },
})
