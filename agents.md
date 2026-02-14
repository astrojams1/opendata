# Visualization Subagents

Each visualization on the `/visualizations` page is powered by an independent
client-side subagent. A subagent is a React client component that autonomously
fetches data from the `/api/datasets` endpoint and renders its own analysis.

## Subagent Contract

Every subagent component must:

1. Be a `"use client"` component.
2. Fetch data exclusively from `/api/datasets` — no other data source.
3. Never fabricate, hardcode, or illustrate data. All rendered values must come
   from a real API response.
4. Manage its own loading, error, and success states.
5. Be independently mountable — no props required from the parent page.

## Subagent Inventory

| # | Component | File | Data Source |
|---|-----------|------|-------------|
| 1 | `VizFormatDistribution` | `components/viz-format-distribution.tsx` | 100 most recent datasets — format counts |
| 2 | `VizTagFrequency` | `components/viz-tag-frequency.tsx` | 100 most recent datasets — tag frequency |
| 3 | `VizSearchComparison` | `components/viz-search-comparison.tsx` | Parallel queries for 6 search terms — total counts |
| 4 | `VizResourceCounts` | `components/viz-resource-counts.tsx` | 50 health datasets — resources-per-dataset buckets |
| 5 | `VizUpdateTimeline` | `components/viz-update-timeline.tsx` | 100 most recent datasets — last-modified month |
| 6 | `VizFormatByTopic` | `components/viz-format-by-topic.tsx` | 3 topic queries — top 5 formats per topic |

## Adding a New Subagent

1. Create a new file in `components/` named `viz-<name>.tsx`.
2. Follow the contract above.
3. Import and mount it in `app/visualizations/page.tsx`.
4. Add an entry to the inventory table in this file.
