import { createServer } from 'node:http';
import { readFile, readdir } from 'node:fs/promises';
import { resolve, extname, join } from 'node:path';
import { pathToFileURL } from 'node:url';

const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.woff2': 'font/woff2', '.csv': 'text/csv' };

export async function createPreviewServer(root = resolve('out'), basePath = process.env.NEXT_PUBLIC_BASE_PATH || '') {
  const files = new Map();
  // Snapshot trusted build output; request data never reaches filesystem APIs.
  async function index(directory, prefix = '') {
    for (const entry of await readdir(directory, { withFileTypes: true })) {
      const file = join(directory, entry.name);
      const route = `${prefix}/${entry.name}`;
      if (entry.isDirectory()) await index(file, route);
      else if (entry.isFile()) {
        const content = { body: await readFile(file), type: types[extname(file)] || 'application/octet-stream' };
        files.set(route, content);
        if (entry.name === 'index.html') {
          files.set(`${prefix}/`, content);
          files.set(prefix || '/', content);
        }
      }
    }
  }
  await index(root);
  return createServer((req, res) => {
    try {
      const path = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
      if (basePath && path !== basePath && !path.startsWith(`${basePath}/`)) { res.writeHead(404).end(); return; }
      const content = files.get(path.slice(basePath.length) || '/');
      if (!content) { res.writeHead(404).end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': content.type });
      res.end(content.body);
    } catch { res.writeHead(404).end('Not found'); }
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  const server = await createPreviewServer();
  server.listen(4173, '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:4173${basePath}/`));
}
