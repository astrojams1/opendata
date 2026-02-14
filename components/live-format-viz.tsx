"use client";

import { useEffect, useState } from "react";

import type { DatasetSearchResult } from "@/lib/opendata";
import { buildFormatCounts } from "@/lib/visualization";

type VizState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; payload: DatasetSearchResult };

const endpoint = "/api/datasets?q=hospital&page=1&pageSize=25&sort=recent";

export function LiveFormatViz() {
  const [state, setState] = useState<VizState>({ status: "loading" });

  useEffect(() => {
    let isMounted = true;

    async function load() {
      try {
        const response = await fetch(endpoint);
        if (!response.ok) {
          throw new Error("request failed");
        }

        const payload = (await response.json()) as DatasetSearchResult;
        if (isMounted) {
          setState({ status: "success", payload });
        }
      } catch {
        if (isMounted) {
          setState({ status: "error" });
        }
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, []);

  if (state.status === "loading") {
    return <p>Loading live API example…</p>;
  }

  if (state.status === "error") {
    return <p>Unable to load the live API example right now.</p>;
  }

  const series = buildFormatCounts(state.payload.datasets);

  return (
    <div>
      <p>
        Endpoint: <code>{endpoint}</code>
      </p>
      <p>
        Total datasets: <strong>{state.payload.total}</strong> · Returned page size:{" "}
        <strong>{state.payload.datasets.length}</strong>
      </p>
      <ul className="vizList">
        {series.map((item) => (
          <li key={item.format}>
            <span className="vizLabel">
              {item.format} ({item.count})
            </span>
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
