// @ts-nocheck
import path from 'path'
import { JSDOM }  from 'jsdom'
import fs  from 'fs'
import * as vite  from 'vite'

const rootDir = path.resolve(__dirname, '../');

function dev() {
  const htmlPath = path.resolve(rootDir, 'index.html');
  const targetHTMLPath = path.resolve(rootDir, 'dist/index.html');
  genIndexHtml(htmlPath, targetHTMLPath);

  buildMainCode();

  startDevServer();
}

// 生成 html 文件
function genIndexHtml(sourceHTMLPath, targetHTMLPath) {
  const htmlContent = fs.readFileSync(sourceHTMLPath, 'utf-8');
  const dom = new JSDOM(htmlContent);
  const {
    document
  } = dom.window

  const script = document.createElement('script');
  script.setAttribute('type', 'module');
  script.setAttribute('src', '/@vite/client');
  dom.window.document.head.insertBefore(script, document.head.firstChild);

  const base = document.createElement('base');
  base.setAttribute('href', 'http://127.0.0.1:3000/');
  dom.window.document.head.insertBefore(base, document.head.firstChild);

  const result = dom.serialize();
  fs.writeFileSync(targetHTMLPath, result);
}

// 构建 code.js 入口
async function buildMainCode() {
  const config = vite.defineConfig({
    configFile: false, // 关闭默认使用的配置文件
    build: {
      emptyOutDir: false, // 不要清空 dist 目录
      lib: {
        entry: path.resolve(rootDir, 'src/code.ts'),
        formats: ['es'],
        fileName: () => 'code.js',
      },
      watch: {},
    },
  });
  return vite.build(config);
}

// 开启 devServer
async function startDevServer() {
  const config = vite.defineConfig({
    configFile: path.resolve(rootDir, 'vite.config.ts'),
    root: rootDir,
    server: {
      hmr: {
        host: '127.0.0.1',
      },
      port: 3000,
    },
    build: {
      emptyOutDir: false,
      watch: {},
    }
  });
  const server = await vite.createServer(config);
  await server.listen()

  server.printUrls()
}

dev()