import { describe, expect, it, vi, afterEach } from "vitest";

import { parseDatasetQuery, searchDatasets } from "@/lib/opendata";

afterEach(() => {
  vi.restoreAllMocks();
});

describe("parseDatasetQuery", () => {
  it("uses defaults when missing values", () => {
    const parsed = parseDatasetQuery(new URLSearchParams());
    expect(parsed).toEqual({ q: "", page: 1, pageSize: 20 });
  });

  it("throws for invalid page size", () => {
    expect(() =>
      parseDatasetQuery(new URLSearchParams("pageSize=999"))
    ).toThrowError();
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
                    name: "CSV",
                    format: "CSV",
                    url: "https://example.com/data.csv"
                  }
                ]
              }
            ]
          }
        })
      })
    );

    const result = await searchDatasets({ q: "hospital", page: 1, pageSize: 10 });

    expect(result.total).toBe(1);
    expect(result.totalPages).toBe(1);
    expect(result.datasets[0]).toMatchObject({
      id: "ds-1",
      title: "Dataset One",
      tags: ["health"]
    });
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
      searchDatasets({ q: "", page: 1, pageSize: 10 })
    ).rejects.toThrow("Upstream request failed");
  });
});
