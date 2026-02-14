"use client";

import { useEffect, useState } from "react";

import type { DatasetSearchResult } from "@/lib/opendata";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; payload: DatasetSearchResult };

const ENDPOINT = "/api/datasets?q=&page=1&pageSize=100&sort=recent";

function buildTagCounts(datasets: DatasetSearchResult["datasets"], limit = 10) {
  const counts = new Map<string, number>();
  for (const ds of datasets) {
    for (const tag of ds.tags) {
      const key = tag.toLowerCase();
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const top = sorted.slice(0, limit);
  const max = top.length > 0 ? top[0][1] : 1;
  return top.map(([tag, count]) => ({ tag, count, percent: Math.round((count / max) * 100) }));
}

export function VizTagFrequency() {
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
        if (mounted) setState({ status: "error", message: String(err) });
      });
    return () => { mounted = false; };
  }, []);

  if (state.status === "loading") return <p className="vizLoading">Fetching tag frequency data...</p>;
  if (state.status === "error") return <p className="vizError">Failed to load tag data.</p>;

  const tags = buildTagCounts(state.payload.datasets);

  return (
    <div>
      <p className="vizMeta">
        Source: <code>{ENDPOINT}</code><br />
        Tags extracted from <strong>{state.payload.datasets.length}</strong> datasets
      </p>
      <ul className="vizList">
        {tags.map((item) => (
          <li key={item.tag}>
            <span className="vizLabel">{item.tag} ({item.count})</span>
            <div className="vizTrack" aria-hidden="true">
              <div className="vizBar vizBarAlt" style={{ width: `${item.percent}%` }} />
            </div>
            <span className="vizPercent">{item.count}x</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
