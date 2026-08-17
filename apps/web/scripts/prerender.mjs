/**
 * 预渲染脚本
 * 在 vite build 之后运行：启动本地静态服务器，
 * 用无头浏览器渲染每个路由，把渲染后的完整 HTML 写入 dist，
 * 让 Google 等搜索引擎无需执行 JS 即可看到完整内容。
 *
 * 用法：node scripts/prerender.mjs
 */
import { chromium } from 'playwright';
import { createServer } from 'node:http';
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from 'node:fs';
import { join, extname, resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const distDir = join(root, 'dist');

// 与 sitemap 一致的路由列表（静态页 + 可见修行人 + 可见文章）
const routes = [
  '/',
  '/wiki',
  '/blog',
  '/about',
  '/wiki/author/qingliangyue',
  '/wiki/qingliangyue-chan-steps',
  '/wiki/qingliangyue-xindi-famen',
  '/wiki/qingliangyue-guanxin-1',
];

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

// 简单静态服务器（带 SPA fallback：找不到文件时返回 index.html）
const server = createServer((req, res) => {
  const url = new URL(req.url, 'http://localhost');
  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    pathname = url.pathname;
  }
  if (pathname === '/') pathname = '/index.html';

  const tryFile = (p) => {
    const fp = join(distDir, p);
    try {
      if (existsSync(fp) && statSync(fp).isFile()) return fp;
    } catch { /* ignore */ }
    return null;
  };

  let fp = tryFile(pathname);
  if (!fp) fp = tryFile(pathname + '/index.html');
  if (!fp) fp = tryFile('/index.html'); // SPA fallback

  if (!fp) {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
    return;
  }
  const ext = extname(fp).toLowerCase();
  res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
  res.end(readFileSync(fp));
});

await new Promise((r) => server.listen(0, '127.0.0.1', r));
const port = server.address().port;
const baseUrl = `http://127.0.0.1:${port}`;
console.log(`预渲染服务器已启动: ${baseUrl}`);

// 启动浏览器：优先用系统 Chrome，找不到则用 Playwright Chromium（必要时自动下载）
let browser;
try {
  browser = await chromium.launch({ channel: 'chrome', headless: true });
  console.log('使用系统 Chrome');
} catch (e1) {
  try {
    browser = await chromium.launch({ headless: true });
    console.log('使用 Playwright Chromium');
  } catch (e2) {
    console.error('未找到可用浏览器，正在下载 Playwright Chromium（Cloudflare 构建环境）...');
    try {
      const { execSync } = await import('node:child_process');
      execSync('npx playwright install chromium', { stdio: 'inherit', cwd: root });
      browser = await chromium.launch({ headless: true });
      console.log('已下载 Playwright Chromium');
    } catch (e3) {
      console.error('警告：无法启动浏览器进行预渲染，本次跳过预渲染（不影响站点部署）。');
      console.error('  原因: ' + (e3.message || e3));
      server.close();
      process.exit(0);
    }
  }
}

let ok = 0;
for (const route of routes) {
  const page = await browser.newPage();
  try {
    // 预渲染默认语言版本（面向英文读者，默认 en；中英文切换功能对访问者保留）
    await page.goto(baseUrl + route, { waitUntil: 'load', timeout: 30000 });
    // 等待 SPA 渲染完成：title 非空且 #root 内有实际内容
    await page.waitForFunction(
      () => {
        const title = (document.title || '').trim();
        const root = document.querySelector('#root');
        return title.length > 0 && root && root.innerHTML.trim().length > 50;
      },
      { timeout: 20000 },
    );
    // 再等一小段，让异步内容（图片/布局）稳定
    await page.waitForTimeout(800);

    const html = await page.content();

    const outPath = route === '/' ? join(distDir, 'index.html') : join(distDir, route, 'index.html');
    mkdirSync(dirname(outPath), { recursive: true });
    writeFileSync(outPath, html, 'utf8');
    const title = (html.match(/<title[^>]*>([^<]*)<\/title>/) || [])[1] || '';
    console.log(`  ✓ ${route} -> ${html.length} bytes (title: ${title.trim().slice(0, 40)})`);
    ok++;
  } catch (e) {
    console.error(`  ✗ ${route} 渲染失败: ${e.message}`);
  } finally {
    await page.close();
  }
}

await browser.close();
server.close();
console.log(`\n预渲染完成：${ok}/${routes.length} 个页面`);
if (ok < routes.length) {
  console.warn('有页面渲染失败，请检查！');
  process.exit(1);
}
