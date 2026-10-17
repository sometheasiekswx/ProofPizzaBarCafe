import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, symlink, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { createPreviewServer } from './serve.mjs';

for (const basePath of ['', '/ProofPizzaBarCafe']) {
  test(`preview serves indexed files only, base path ${basePath || '/'}`, async (t) => {
    const temp = await mkdtemp(join(tmpdir(), 'proof-preview-'));
    t.after(() => rm(temp, { recursive: true, force: true }));
    const root = join(temp, 'out');
    await mkdir(join(root, 'nested'), { recursive: true });
    await writeFile(join(root, 'index.html'), 'home');
    await writeFile(join(root, 'nested', 'index.html'), 'nested');
    await writeFile(join(root, 'style.css'), 'body{}');
    await writeFile(join(temp, 'secret.txt'), 'private');
    await symlink(join(temp, 'secret.txt'), join(root, 'leak.txt'));
    await symlink(temp, join(root, 'outside'));
    const server = await createPreviewServer(root, basePath);
    await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
    t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections(); }));
    const origin = `http://127.0.0.1:${server.address().port}`;
    for (const [path, body] of [['/', 'home'], ['/index.html', 'home'], ['/nested/', 'nested'], ['/nested', 'nested'], ['/style.css', 'body{}']]) {
      const response = await fetch(`${origin}${basePath}${path}?cache=1`);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), body);
    }
    assert.equal((await fetch(`${origin}${basePath}/style.css`)).headers.get('content-type'), 'text/css');
    for (const path of ['/leak.txt', '/outside/secret.txt', '/..%2fsecret.txt', '/%2e%2e%5csecret.txt', '/%00', '/%ZZ', '/missing']) {
      assert.equal((await fetch(`${origin}${basePath}${path}`)).status, 404, path);
    }
    if (basePath) assert.equal((await fetch(`${origin}${basePath}-other/`)).status, 404);
    await writeFile(join(root, 'index.html'), 'changed');
    assert.equal(await (await fetch(`${origin}${basePath}/`)).text(), 'home');
  });
}
