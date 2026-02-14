import { describe, expect, it, vi, afterEach } from "vitest";
import { NextRequest } from "next/server";

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
    vi.mocked(parseDatasetQuery).mockReturnValue({ q: "abc", page: 1, pageSize: 10 });
    vi.mocked(searchDatasets).mockResolvedValue({
      query: "abc",
      page: 1,
      pageSize: 10,
      total: 0,
      totalPages: 1,
      datasets: [],
      source: "https://opendata.hhs.gov/api/3/action/package_search"
    });

    const req = new NextRequest("http://localhost/api/datasets?q=abc");
    const res = await GET(req);
    const body = await res.json();

    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toContain("s-maxage=300");
    expect(body.query).toBe("abc");
  });

  it("returns 502 when upstream/search fails", async () => {
    vi.mocked(parseDatasetQuery).mockReturnValue({ q: "", page: 1, pageSize: 10 });
    vi.mocked(searchDatasets).mockRejectedValue(new Error("boom"));

    const req = new NextRequest("http://localhost/api/datasets");
    const res = await GET(req);

    expect(res.status).toBe(502);
    expect(await res.json()).toEqual({ error: "Unable to fetch datasets right now" });
  });
});
