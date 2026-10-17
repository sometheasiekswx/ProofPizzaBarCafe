# Google Sheets menu publishing

The website reads `src/data/menu.json` at build time. There is no browser-side Google request, private API key, or live spreadsheet connection. No real sheet is configured yet: the bundled 18-item menu is **illustrative sample content**, not verified restaurant prices, ingredients, or dietary information. The owner must approve these before publishing.

## Owner setup

1. Create a dedicated Google spreadsheet for the public menu. Import `public/menu-template.csv` into a tab named **Menu**. Keep the first-row headers unchanged. Replace the examples with your approved dishes, descriptions and prices; retain a unique, stable `id` for each dish.
2. In **File → Share → Publish to web**, choose **only the Menu tab**, not the entire document, and select **Comma-separated values (.csv)**. Enable automatic republishing when changes are made, then publish and copy the published CSV link. A normal editor/share link is not a CSV export.
3. Open the link in a signed-out/private browser window. It must download CSV without asking for sign-in. Publication makes the selected content public to anyone with the link. Never put customer details, staff records, supplier costs, passwords or other private content in the published tab. A dedicated menu-only spreadsheet is safest.
4. In GitHub, open the repository's **Settings → Secrets and variables → Actions → Variables → New repository variable**. Set `GOOGLE_SHEETS_CSV_URL` to the published CSV URL. This is public information, so it is a repository variable, not a credential.
5. The deployment workflow must pass `${{ vars.GOOGLE_SHEETS_CSV_URL }}` into the build environment as `GOOGLE_SHEETS_CSV_URL` and run the sync script **before** Next.js builds. Setting a repository variable alone does not configure a workflow or hosting provider. For a non-Actions hosting provider, set the same variable in its build environment.
6. Run a deployment and check the menu on the resulting site. For subsequent updates, edit the sheet and trigger a rebuild, or wait for an hourly scheduled deployment if one is configured. Google publishing/caching, the hourly schedule, build time and CDN propagation can delay changes; GitHub scheduled runs can also be delayed. Updates are not instant and this script itself does not schedule deployments. Use a manual deployment for urgent changes.

## Columns and rules

- `id`: required and unique, including hidden rows. Prefer stable lowercase identifiers such as `frutti-di-mare`.
- `name`: required display name.
- `description`: public ingredient or tasting description; may be blank. Verify dietary claims yourself.
- `category`: exactly `Pizza`, `Small plates`, `Cocktails`, `Wine`, or `Coffee & more` (case-sensitive).
- `price_usd`: required nonnegative decimal number, e.g. `8.5`. No `$`, commas, negative amounts, exponent notation, or text. Zero is allowed.
- `price_khr`: optional nonnegative whole number. If blank, the script calculates `Math.round(price_usd * 4000)`. This is a fixed display conversion, not a live exchange-rate feed. Set an explicit value to override it.
- `tags`: optional labels separated with `|`, e.g. `Vegetarian|Classic`. Surrounding spaces and duplicate labels are removed.
- `available`: `TRUE` or blank includes the item; `FALSE` hides it. Google Sheets checkbox TRUE/FALSE values work. Values are case-insensitive; other values are rejected to catch mistakes.

All eight headers must exist exactly once (column order may vary). Entirely blank rows are ignored. Quoted commas, double quotes, multiline descriptions, UTF-8 BOM and Windows line endings are supported. Hidden rows are still validated, so fix invalid values before hiding an item. To deliberately publish an empty menu, keep at least one valid item row and set **every row** to `FALSE`; this produces `items: []` for the site's empty state. A header-only/blank response is rejected to avoid accidentally clearing the menu.

## Local development and build integration

Use **Node.js 22 or later**; the script and tests use only Node built-ins.

For local development, put the public URL in an uncommitted `.env.local`:

```dotenv
GOOGLE_SHEETS_CSV_URL="https://docs.google.com/spreadsheets/d/e/YOUR_PUBLISHED_ID/pub?gid=YOUR_MENU_TAB_ID&single=true&output=csv"
```

Run from the repository root:

```sh
node --env-file-if-exists=.env.local scripts/sync-menu.mjs
node --test scripts/menu.test.mjs
```

For a build, run `node --env-file-if-exists=.env.local scripts/sync-menu.mjs` before `next build`, joined with `&&`, or use a failing prebuild step. Next.js loading `.env.local` does not load it for a separate earlier Node command; the explicit Node flag handles that. In CI, pass the environment variable directly. No dependencies are needed for sync or its tests.

With no URL (or a blank URL), sync performs no fetch and leaves the bundled file untouched. Fresh checkouts retain the sample menu. Removing the variable does **not** erase or reset a previously synced local file. A configured URL must use HTTPS on `docs.google.com/spreadsheets/…` or `docs.googleusercontent.com` without credentials or a custom port.

HTTP failures, a 20-second request timeout, inaccessible/invalid CSV, duplicates, invalid categories or prices, and write errors all exit nonzero and must stop the build. Invalid fetched data never replaces the existing file. Do not catch this failure and silently deploy samples: the last successful deployed site should stay online while the owner fixes the sheet and rebuilds. Check build logs for the row/field error; do not publish private data to solve access failures.

Generated JSON has `source: "google-sheets"`, an ISO `updatedAt` build-sync timestamp, `exchangeRate: 4000`, and `items` with `id`, `name`, `description`, `category`, numeric `priceUsd` / `priceKhr`, and string-array `tags`. The bundled sample instead has `source: "sample"` and `updatedAt: null`. `updatedAt` records the fetch/build time, not the spreadsheet's last edit time. The script has an import-safe main guard and exports parsing, validation, and sync functions for testing.
