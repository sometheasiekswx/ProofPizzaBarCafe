import { writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';

export const CATEGORIES = ['Pizza', 'Small plates', 'Cocktails', 'Wine', 'Coffee & more'];
export const HEADERS = ['id', 'name', 'description', 'category', 'price_usd', 'price_khr', 'tags', 'available'];
export const EXCHANGE_RATE = 4000;
const OUTPUT = new URL('../src/data/menu.json', import.meta.url);

export function parseCsv(input) {
  const text = input.replace(/^\uFEFF/, '');
  const rows = [];
  let row = [], field = '', quoted = false, closed = false;
  const endField = () => { row.push(field); field = ''; closed = false; };
  const endRow = () => { endField(); rows.push(row); row = []; };
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (quoted) {
      if (char === '"') {
        if (text[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; closed = true; }
      } else { field += char; }
    } else if (char === ',') { endField(); }
    else if (char === '\r' || char === '\n') {
      if (char === '\r' && text[i + 1] === '\n') i++;
      endRow();
    } else if (char === '"' && field === '' && !closed) { quoted = true; }
    else {
      if (closed || char === '"') throw new Error('Malformed CSV: unexpected character or quote');
      field += char;
    }
  }
  if (quoted) throw new Error('Malformed CSV: unclosed quoted field');
  if (field !== '' || row.length || closed) endRow();
  return rows.filter((cells) => cells.some((cell) => cell.trim() !== ''));
}

function money(value, label) {
  if (!/^\d+(?:\.\d+)?$/.test(value)) throw new Error(`${label}: use a nonnegative number without currency symbols or separators`);
  const number = Number(value);
  if (!Number.isFinite(number) || number > Number.MAX_SAFE_INTEGER) throw new Error(`${label}: amount is too large`);
  return number;
}

export function csvToMenu(csv, now = new Date()) {
  const [header, ...rows] = parseCsv(csv);
  if (!header || header.length !== HEADERS.length || new Set(header.map((cell) => cell.trim())).size !== HEADERS.length || HEADERS.some((key) => !header.map((cell) => cell.trim()).includes(key))) {
    throw new Error(`CSV must contain exactly these headers: ${HEADERS.join(',')}`);
  }
  if (!rows.length) throw new Error('CSV has no menu rows; to intentionally empty the menu, set all rows available=false');
  const keys = header.map((cell) => cell.trim());
  const seen = new Set();
  const items = [];
  for (const [index, cells] of rows.entries()) {
    const label = `Menu row ${index + 2}`;
    if (cells.length !== keys.length) throw new Error(`${label}: expected ${keys.length} columns`);
    const record = Object.fromEntries(keys.map((key, i) => [key, cells[i].trim()]));
    for (const key of ['id', 'name', 'category']) {
      if (!record[key]) throw new Error(`${label}: ${key} is required`);
    }
    if (seen.has(record.id)) throw new Error(`${label}: duplicate id ${record.id}`);
    seen.add(record.id);
    if (!CATEGORIES.includes(record.category)) throw new Error(`${label}: unknown category ${record.category}`);
    const available = record.available.toLowerCase();
    if (!['', 'true', 'false'].includes(available)) throw new Error(`${label}: available must be TRUE, FALSE, or blank`);
    const priceUsd = money(record.price_usd, `${label} price_usd`);
    const priceKhr = record.price_khr === '' ? Math.round(priceUsd * EXCHANGE_RATE) : money(record.price_khr, `${label} price_khr`);
    if (!Number.isSafeInteger(priceKhr)) throw new Error(`${label}: price_khr must be a safe whole number`);
    if (available === 'false') continue;
    items.push({ id: record.id, name: record.name, description: record.description, category: record.category, priceUsd, priceKhr, tags: [...new Set(record.tags.split('|').map((tag) => tag.trim()).filter(Boolean))] });
  }
  return { source: 'google-sheets', updatedAt: now.toISOString(), exchangeRate: EXCHANGE_RATE, items };
}

export function validateSheetUrl(value) {
  let url;
  try { url = new URL(value); } catch { throw new Error('GOOGLE_SHEETS_CSV_URL must be a valid HTTPS Google Sheets URL'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port || !((url.hostname === 'docs.google.com' && url.pathname.startsWith('/spreadsheets/')) || url.hostname === 'docs.googleusercontent.com')) {
    throw new Error('GOOGLE_SHEETS_CSV_URL must use https://docs.google.com/spreadsheets/ or https://docs.googleusercontent.com/');
  }
  return url;
}

export async function syncMenu({ url = process.env.GOOGLE_SHEETS_CSV_URL, fetchImpl = fetch, write = writeFile, output = OUTPUT, now = new Date() } = {}) {
  if (url === undefined || url.trim() === '') return { skipped: true };
  const sheetUrl = validateSheetUrl(url.trim());
  const response = await fetchImpl(sheetUrl, { signal: AbortSignal.timeout(20_000), headers: { Accept: 'text/csv' } });
  if (!response.ok) throw new Error(`Google Sheets returned HTTP ${response.status}`);
  const menu = csvToMenu(await response.text(), now);
  // Validate the entire response before touching the existing bundled data.
  await write(output, `${JSON.stringify(menu, null, 2)}\n`, 'utf8');
  return { skipped: false, count: menu.items.length };
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  syncMenu().then((result) => {
    console.log(result.skipped ? 'Menu sync: no sheet configured; keeping bundled data.' : `Menu sync: published ${result.count} items.`);
  }).catch((error) => {
    console.error(`Menu sync failed: ${error.message}`);
    process.exitCode = 1;
  });
}
