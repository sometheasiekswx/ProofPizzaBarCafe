import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { spawnSync } from 'node:child_process';
import { CATEGORIES, HEADERS, parseCsv, csvToMenu, validateSheetUrl, syncMenu } from './sync-menu.mjs';

const url = 'https://docs.google.com/spreadsheets/d/e/example/pub?output=csv';
const date = new Date('2026-01-01T00:00:00Z');
const row = ['pizza', 'Margherita', 'Fresh basil', 'Pizza', '8.25', '', 'Vegetarian|Classic', 'TRUE'];
const csv = (...rows) => [HEADERS.join(','), ...rows.map((r) => r.join(','))].join('\n');
const change = (index, value) => row.map((cell, i) => i === index ? value : cell);

test('CSV handles BOM, CRLF, quoted commas, escaped quotes and embedded newlines', () => {
  assert.deepEqual(parseCsv('\uFEFFa,b\r\n"hello, world","say ""hi""\r\nnext"\r\n'), [['a','b'], ['hello, world', 'say "hi"\r\nnext']]);
  assert.deepEqual(parseCsv('a,b,\n\n , , \n'), [['a','b','']]);
  assert.deepEqual(parseCsv('""'), []);
});

for (const invalid of ['"unterminated', 'a"b,c', '"a"x,b', '"a""']) {
  test(`reject malformed CSV ${JSON.stringify(invalid)}`, () => assert.throws(() => parseCsv(invalid), /Malformed CSV/));
}

test('normalizes menu, calculated and explicit KHR, tags, blank description and zero prices', () => {
  const menu = csvToMenu(csv(row), date);
  assert.deepEqual(menu, { source: 'google-sheets', updatedAt: date.toISOString(), exchangeRate: 4000, items: [{ id:'pizza', name:'Margherita', description:'Fresh basil', category:'Pizza', priceUsd:8.25, priceKhr:33000, tags:['Vegetarian','Classic'] }] });
  const custom = [...row]; custom[2]=''; custom[4]='0'; custom[5]='500'; custom[6]=' Vegan | |Vegan| Seasonal '; custom[7]='';
  assert.deepEqual(csvToMenu(csv(custom)).items[0], {...menu.items[0], description:'', priceUsd:0, priceKhr:500, tags:['Vegan','Seasonal']});
  assert.equal(csvToMenu(csv(change(4,'0.0002'))).items[0].priceKhr, 1);
});

test('accepts reordered headers and blank rows', () => {
  assert.equal(csvToMenu(`${[...HEADERS].reverse().join(',')}\n${[...row].reverse().join(',')}\n,,,,,,,\n`).items.length, 1);
});

test('availability hides false rows and explicitly allows all-hidden menus', () => {
  assert.equal(csvToMenu(csv(change(7,' false '))).items.length, 0);
  const other = [...row]; other[0]='other'; other[7]='FALSE';
  assert.equal(csvToMenu(csv(row, other)).items.length, 1);
});

for (const [index, value, pattern] of [
  [0,'',/id is required/], [1,'',/name is required/], [3,'',/category is required/], [3,'Pizzas',/unknown category/],
  [4,'',/nonnegative/], [4,'-1',/nonnegative/], [4,'NaN',/nonnegative/], [4,'Infinity',/nonnegative/], [4,'1e3',/nonnegative/], [4,'$2',/nonnegative/], [4,'0x10',/nonnegative/], [4,'9007199254740992',/too large/],
  [4,'9007199254740991',/safe whole/], [5,'-5',/nonnegative/], [5,'2.5',/safe whole/], [7,'yes',/available must/],
]) test(`reject invalid column ${HEADERS[index]}: ${value}`, () => assert.throws(() => csvToMenu(csv(change(index,value))), pattern));

test('reject duplicates, invalid hidden rows, wrong column counts, missing or duplicate headers, and unapproved empty sheets', () => {
  assert.throws(() => csvToMenu(csv(row, row)), /duplicate id/);
  const hidden = change(7,'FALSE'); hidden[4]='broken';
  assert.throws(() => csvToMenu(csv(hidden)), /nonnegative/);
  assert.throws(() => csvToMenu(csv(row.slice(1))), /columns/);
  assert.throws(() => csvToMenu(csv([...row,'extra'])), /columns/);
  for (const text of ['', '<html>Sign in</html>', HEADERS.slice(1).join(','), HEADERS.map(k => k === 'name' ? 'id' : k).join(',')]) assert.throws(() => csvToMenu(text), /headers/);
  assert.throws(() => csvToMenu(csv()), /no menu rows/);
});

test('only accepts approved HTTPS Google hosts and paths', () => {
  for (const value of [url, 'https://docs.googleusercontent.com/export/menu.csv']) assert.equal(validateSheetUrl(value).protocol, 'https:');
  for (const value of ['bad', 'http://docs.google.com/spreadsheets/d/x', 'https://docs.google.com/document/d/x', 'https://docs.google.com/spreadsheets-evil/x', 'https://docs.google.com.evil.test/spreadsheets/d/x', 'https://evil.test/', 'https://user:pass@docs.google.com/spreadsheets/d/x', 'https://docs.google.com:444/spreadsheets/d/x']) assert.throws(() => validateSheetUrl(value));
});

test('unset/blank configuration preserves bundled data without network or writes', async () => {
  for (const value of ['', '   ']) assert.deepEqual(await syncMenu({url:value, fetchImpl:()=>assert.fail('fetch'), write:()=>assert.fail('write')}), {skipped:true});
});

test('successful sync writes validated document once and passes timeout', async () => {
  let writes = 0;
  const result = await syncMenu({url, now:date, output:'unused', fetchImpl:async (requested, options) => {
    assert.equal(requested.href,url); assert.ok(options.signal instanceof AbortSignal);
    return {ok:true,text:async()=>csv(row)};
  }, write:async (path, content, encoding) => {
    writes++; assert.equal(path,'unused'); assert.equal(encoding,'utf8'); assert.deepEqual(JSON.parse(content),csvToMenu(csv(row),date));
  }});
  assert.equal(writes,1); assert.deepEqual(result,{skipped:false,count:1});
});

test('all-hidden sheet writes an empty approved menu', async () => {
  const result = await syncMenu({url, fetchImpl:async()=>({ok:true,text:async()=>csv(change(7,'FALSE'))}), write:async(_,content)=>assert.deepEqual(JSON.parse(content).items,[])});
  assert.equal(result.count,0);
});

test('HTTP, network, timeout, invalid CSV and URL failures never write', async () => {
  for (const fetchImpl of [
    async()=>({ok:false,status:403}), async()=>{throw new Error('Network unavailable');}, async()=>{throw new DOMException('Timeout','TimeoutError');},
    async()=>({ok:true,text:async()=>'<html>Sign in</html>'}), async()=>({ok:true,text:async()=>csv()}),
  ]) await assert.rejects(syncMenu({url,fetchImpl,write:()=>assert.fail('must preserve existing data')}));
  await assert.rejects(syncMenu({url:'https://example.com/',fetchImpl:()=>assert.fail('fetch'),write:()=>assert.fail('write')}));
});

test('write failures propagate', async () => {
  await assert.rejects(syncMenu({url,fetchImpl:async()=>({ok:true,text:async()=>csv(row)}),write:async()=>{throw new Error('Disk failure');}}), /Disk failure/);
});

test('bundled menu matches template and covers every category', async () => {
  const template = await readFile(new URL('../public/menu-template.csv',import.meta.url),'utf8');
  const bundled = JSON.parse(await readFile(new URL('../src/data/menu.json',import.meta.url),'utf8'));
  assert.equal(bundled.source,'sample'); assert.equal(bundled.updatedAt,null); assert.equal(bundled.exchangeRate,4000);
  assert.deepEqual(bundled.items,csvToMenu(template).items); assert.equal(bundled.items.length,18);
  assert.deepEqual(new Set(bundled.items.map(item=>item.category)),new Set(CATEGORIES));
  for (const name of ['Margherita','Funghi','Frutti di Mare']) assert.ok(bundled.items.some(item=>item.name===name));
});

test('import is side-effect free and CLI failures exit nonzero', () => {
  const script = new URL('./sync-menu.mjs',import.meta.url);
  const env = {...process.env, GOOGLE_SHEETS_CSV_URL:'invalid'};
  const imported = spawnSync(process.execPath,['--input-type=module','-e',`await import(${JSON.stringify(script.href)})`],{env,encoding:'utf8'});
  assert.equal(imported.status,0); assert.equal(imported.stdout,'');
  const failed = spawnSync(process.execPath,[script.pathname],{env,encoding:'utf8'});
  assert.equal(failed.status,1); assert.match(failed.stderr,/Menu sync failed/);
});
