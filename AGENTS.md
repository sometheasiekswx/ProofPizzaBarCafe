<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Graphify (on request)

An optional knowledge graph lives at `graphify-out/`. Use the installed Graphify skill when explicitly requested. Query/path/explain can help navigate relationships; direct search and source inspection are allowed and should verify graph-derived claims. Refresh the graph only when requested or needed for the current graph task. Preserve existing graph files; report stale data rather than forcing a rebuild on every code edit. Use structural extraction or the current Codex session; do not automatically invoke an external model provider.
