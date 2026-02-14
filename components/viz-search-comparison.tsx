"use client";

import { useEffect, useState } from "react";

type SearchTotals = { term: string; total: number; percent: number };

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; results: SearchTotals[] };

const SEARCH_TERMS = ["hospital", "medicare", "vaccine", "mental health", "opioid", "diabetes"];

export function VizSearchComparison() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const results = await Promise.all(
          SEARCH_TERMS.map(async (term) => {
            const url = `/api/datasets?q=${encodeURIComponent(term)}&page=1&pageSize=1&sort=relevance`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = await res.json();
            return { term, total: data.total as number };
          })
        );

        const max = Math.max(...results.map((r) => r.total), 1);
        const withPercent = results
          .map((r) => ({ ...r, percent: Math.round((r.total / max) * 100) }))
          .sort((a, b) => b.total - a.total);

        if (mounted) setState({ status: "success", results: withPercent });
      } catch {
        if (mounted) setState({ status: "error" });
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (state.status === "loading") return <p className="vizLoading">Querying dataset counts for {SEARCH_TERMS.length} search terms...</p>;
  if (state.status === "error") return <p className="vizError">Failed to load search comparison data.</p>;

  return (
    <div>
      <p className="vizMeta">
        Each bar shows the total datasets matching a search term via <code>/api/datasets?q=...&amp;pageSize=1</code>
      </p>
      <ul className="vizList">
        {state.results.map((item) => (
          <li key={item.term}>
            <span className="vizLabel">&ldquo;{item.term}&rdquo;</span>
            <div className="vizTrack" aria-hidden="true">
              <div className="vizBar vizBarWarm" style={{ width: `${item.percent}%` }} />
            </div>
            <span className="vizPercent">{item.total.toLocaleString()}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
