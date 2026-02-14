# HHS Open Data API Gateway

A Vercel-ready Next.js service that exposes a clean JSON API for searching datasets from [opendata.hhs.gov](https://opendata.hhs.gov/).

## Why this exists

The upstream CKAN API is powerful but verbose. This project provides a community-friendly contract with:

- Stable response shape for datasets and resources.
- Input validation (`q`, `page`, `pageSize`) with clear errors.
- Caching defaults tuned for serverless/edge platforms.
- A simple landing page for discovery and onboarding.

## API

### `GET /api/datasets`

Search and paginate HHS datasets.

#### Query params

- `q` *(string, optional)*: full-text query.
- `page` *(number, default `1`)*: 1-indexed page.
- `pageSize` *(number, default `20`, max `100`)*.

#### Example

```bash
curl "http://localhost:3000/api/datasets?q=hospital&page=1&pageSize=10"
```

#### Example response

```json
{
  "query": "hospital",
  "page": 1,
  "pageSize": 10,
  "total": 351,
  "totalPages": 36,
  "datasets": [
    {
      "id": "...",
      "title": "...",
      "description": "...",
      "lastUpdated": "2024-03-08T16:17:50.604682",
      "tags": ["health"],
      "resources": [
        {
          "id": "...",
          "name": "CSV Export",
          "format": "CSV",
          "url": "https://..."
        }
      ]
    }
  ],
  "source": "https://opendata.hhs.gov/api/3/action/package_search"
}
```

## Local development

```bash
npm install
npm run dev
```

## Tests

```bash
npm test
```

## Deploy to Vercel

1. Import the repository in Vercel.
2. Framework preset: **Next.js**.
3. No additional environment variables required.
4. Deploy.

The API route automatically returns cache headers suitable for Vercel's edge caching.
