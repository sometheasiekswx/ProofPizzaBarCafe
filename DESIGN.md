# Proof style guide

## Direction and product constraints

Apple-inspired clarity, not Apple branding: large balanced sans-serif typography, centred opening copy, expansive food photography, quiet navigation, and one scroll-driven craft sequence. Proof remains a coastal pizza restaurant in Kep, not a technology product. The primary action is exploring the menu; calling and getting directions remain directly available.

Retain restaurant information, sample-menu disclosure, USD/KHR pricing, dietary labels, Google Sheets integration, static export, and illustrative-image captions. The palette defaults to Proof’s olive and warm neutrals because the design confirmation prompt was unavailable. Phone, opening hours, menu and image approvals remain subject to the launch checks in [content sources](docs/content-sources.md).

## Tokens

All active styling lives in [design.css](src/app/design.css). Change the semantic tokens at `:root`, not component declarations:

- `--surface`, `--surface-raised`, `--surface-soft`: page and secondary surfaces.
- `--text`, `--text-muted`: primary and supporting text.
- `--accent`, `--accent-hover`, `--on-accent`: links, actions, selected controls and their foreground.
- `--border`: structural separators.
- `--inverse`, `--on-inverse`, `--inverse-muted`: immersive craft section.
- `--focus`: keyboard focus outline.
- `--photo-text`, `--photo-shade`: photograph overlays, independent of brand colour.

When changing palettes, update each foreground/background pair together. Verify normal text at 4.5:1, large text at 3:1, and visible keyboard focus on every surface. Keep photo captions white against their dark scrim; never derive them from the brand accent.

## Typography and layout

DM Sans carries the interface and headlines, with Noto Sans Khmer for riel text. Use one h1, section h2s, and item h3s. Headings balance, body copy wraps naturally, and currency uses tabular numbers. Display type scales from 42px to 92px; section headings from 36px to 64px. Tracking never exceeds -0.04em.

Use `--gutter`, `--page-width`, and `--section-space` for page rhythm. Photograph corners use `--radius` (16px); pills are reserved for controls. Structural dividers replace ornamental cards and shadows. The navigation is 64px high, with anchor scroll clearance of 88px. Preserve visible focus and 44px touch targets.

At 760px and below navigation collapses, menu and visit layouts become single-column, and controls wrap or scroll horizontally without overflowing the page. Below 900px the craft sequence is a normal stacked section. Test 320, 768, 1024 and 1440px widths, including long menu names and empty categories.

## Motion contract

[ScrollExperience](src/components/scroll-experience.tsx) owns GSAP effects and cleans them up through `gsap.matchMedia().revert()` on unmount or preference/breakpoint changes.

- Only desktops at least 900px wide and 650px tall with no reduced-motion preference receive parallax and pinning.
- Hero invitation: a static olive typographic panel with a perforated visit-link stub below the centered opening copy. The stub stacks below the main panel on mobile. No floating photos or hero scroll animation.
- Craft: one pinned 900px scroll sequence below the header; a timeline slowly enlarges the image, brings three already-readable lines into emphasis, and fills a decorative progress rule.
- Native scrolling is never intercepted. Links and controls never wait for an animation.
- Animate transforms and opacity, not masks, blur or layout properties. The header blur is static.
- Button feedback is brief and interruptible; menu selection is immediate.
- Reduced motion disables scroll effects and smooth anchor scrolling. HTML remains visible and useful without animation JavaScript.

## Sources applied

Project-local skills are recorded in [skills-lock.json](skills-lock.json): Impeccable (hierarchy and craft), Emil Kowalski’s apple-design (response and restraint), Vercel agent skills (server-rendered content with small client islands), official GSAP skills (timeline/pin/scrub lifecycle), and Jakub Krehel’s make-interfaces-feel-better (hit areas, wrapping, tabular prices and press feedback).

[transitions.dev](https://transitions.dev) was consulted for compositor-friendly motion: translate/scale instead of animated masks or filter repaints. It is a reference website, not an installed package. Do not install an unrelated package with a similar name.

## Release checks

Run lint, typecheck, static build and Playwright tests. Verify navigation, all menu categories, contact destinations, pin creation/removal, reduced-motion switching, and no-JavaScript reading. Inspect desktop and mobile renders. Real restaurant photography should replace the illustrative image when supplied; do not fabricate venue imagery or business claims.
