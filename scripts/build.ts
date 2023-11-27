// @ts-nocheck
import path from 'path'
import * as vite  from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from "vite-plugin-singlefile"

const rootDir = path.resolve(__dirname, '../');

async function buildMainCode() {
  const config = vite.defineConfig({
    plugins: [vue(), viteSingleFile()],
    
    configFile: false,
    build: {
      emptyOutDir: false,
    },
  });
  return vite.build(config);
}

async function buildUICode() {
  const config = vite.defineConfig({
    plugins: [viteSingleFile()],
    configFile: false,
    build: {
      emptyOutDir: false,
      lib: {
        entry: path.resolve(rootDir, 'src/code.ts'),
        formats: ['es'],
        fileName: () => 'code.js',
      },
    },
  });
  return vite.build(config);
}

buildMainCode()
buildUICode()