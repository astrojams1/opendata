import { describe, expect, it } from "vitest";

import { buildFormatCounts } from "@/lib/visualization";

describe("buildFormatCounts", () => {
  it("aggregates and sorts resource formats", () => {
    const series = buildFormatCounts([
      {
        id: "one",
        title: "One",
        description: "",
        lastUpdated: null,
        tags: [],
        resources: [
          { id: "r1", name: "a", format: "csv", url: null },
          { id: "r2", name: "b", format: "json", url: null },
          { id: "r3", name: "c", format: "csv", url: null }
        ]
      },
      {
        id: "two",
        title: "Two",
        description: "",
        lastUpdated: null,
        tags: [],
        resources: [{ id: "r4", name: "d", format: null, url: null }]
      }
    ]);

    expect(series).toEqual([
      { format: "CSV", count: 2, percent: 50 },
      { format: "JSON", count: 1, percent: 25 },
      { format: "UNKNOWN", count: 1, percent: 25 }
    ]);
  });

  it("applies the limit parameter", () => {
    const series = buildFormatCounts(
      [
        {
          id: "one",
          title: "One",
          description: "",
          lastUpdated: null,
          tags: [],
          resources: [
            { id: "r1", name: "a", format: "csv", url: null },
            { id: "r2", name: "b", format: "json", url: null },
            { id: "r3", name: "c", format: "xml", url: null }
          ]
        }
      ],
      2
    );

    expect(series).toHaveLength(2);
  });
});
