// Tiny static server, no dependencies. PORT env or 3000.
const http = require('http'), fs = require('fs'), path = require('path');
const root = __dirname, port = process.env.PORT || 3000;
const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.png': 'image/png', '.svg': 'image/svg+xml', '.ico': 'image/x-icon' };
http.createServer((req, res) => {
  let p = decodeURIComponent((req.url || '/').split('?')[0]); if (p.endsWith('/')) p += 'index.html';
  const f = path.normalize(path.join(root, p));
  if (!f.startsWith(root) || /[\\/](\.git|node_modules|tests)([\\/]|$)/.test(f.slice(root.length))) { res.writeHead(403); return res.end('Forbidden'); }
  fs.readFile(f, (err, data) => {
    if (err) { res.writeHead(404, { 'content-type': 'text/plain' }); return res.end('Not found'); }
    const ext = path.extname(f); const noCache = ['.html', '.js', '.css', '.webmanifest'].includes(ext);
    res.writeHead(200, { 'content-type': MIME[ext] || 'application/octet-stream', 'cache-control': noCache ? 'no-cache' : 'public, max-age=86400' });
    res.end(data);
  });
}).listen(port, () => console.log(`Ages Idle RPG on http://localhost:${port}`));
