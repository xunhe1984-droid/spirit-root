import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST = path.resolve(__dirname, 'dist');
const DB_PATH = path.resolve(__dirname, '../pocketbase/pb_data/data.db');
const PORT = 3000;

const MIME = {
  '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon', '.json': 'application/json', '.woff2': 'font/woff2',
};

function queryCollection(collection, filterStr, sortStr, recordId, page, perPage) {
  let sql;
  if (recordId) {
    sql = `SELECT * FROM "${collection}" WHERE id = '${recordId.replace(/'/g, "''")}'`;
  } else {
    sql = `SELECT * FROM "${collection}"`;
  }
  
  const escapedSql = sql.replace(/"/g, '\\"');
  const result = execSync(`sqlite3 -json "${DB_PATH}" "${escapedSql}"`, {
    encoding: 'utf-8',
    maxBuffer: 50 * 1024 * 1024,
  });
  
  let items = JSON.parse(result || '[]');
  
  // Apply filter
  if (filterStr && !recordId) {
    const conditions = filterStr.split('&&').map(s => s.trim()).filter(Boolean);
    items = items.filter(row => {
      return conditions.every(cond => {
        const m = cond.match(/(\w+)\s*(=|!=)\s*(?:"([^"]*)"|'([^']*)')/);
        if (!m) return true;
        const [, field, op, v1, v2] = m;
        const val = v1 ?? v2 ?? '';
        const rowVal = String(row[field] ?? '');
        return op === '=' ? rowVal === val : rowVal !== val;
      });
    });
  }
  
  // Apply sort
  if (sortStr && !recordId) {
    const parts = sortStr.split(',').map(s => s.trim()).filter(Boolean);
    items.sort((a, b) => {
      for (const part of parts) {
        const desc = part.startsWith('-');
        const field = desc ? part.slice(1) : part;
        const va = String(a[field] ?? '');
        const vb = String(b[field] ?? '');
        const cmp = va.localeCompare(vb);
        if (cmp !== 0) return desc ? -cmp : cmp;
      }
      return 0;
    });
  }
  
  const total = items.length;
  const start = ((page || 1) - 1) * (perPage || 500);
  const paged = items.slice(start, start + (perPage || 500));
  
  return paged.map(item => ({
    ...item,
    collectionId: collection,
    collectionName: collection,
  }));
}

function serveStatic(req, res) {
  const reqPath = req.url.split('?')[0].split('#')[0];
  let filePath = path.join(DIST, reqPath === '/' ? 'index.html' : reqPath);
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(DIST, 'index.html');
  }
  const ext = path.extname(filePath);
  const ct = MIME[ext] || 'application/octet-stream';
  try {
    const content = fs.readFileSync(filePath);
    res.writeHead(200, { 'Content-Type': ct });
    res.end(content);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const p = url.pathname;
  
  // Log all requests
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${p}`);
  
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  
  if (req.method === 'OPTIONS') { res.writeHead(204); res.end(); return; }
  
  // PocketBase API
  if (p.startsWith('/hcgi/platform/api/')) {
    const api = p.replace('/hcgi/platform/api/', '');
    const parts = api.split('/');
    
    if (api === 'health') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ code: 200, message: 'OK' }));
      return;
    }
    
    // collections/{name}/records
    if (parts[0] === 'collections' && parts[2] === 'records') {
      const collection = parts[1];
      const recordId = parts[3];
      
      try {
        const filterStr = url.searchParams.get('filter') || '';
        const sortStr = url.searchParams.get('sort') || '-created';
        const perPage = parseInt(url.searchParams.get('perPage') || '500');
        const page = parseInt(url.searchParams.get('page') || '1');
        
        console.log(`   -> collection=${collection}, filter=${filterStr.substring(0, 60)}`);
        
        const items = queryCollection(collection, filterStr, sortStr, recordId, page, perPage);
        
        console.log(`   -> ${items.length} items returned`);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        if (recordId) {
          res.end(JSON.stringify(items[0] || null));
        } else {
          res.end(JSON.stringify({
            page, perPage, totalItems: items.length, totalPages: 1, items,
          }));
        }
      } catch (e) {
        console.log(`   -> ERROR: ${e.message}`);
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: e.message }));
      }
      return;
    }
    
    // files proxy
    const fMatch = p.match(/\/hcgi\/platform\/api\/files\/(\w+)\/([^/]+)\/(.+)/);
    if (fMatch) {
      const filename = fMatch[3];
      res.writeHead(302, { Location: `https://images.hostinger.com/${filename}` });
      res.end();
      return;
    }
    
    // auth-with-password
    if (api.includes('auth-with-password')) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ token: 'preview-token', record: { id: 'preview', email: 'preview@test.com' } }));
      return;
    }
    
    // Other
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({}));
    return;
  }
  
  serveStatic(req, res);
});

server.listen(PORT, '::', () => {
  console.log(`🚀 Spirit Root preview running at http://localhost:${PORT}/`);
  console.log(`   Static: ${DIST}`);
  console.log(`   DB: ${DB_PATH} (exists: ${fs.existsSync(DB_PATH)})`);
});
