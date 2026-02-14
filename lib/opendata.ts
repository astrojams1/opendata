import { z } from "zod";

const CKAN_BASE = "https://opendata.hhs.gov/api/3/action/package_search";

const querySchema = z.object({
  q: z.string().trim().optional().default(""),
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(100).default(20)
});

const packageSchema = z.object({
  id: z.string(),
  title: z.string(),
  notes: z.string().optional().nullable(),
  metadata_modified: z.string().optional().nullable(),
  tags: z.array(z.object({ name: z.string() })).optional().default([]),
  resources: z
    .array(
      z.object({
        id: z.string(),
        name: z.string().optional().nullable(),
        format: z.string().optional().nullable(),
        url: z.string().url().optional().nullable()
      })
    )
    .optional()
    .default([])
});

const ckanResponseSchema = z.object({
  success: z.literal(true),
  result: z.object({
    count: z.number(),
    results: z.array(packageSchema)
  })
});

export type DatasetQuery = z.infer<typeof querySchema>;
export type DatasetSummary = {
  id: string;
  title: string;
  description: string;
  lastUpdated: string | null;
  tags: string[];
  resources: Array<{ id: string; name: string; format: string | null; url: string | null }>;
};

export type DatasetSearchResult = {
  query: string;
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  datasets: DatasetSummary[];
  source: string;
};

export function parseDatasetQuery(params: URLSearchParams): DatasetQuery {
  return querySchema.parse({
    q: params.get("q") ?? "",
    page: params.get("page") ?? 1,
    pageSize: params.get("pageSize") ?? 20
  });
}

function buildCkanUrl(query: DatasetQuery): URL {
  const url = new URL(CKAN_BASE);
  url.searchParams.set("q", query.q);
  url.searchParams.set("rows", String(query.pageSize));
  url.searchParams.set("start", String((query.page - 1) * query.pageSize));
  url.searchParams.set("sort", "metadata_modified desc");
  return url;
}

export async function searchDatasets(query: DatasetQuery): Promise<DatasetSearchResult> {
  const url = buildCkanUrl(query);
  const response = await fetch(url, {
    headers: {
      Accept: "application/json"
    },
    next: { revalidate: 300 }
  });

  if (!response.ok) {
    throw new Error(`Upstream request failed with status ${response.status}`);
  }

  const json = await response.json();
  const parsed = ckanResponseSchema.parse(json);

  const datasets: DatasetSummary[] = parsed.result.results.map((item) => ({
    id: item.id,
    title: item.title,
    description: item.notes ?? "",
    lastUpdated: item.metadata_modified ?? null,
    tags: item.tags.map((tag) => tag.name),
    resources: item.resources.map((resource) => ({
      id: resource.id,
      name: resource.name ?? "Untitled resource",
      format: resource.format ?? null,
      url: resource.url ?? null
    }))
  }));

  const totalPages = Math.max(1, Math.ceil(parsed.result.count / query.pageSize));

  return {
    query: query.q,
    page: query.page,
    pageSize: query.pageSize,
    total: parsed.result.count,
    totalPages,
    datasets,
    source: CKAN_BASE
  };
}
