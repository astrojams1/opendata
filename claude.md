# Claude Code — Project Guide

## Project

HHS Open Data API Gateway — a Next.js application that wraps the
catalog.data.gov CKAN API with HHS publisher filtering and serves dataset
metadata through a clean JSON contract at `/api/datasets`.

## Stack

- **Framework:** Next.js (App Router)
- **Language:** TypeScript (strict mode)
- **Testing:** Vitest
- **Validation:** Zod
- **HTTP Client:** undici (proxy-aware)

## Key Paths

| Purpose | Path |
|---------|------|
| API route | `app/api/datasets/route.ts` |
| Core logic | `lib/opendata.ts` |
| Visualization helpers | `lib/visualization.ts` |
| Home page | `app/page.tsx` |
| Visualizations page | `app/visualizations/page.tsx` |
| Subagent components | `components/viz-*.tsx` |
| Tests | `tests/` |
| Subagent specification | `agents.md` |

## Commands

```bash
npm test          # run tests once
npm run dev       # start dev server
npm run build     # production build
```

## Rules

1. **No fabricated data.** Every value rendered on the visualizations page must
   come from a real `/api/datasets` response. Never hardcode illustrative
   numbers.
2. **Subagent architecture.** Each visualization is a self-contained client
   component that fetches its own data. See `agents.md` for the full contract
   and inventory.
3. **`agents.md` is canonical.** The file `agents.md` at the repository root is
   the single source of truth for subagent specifications. Tests enforce that
   its contents are not accidentally modified — any change must be intentional
   and reflected in the corresponding test fixture.
4. **Keep it honest.** Do not add marketing language, sales-page tone, or
   exaggerated claims. The home page is a technical getting-started guide.
