import { describe, expect, it, vi, afterEach } from "vitest";

import { parseDatasetQuery, searchDatasets } from "@/lib/opendata";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseDatasetQuery", () => {
  it("uses defaults when missing values", () => {
    const parsed = parseDatasetQuery(new URLSearchParams());
    expect(parsed).toEqual({ q: "", page: 1, pageSize: 20, sort: "recent" });
  });

  it("throws for invalid page size", () => {
    expect(() => parseDatasetQuery(new URLSearchParams("pageSize=999"))).toThrowError();
  });

  it("parses optional filters", () => {
    const parsed = parseDatasetQuery(
      new URLSearchParams("q=cancer&page=2&pageSize=5&sort=title&tag=research&format=csv")
    );

    expect(parsed).toEqual({
      q: "cancer",
      page: 2,
      pageSize: 5,
      sort: "title",
      tag: "research",
      format: "csv"
    });
  });
});

describe("searchDatasets", () => {
  it("maps CKAN payload into stable schema", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          success: true,
          result: {
            count: 1,
            results: [
              {
                id: "ds-1",
                title: "Dataset One",
                notes: "Desc",
                metadata_modified: "2024-01-01",
                tags: [{ name: "health" }],
                resources: [
                  {
                    id: "res-1",
                    name: "csv export",
                    format: "csv",
                    url: "https://example.com/data.csv"
                  }
                ]
              }
            ]
          }
        })
      })
    );

    const result = await searchDatasets({
      q: "hospital",
      page: 1,
      pageSize: 10,
      sort: "recent",
      format: "csv"
    });

    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.sort).toBe("recent");
    expect(result.filters).toEqual({ tag: null, format: "CSV" });
    expect(result.datasets[0]).toMatchObject({
      id: "ds-1",
      title: "Dataset One",
      tags: ["health"],
      resources: [{ format: "CSV" }]
    });
    expect(result.source).toBe("https://catalog.data.gov/api/3/action/package_search");
    expect(result.generatedAt).toMatch(/T/);
  });

  it("always scopes search to HHS organization", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        result: {
          count: 0,
          results: []
        }
      })
    });
    vi.stubGlobal("fetch", fetchSpy);

    await searchDatasets({ q: "hospital", page: 1, pageSize: 20, sort: "recent" });

    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.searchParams.get("fq")).toContain("organization:hhs-gov");
  });

  it("sends format and tag filters to upstream", async () => {
    const fetchSpy = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        success: true,
        result: {
          count: 0,
          results: []
        }
      })
    });
    vi.stubGlobal("fetch", fetchSpy);

    await searchDatasets({
      q: "",
      page: 1,
      pageSize: 20,
      sort: "relevance",
      tag: "health equity",
      format: "json"
    });

    const url = new URL(fetchSpy.mock.calls[0][0] as string);
    expect(url.searchParams.get("sort")).toBe("score desc, metadata_modified desc");
    expect(url.searchParams.get("fq")).toContain("organization:hhs-gov");
    expect(url.searchParams.get("fq")).toContain('tags:"health equity"');
    expect(url.searchParams.get("fq")).toContain('res_format:"JSON"');
  });

  it("throws when upstream fails", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        status: 500
      })
    );

    await expect(
      searchDatasets({ q: "", page: 1, pageSize: 10, sort: "recent" })
    ).rejects.toThrow("Upstream request failed");
  });
});
