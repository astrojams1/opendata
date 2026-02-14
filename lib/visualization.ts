import type { DatasetSummary } from "@/lib/opendata";

export type FormatCount = {
  format: string;
  count: number;
  percent: number;
};

export type MedicaidStateAutismClaims = {
  state: string;
  totalClaims: number;
  autismClaims: number;
  members: number;
};

export type MedicaidServiceClaims = {
  category: string;
  claims: number;
};

export type MedicaidAutismYear = {
  year: number;
  claims: number;
  spendingMillions: number;
};

export type MetricPoint = {
  label: string;
  value: number;
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

function normalizePercent<T extends { value: number }>(rows: T[]): Array<T & { percent: number }> {
  const maxValue = rows.reduce((max, row) => Math.max(max, row.value), 0);

  return rows.map((row) => ({
    ...row,
    percent: maxValue === 0 ? 0 : Number(((row.value / maxValue) * 100).toFixed(2))
  }));
}

export function buildAutismClaimsByStatePercent(rows: MedicaidStateAutismClaims[]): MetricPoint[] {
  const calculated = rows
    .map((row) => ({
      label: row.state,
      value: row.totalClaims === 0 ? 0 : Number(((row.autismClaims / row.totalClaims) * 100).toFixed(2))
    }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));

  return normalizePercent(calculated);
}

export function buildAutismClaimsPer10kMembers(rows: MedicaidStateAutismClaims[]): MetricPoint[] {
  const calculated = rows
    .map((row) => ({
      label: row.state,
      value: row.members === 0 ? 0 : Math.round((row.autismClaims / row.members) * 10000)
    }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));

  return normalizePercent(calculated);
}

export function buildAutismServiceMix(rows: MedicaidServiceClaims[]): MetricPoint[] {
  const totalClaims = rows.reduce((sum, row) => sum + row.claims, 0);

  return rows
    .map((row) => ({
      label: row.category,
      value: row.claims,
      percent: totalClaims === 0 ? 0 : Number(((row.claims / totalClaims) * 100).toFixed(2))
    }))
    .sort((a, b) => b.value - a.value || a.label.localeCompare(b.label));
}

export function buildAutismYearlyTrend(rows: MedicaidAutismYear[]): MetricPoint[] {
  const sorted = [...rows].sort((a, b) => a.year - b.year);
  const calculated = sorted.map((row) => ({
    label: String(row.year),
    value: row.claims
  }));

  return normalizePercent(calculated);
}
