import type { DatasetSummary } from "@/lib/opendata";

export type FormatCount = {
  format: string;
  count: number;
  percent: number;
};

export function buildFormatCounts(datasets: DatasetSummary[], limit = 6): FormatCount[] {
  const counts = new Map<string, number>();

  for (const dataset of datasets) {
    for (const resource of dataset.resources) {
      const key = resource.format?.trim() ? resource.format.toUpperCase() : "UNKNOWN";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const top = sorted.slice(0, limit);
  const total = top.reduce((sum, [, count]) => sum + count, 0);

  return top.map(([format, count]) => ({
    format,
    count,
    percent: total === 0 ? 0 : Math.round((count / total) * 100)
  }));
}
