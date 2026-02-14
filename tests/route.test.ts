import { describe, expect, it, vi, afterEach } from "vitest";
import { NextRequest } from "next/server";
import { z } from "zod";

vi.mock("@/lib/opendata", () => ({
  parseDatasetQuery: vi.fn(),
  searchDatasets: vi.fn()
}));

import { parseDatasetQuery, searchDatasets } from "@/lib/opendata";
import { GET } from "@/app/api/datasets/route";

afterEach(() => {
  vi.resetAllMocks();
});

describe("GET /api/datasets", () => {
  it("returns 200 and cache headers on success", async () => {
    vi.mocked(parseDatasetQuery).mockReturnValue({ q: "abc", page: 1, pageSize: 10, sort: "recent" });
    vi.mocked(searchDatasets).mockResolvedValue({
      query: "abc",
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 1,
      sort: "recent",
      filters: { tag: null, format: null },
      datasets: [],
      source: "https://catalog.data.gov/api/3/action/package_search",
      generatedAt: "2026-02-14T00:00:00.000Z"
    });

    const req = new NextRequest("http://localhost/api/datasets?q=abc");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage=300");
    expect(body.query).toBe("abc");
    expect(body.sort).toBe("recent");
  });

  it("returns 400 when validation fails", async () => {
    vi.mocked(parseDatasetQuery).mockImplementation(() => {
      throw new z.ZodError([]);
    });

    const req = new NextRequest("http://localhost/api/datasets?page=0");
    const res = await GET(req);

    expect(res.status).toBe(400);
    expect((await res.json()).error).toBe("Invalid query parameters");
  });

  it("returns 502 when upstream/search fails", async () => {
    vi.mocked(parseDatasetQuery).mockReturnValue({ q: "", page: 1, pageSize: 10, sort: "recent" });
    vi.mocked(searchDatasets).mockRejectedValue(new Error("boom"));

    const req = new NextRequest("http://localhost/api/datasets");
    const res = await GET(req);

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Unable to fetch datasets right now" });
  });
});
