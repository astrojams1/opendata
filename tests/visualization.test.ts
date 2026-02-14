import { describe, expect, it } from "vitest";

import {
  buildAutismClaimsByStatePercent,
  buildAutismClaimsPer10kMembers,
  buildAutismServiceMix,
  buildAutismYearlyTrend,
  buildFormatCounts
} from "@/lib/visualization";

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

describe("medicaid autism visualization helpers", () => {
  const stateRows = [
    { state: "TX", totalClaims: 1000, autismClaims: 35, members: 150 },
    { state: "CA", totalClaims: 900, autismClaims: 54, members: 180 },
    { state: "NY", totalClaims: 800, autismClaims: 24, members: 120 }
  ];

  it("builds autism claim percentage by state", () => {
    const series = buildAutismClaimsByStatePercent(stateRows);

    expect(series[0]).toEqual({ label: "CA", value: 6, percent: 100 });
    expect(series[1].label).toBe("TX");
    expect(series[2]).toEqual({ label: "NY", value: 3, percent: 50 });
  });

  it("builds autism claims per 10k members", () => {
    const series = buildAutismClaimsPer10kMembers(stateRows);

    expect(series).toEqual([
      { label: "CA", value: 3000, percent: 100 },
      { label: "TX", value: 2333, percent: 77.77 },
      { label: "NY", value: 2000, percent: 66.67 }
    ]);
  });

  it("builds service mix as percentage of total claims", () => {
    const series = buildAutismServiceMix([
      { category: "ABA", claims: 60 },
      { category: "Speech", claims: 30 },
      { category: "OT", claims: 10 }
    ]);

    expect(series).toEqual([
      { label: "ABA", value: 60, percent: 60 },
      { label: "Speech", value: 30, percent: 30 },
      { label: "OT", value: 10, percent: 10 }
    ]);
  });

  it("builds yearly trend with normalized percentages", () => {
    const series = buildAutismYearlyTrend([
      { year: 2022, claims: 80, spendingMillions: 200 },
      { year: 2020, claims: 40, spendingMillions: 160 },
      { year: 2021, claims: 60, spendingMillions: 180 }
    ]);

    expect(series).toEqual([
      { label: "2020", value: 40, percent: 50 },
      { label: "2021", value: 60, percent: 75 },
      { label: "2022", value: 80, percent: 100 }
    ]);
  });
});
