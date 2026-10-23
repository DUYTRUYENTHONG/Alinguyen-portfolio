// Static export only; CSP blocks external API writes before app initialization.
const http = require('node:http');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '../../../out');
const types = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.svg':'image/svg+xml','.png':'image/png','.webp':'image/webp','.woff2':'font/woff2','.pdf':'application/pdf','.docx':'application/vnd.openxmlformats-officedocument.wordprocessingml.document'};
http.createServer((req,res)=>{
  const fixture = req.url.startsWith('/fixture/');
  // /fixture/ is used only after browser Fetch interception has been enabled.
  res.setHeader('Content-Security-Policy', fixture ? "connect-src 'self' https://ali-portfolio-visitor-api.vercel.app" : "connect-src 'self'");
  res.setHeader('Cache-Control','no-store');
  if (req.url === '/audit-bootstrap') { res.setHeader('Content-Type','text/html'); res.end('<!doctype html><title>Audit bootstrap</title><p>Local audit bootstrap.</p>'); return; }
  const pathname = decodeURIComponent(new URL(req.url,'http://localhost').pathname).replace(/^\/fixture(?=\/)/,'').replace(/^\/Alinguyen-portfolio(?=\/|$)/,'');
  let file = path.resolve(root,'.'+pathname);
  if (!file.startsWith(root+path.sep) && file!==root) {res.writeHead(403);res.end();return;}
  if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file=path.join(file,'index.html');
  if (!fs.existsSync(file)) {res.writeHead(404);res.end('Not found');return;}
  res.setHeader('Content-Type',types[path.extname(file)]||'application/octet-stream');
  fs.createReadStream(file).pipe(res);
}).listen(3022,'127.0.0.1',()=>console.log('Audit static server: http://127.0.0.1:3022/Alinguyen-portfolio/'));
