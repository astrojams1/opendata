"use client";

import { useEffect, useState } from "react";

import type { DatasetSearchResult } from "@/lib/opendata";

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; payload: DatasetSearchResult };

const ENDPOINT = "/api/datasets?q=&page=1&pageSize=100&sort=recent";

type MonthBucket = { label: string; count: number; percent: number };

function buildTimeline(datasets: DatasetSearchResult["datasets"]): MonthBucket[] {
  const months = new Map<string, number>();

  for (const ds of datasets) {
    if (!ds.lastUpdated) continue;
    const date = new Date(ds.lastUpdated);
    if (isNaN(date.getTime())) continue;
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
    months.set(key, (months.get(key) ?? 0) + 1);
  }

  const sorted = [...months.entries()].sort((a, b) => b[0].localeCompare(a[0]));
  const top = sorted.slice(0, 8);
  const max = top.length > 0 ? Math.max(...top.map(([, c]) => c)) : 1;

  return top.map(([label, count]) => ({
    label,
    count,
    percent: Math.round((count / max) * 100),
  }));
}

export function VizUpdateTimeline() {
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

  if (state.status === "loading") return <p className="vizLoading">Building update timeline...</p>;
  if (state.status === "error") return <p className="vizError">Failed to load timeline data.</p>;

  const timeline = buildTimeline(state.payload.datasets);

  return (
    <div>
      <p className="vizMeta">
        Source: <code>{ENDPOINT}</code><br />
        Last-modified month for <strong>{state.payload.datasets.length}</strong> most recent datasets
      </p>
      <ul className="vizList">
        {timeline.map((m) => (
          <li key={m.label}>
            <span className="vizLabel">{m.label} ({m.count})</span>
            <div className="vizTrack" aria-hidden="true">
              <div className="vizBar vizBarTimeline" style={{ width: `${m.percent}%` }} />
            </div>
            <span className="vizPercent">{m.count}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
