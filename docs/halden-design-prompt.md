# Proof × Halden — redesign implementation prompt

Redesign the existing Proof Pizza Bar & Cafe Next.js website on the `halden` branch. Do not merge into `main` or change production deployment triggers.

## Reference and intent

Reference: https://www.getlayers.ai/layer/halden

Inspect the reference visually on desktop and mobile before implementation. The publicly readable description identifies warm paper, signature red, interactive photographic reveals, a progressively revealed manifesto, rocking cut-out objects, a moving red category band with tilted previews, and spotlight interactions. These are reference observations, not a claim that its rendered layout or animations have been verified.

Create an original restaurant interpretation of that visual language: Neapolitan craft, coastal ease, and a lively bar in Kep, Cambodia. Do not copy Halden's branding, proprietary text, imagery, or exact layout. Prioritize discovering the menu and planning a visit. Avoid generic restaurant templates, SaaS-style card grids, excessive rounding, heavy shadows, and ornamental luxury styling.

## Visual system

Use warm paper, confident red, dark ink, oversized editorial typography, compact utility labels, thin rules, and deliberate whitespace. Suggested starting tokens, to refine against the reference and accessibility checks:

- Paper: #F2EDE3
- Red: #B92B22
- Ink: #29251F
- Muted text: #696157

Choose a distinctive display typeface and a restrained supporting sans-serif. Self-host fonts through Next.js and retain Khmer glyph support for ៛. Keep normal text at least 4.5:1 contrast. Favor square edges and original, art-directed photographic compositions over interchangeable cards.

## Page composition

### 1. Minimal navigation

Retain Proof's current wordmark treatment and existing branding decisions; do not reintroduce a removed logo image without a deliberate reason. Include Our story, Menu, Visit, and Book a table. The booking action remains click-to-call, not an online reservation confirmation. Mobile navigation needs keyboard access, clear expanded state, and Escape-to-close behavior.

### 2. Editorial hero

Pair oversized typography with asymmetrically arranged food imagery. Suggested copy:

> A little Naples. A lot of Kep.
>
> Neapolitan pizza, a proper drink, and nowhere to rush.

Primary action: Explore the menu. Secondary action: Visit Proof. Include discreet location and opening-hours information.

Adapt the photographic reveal and red-tint interaction as a decorative enhancement. Food must remain visible in the resting state. Never hide essential information behind hover or animation.

### 3. Restaurant manifesto

Suggested heading: “Good dough. Good company. The rest can wait.”

Use a typography-led story with restrained progressive reveal. Adapt rocking cut-out objects to pizza, basil, or a wine glass only if appropriate licensed or owner-approved assets are available. Do not fabricate fermentation times, provenance, ingredient sourcing, awards, or history. Text must remain readable without JavaScript and with reduced motion.

### 4. Menu catalogue

Interpret the reference's moving red category band and tilted previews as an editorial menu navigator. Preserve these categories exactly:

- Pizza
- Small plates
- Cocktails
- Wine
- Coffee & more

Selected categories receive an unmistakable red treatment. Desktop hover/focus may reveal a small decorative preview; touch devices use explicit buttons with stable content. Dish information remains a scannable list, not a mandatory image interaction.

Render existing CMS names, descriptions, USD prices, KHR prices, and dietary tags without changing the data schema. Preserve sample-menu disclosure, empty states, allergy guidance, and exchange-rate explanation. Never hard-code replacement menu data into presentation components.

### 5. Pizza and bar feature

Suggested heading: “One more slice. One more round.” Use a contrasting paper/red section and restrained imagery to connect pizza with an evening drink. Adapt highlight interactions without unnecessary cards, heavy effects, or invented offers. Do not imply illustrative photography depicts the actual restaurant.

### 6. Visit Proof

Keep current contact configuration and external destinations intact. Present Kep Beach, Kep, Cambodia; daily 11am–9pm hours; the existing telephone number; Google Maps directions; Facebook; and Instagram. Treat supplied contact information as awaiting owner confirmation where applicable.

A spotlight interaction may decorate suitable imagery, but must never obscure contact information or be necessary to navigate.

### 7. Footer

Finish with a confident oversized Proof wordmark, concise navigation/social links, and restrained red-and-paper composition.

## Interaction and accessibility

Prefer CSS and native browser APIs. Add an animation library only if a demonstrated requirement warrants it. Use transform and opacity where practical. Respect prefers-reduced-motion and pointer capabilities. Essential content must be visible by default. Provide focus equivalents for meaningful hover states and hide decorative elements from assistive technology.

No scroll hijacking, forced custom cursor, autoplay audio, long entrances, or hover-only access to content. Preserve semantic headings, skip navigation, visible focus, accessible names, and comfortably sized touch targets.

## Engineering constraints

This is a presentation redesign, not a CMS or infrastructure replacement. Preserve:

- Next.js static export and GitHub Pages repository base path.
- Google Sheets CSV importer, validation, schema, and build-time data flow.
- USD/KHR formatting and menu category controls.
- Existing deployment schedule and checks.
- Contact destinations, SEO metadata, and local preview functionality.

Do not introduce a backend, authentication, ordering, payment flow, or new reservation service. Reuse existing dependencies and components where appropriate. Keep illustrative photography identified until approved restaurant assets replace it. Do not alter unrelated work.

## Responsive and verification requirements

Design intentionally at 320px, 768px, 1024px, and 1440px. Recompose desktop imagery on mobile instead of simply shrinking it. Avoid clipping, horizontal overflow, unreadable prices, and hover dependencies.

Before declaring implementation complete:

1. Verify all changes remain on `halden`; do not merge into `main`.
2. Run lint, TypeScript, unit tests, and browser tests.
3. Adjust tests for intentional UI changes without weakening behavioral coverage.
4. Build and verify the static export under `/ProofPizzaBarCafe/`.
5. Inspect desktop and mobile screenshots and compare visual principles with the reference.
6. Test keyboard navigation, reduced motion, category filtering, empty states, and contact links.
7. Verify no broken assets, console errors, or horizontal overflow.
8. Confirm Google Sheets menu rendering remains intact.
9. Summarize the interpretation and explicitly disclose missing assets or unverified behavior.

Deliver an original Proof experience with Halden's visual confidence, not its furniture branding.
