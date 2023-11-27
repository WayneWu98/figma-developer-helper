import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      "@/*": "./src/*",
    }
  },
  build: {
    target: 'es2015',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      output: {
        entryFileNames: '[name].js',
      },
    },
    lib: {
        entry: resolve(__dirname, 'src/code.ts'),
        formats: ['es'],
        fileName: () => 'code.js',
      },
  }
})
