# Proof Pizza Bar & Cafe

A responsive Next.js website for Proof in Kep, Cambodia. Static export for GitHub Pages, with a public Google Sheets menu fetched at build time. No server, paid CMS, API key, tracking, or customer database required.

## Halden design branch

The `halden` branch explores an original warm-paper and red editorial direction inspired by the [Halden reference](https://www.getlayers.ai/layer/halden). It includes oversized typography, a photographic hero, animated red menu-category bands, restrained hover interactions, and reduced-motion alternatives. The existing Sheets CMS and deployment configuration are unchanged. Pushes to `halden` do not deploy the production site; open a pull request to `main` when ready for review.

See [the design brief](docs/halden-design-prompt.md). Current pizza photography remains illustrative; no reference-site images or proprietary copy were reused.

## Develop

Use Node 22 (`nvm use`) or a newer supported Node version.

```sh
npm ci
cp .env.example .env.local
npm run dev
```

Open http://localhost:3000. VS Code includes `dev`, `build`, and `check` tasks (Terminal → Run Task). Changes hot-reload.

- `src/app/page.tsx`: homepage content and sections
- `src/app/globals.css`: design tokens, layout and responsive styles
- `src/components/menu.tsx`: menu category controls and currency display
- `src/lib.ts`: contact details, social links and asset paths
- `src/data/menu.json`: bundled sample menu, replaced by the sync when configured
- `public/images/`: local images (no expiring social CDN URLs)

## Google Sheets CMS

Follow [the owner setup guide](docs/google-sheets.md). Import [the CSV template](public/menu-template.csv) into a new Sheet, publish **only the menu tab** as CSV, and add its URL as the GitHub repository variable `GOOGLE_SHEETS_CSV_URL`.

Owner edits become visible on the next successful scheduled build (hourly), push, or manual Actions run. GitHub schedules can be delayed and may be disabled after 60 days of inactivity in public repositories. This is not instant live editing. Manual workflow dispatch remains available.

For local updates set the same variable in `.env.local`, run `npm run menu:sync`, then start/restart dev. Prices show USD and KHR, with a clearly labelled indicative 4,000៛/$ conversion if no individual riel price is supplied. Explicit riel prices override the conversion.

Invalid configured sheets fail the build and leave the previously deployed site untouched. With no Sheet configured, the site uses the labelled sample menu.

## GitHub Pages deployment

1. Repository **Settings → Pages → Build and deployment → Source → GitHub Actions**.
2. Set the optional menu variable under **Settings → Secrets and variables → Actions → Variables** (not an API key).
3. Push to `main`, or run **Actions → Build and deploy to GitHub Pages → Run workflow**.
4. Site: https://sometheasiekswx.github.io/ProofPizzaBarCafe/

The workflow runs lint, CMS tests, production build, TypeScript and browser tests before deployment. Pull requests validate without deploying. Hourly runs refresh the menu. The workflow automatically sets the repository base path, including image, CSS and JS URLs.

For a custom domain, change the workflow's `NEXT_PUBLIC_SITE_URL` to your HTTPS origin and set `NEXT_PUBLIC_BASE_PATH` to empty instead of the repository path. Configure DNS and Pages separately. Do not add a custom domain until you own it.

## Verify and preview

```sh
npm run lint
npm test
npm run build
npm run typecheck
npx playwright install chromium
npm run test:e2e
npm run preview
```

Static preview: http://127.0.0.1:4173. To test the exact Pages path:

```sh
NEXT_PUBLIC_BASE_PATH=/ProofPizzaBarCafe npm run build
NEXT_PUBLIC_BASE_PATH=/ProofPizzaBarCafe npm run test:e2e
NEXT_PUBLIC_BASE_PATH=/ProofPizzaBarCafe npm run preview
```

Preview then lives at http://127.0.0.1:4173/ProofPizzaBarCafe/. The preview server binds only to localhost and is not a production server. It loads regular build-output files into memory at startup, skipping symbolic links; request URLs only look up that fixed snapshot and never become filesystem paths. Restart the preview after rebuilding to load changes. This is intended for this small static site, not large asset collections.

## Before announcing the site

- Connect the Sheet and confirm all dishes, descriptions, dietary tags and prices. Samples are not verified restaurant offerings.
- Confirm the supplied telephone number `+855 12 345 678` and daily 11am–9pm hours. The booking button starts a phone call; it does not submit or confirm a reservation.
- Replace illustrative pizza photography with owner-approved food photography when available.
- Confirm permission to use the restaurant's public Facebook logo. See [content provenance](docs/content-sources.md).

## Requested agent tools

- Agent Reach 1.5.0 was installed using `uv tool install` in an isolated tool environment. Its safe checks and Jina Reader channel were used against all four supplied links; browser inspection recovered public Facebook details when the reader returned a login wall. No cookies or credentials were extracted.
- The project-local `frontend-ui-engineering` skill from `addyosmani/agent-skills` guides responsive design, accessibility and UI verification.
- The project-local `ponytail` skill from `DietrichGebert/ponytail` guides focused implementation and concise context use. It is a workflow skill, not a literal token compressor; no quantified token savings are claimed.
- Skills were installed with the `skills` CLI; see `skills-lock.json`. These are development guidance, not runtime dependencies.

## Dependency note

At initial validation, production dependencies had **zero npm audit advisories**. ESLint's transitive `braces` dependency had an upstream high-severity pattern-processing advisory with no compatible patched release (five related audit entries). It is development-only and does not ship in the static site. Do not apply npm's suggested forced downgrade of Next's ESLint configuration; update when an upstream compatible fix is released.
