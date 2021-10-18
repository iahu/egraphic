import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@state', replacement: path.join(__dirname, './src/state') },
      { find: '@components', replacement: path.join(__dirname, './src/components') },
    ],
    preserveSymlinks: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash-es', 'nullthrows', 'react/jsx-dev-runtime'],
    exclude: ['@egret/fusion-components', 'monaco-editor', 'monaco-graphql'],
  },
})
