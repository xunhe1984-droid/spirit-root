/**
 * 自动生成 sitemap.xml
 * 从 articlesData.js 读取全部已发布文章与修行人，生成真实 URL 列表。
 * 在 vite build 前自动运行（见 package.json build 脚本）。
 */
import { writeFileSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// 读取文章数据（ESM 直接导入）
const { default: articlesData } = await import(resolve(root, 'src/lib/articlesData.js'));

// 读取修行人数据
const { PRACTITIONERS } = await import(resolve(root, 'src/lib/practitioners.js'));

const SITE = 'https://spiritroot.online';

// 固定页面（按优先级排序）
const staticPages = [
  { loc: '/', lastmod: null, changefreq: 'daily', priority: '1.0' },
  { loc: '/wiki', lastmod: null, changefreq: 'daily', priority: '0.9' },
  { loc: '/blog', lastmod: null, changefreq: 'weekly', priority: '0.8' },
  { loc: '/about', lastmod: null, changefreq: 'monthly', priority: '0.6' },
];

function toDateStr(d) {
  if (!d) return null;
  const date = new Date(d);
  if (Number.isNaN(date.getTime())) return null;
  return date.toISOString().slice(0, 10);
}

const entries = [];

// 静态页面
for (const p of staticPages) {
  entries.push({
    loc: SITE + p.loc,
    lastmod: p.lastmod,
    changefreq: p.changefreq,
    priority: p.priority,
  });
}

// 可见修行人页面
for (const p of PRACTITIONERS) {
  if (p.hidden) continue;
  entries.push({
    loc: `${SITE}/wiki/author/${p.slug}`,
    lastmod: null,
    changefreq: 'weekly',
    priority: '0.7',
  });
}

// 已发布文章
for (const a of articlesData) {
  if (a.status !== 'published') continue;
  entries.push({
    loc: `${SITE}/${a.type}/${a.slug}`,
    lastmod: toDateStr(a.updated || a.publishAt || a.created),
    changefreq: 'monthly',
    priority: a.type === 'wiki' ? '0.7' : '0.6',
  });
}

// 生成 XML
const lines = ['<?xml version="1.0" encoding="UTF-8"?>'];
lines.push('<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">');
for (const e of entries) {
  lines.push('  <url>');
  lines.push(`    <loc>${e.loc}</loc>`);
  if (e.lastmod) lines.push(`    <lastmod>${e.lastmod}</lastmod>`);
  lines.push(`    <changefreq>${e.changefreq}</changefreq>`);
  lines.push(`    <priority>${e.priority}</priority>`);
  lines.push('  </url>');
}
lines.push('</urlset>');

const xml = lines.join('\n') + '\n';
const outDir = resolve(root, 'public');
mkdirSync(outDir, { recursive: true });
const outFile = resolve(outDir, 'sitemap.xml');
writeFileSync(outFile, xml, 'utf8');

console.log(`[sitemap] 已生成 ${entries.length} 条 URL → ${outFile}`);
