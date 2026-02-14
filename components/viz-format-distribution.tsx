"use client";

import { useEffect, useState } from "react";

import type { DatasetSearchResult } from "@/lib/opendata";
import { buildFormatCounts } from "@/lib/visualization";

type State =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; payload: DatasetSearchResult };

const ENDPOINT = "/api/datasets?q=&page=1&pageSize=100&sort=recent";

export function VizFormatDistribution() {
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

  if (state.status === "loading") return <p className="vizLoading">Fetching format distribution...</p>;
  if (state.status === "error") return <p className="vizError">Failed to load format data.</p>;

  const series = buildFormatCounts(state.payload.datasets, 8);

  return (
    <div>
      <p className="vizMeta">
        Source: <code>{ENDPOINT}</code><br />
        Analyzed <strong>{state.payload.datasets.length}</strong> datasets
        ({state.payload.total} total in catalog)
      </p>
      <ul className="vizList">
        {series.map((item) => (
          <li key={item.format}>
            <span className="vizLabel">{item.format} ({item.count})</span>
            <div className="vizTrack" aria-hidden="true">
              <div className="vizBar" style={{ width: `${item.percent}%` }} />
            </div>
            <span className="vizPercent">{item.percent}%</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
