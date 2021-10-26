import react from '@vitejs/plugin-react'
import path from 'path'
import { defineConfig } from 'vite'
import fs from 'fs'

const tsconfig = JSON.parse(fs.readFileSync('./tsconfig.json').toString('utf8'))
const { paths } = tsconfig.compilerOptions
const removeWildcards = (str: string) => str.replace('/*', '')
const alias = Object.keys(paths).map(key => {
  const find = removeWildcards(key)
  const findPath = removeWildcards(paths[key][0])
  return { find, replacement: path.join(__dirname, './src', findPath) }
})

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias,
    preserveSymlinks: true,
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'lodash-es', 'nullthrows', 'graphql', 'prettier', 'react/jsx-dev-runtime'],
    exclude: ['@egret/fusion-components', 'monaco-editor', 'monaco-graphql'],
  },
})
