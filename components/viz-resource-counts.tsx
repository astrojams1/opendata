"use client";

import { useEffect, useState } from "react";

import type { DatasetSearchResult } from "@/lib/opendata";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; payload: DatasetSearchResult };

const ENDPOINT = "/api/datasets?q=health&page=1&pageSize=50&sort=recent";

type Bucket = { label: string; count: number; percent: number };

function buildResourceBuckets(datasets: DatasetSearchResult["datasets"]): Bucket[] {
  const buckets: Record<string, number> = {
    "1 resource": 0,
    "2-3 resources": 0,
    "4-6 resources": 0,
    "7-10 resources": 0,
    "11+ resources": 0,
  };

  for (const ds of datasets) {
    const n = ds.resources.length;
    if (n <= 1) buckets["1 resource"]++;
    else if (n <= 3) buckets["2-3 resources"]++;
    else if (n <= 6) buckets["4-6 resources"]++;
    else if (n <= 10) buckets["7-10 resources"]++;
    else buckets["11+ resources"]++;
  }

  const total = datasets.length || 1;
  return Object.entries(buckets).map(([label, count]) => ({
    label,
    count,
    percent: Math.round((count / total) * 100),
  }));
}

export function VizResourceCounts() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let mounted = true;
    fetch(ENDPOINT)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data: DatasetSearchResult) => {
        if (mounted) setState({ status: "success", payload: data });
      })
      .catch((err) => {
        if (mounted) setState({ status: "error" });
      });
    return () => { mounted = false; };
  }, []);

  if (state.status === "loading") return <p className="vizLoading">Analyzing resource counts per dataset...</p>;
  if (state.status === "error") return <p className="vizError">Failed to load resource count data.</p>;

  const buckets = buildResourceBuckets(state.payload.datasets);

  return (
    <div>
      <p className="vizMeta">
        Source: <code>{ENDPOINT}</code><br />
        Distribution of resource counts across <strong>{state.payload.datasets.length}</strong> datasets
      </p>
      <ul className="vizList">
        {buckets.map((b) => (
          <li key={b.label}>
            <span className="vizLabel">{b.label} ({b.count})</span>
            <div className="vizTrack" aria-hidden="true">
              <div className="vizBar vizBarCool" style={{ width: `${b.percent}%` }} />
            </div>
            <span className="vizPercent">{b.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
