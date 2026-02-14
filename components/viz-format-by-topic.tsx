"use client";

import { useEffect, useState } from "react";

import type { DatasetSearchResult } from "@/lib/opendata";

type TopicFormats = {
  topic: string;
  formats: { format: string; count: number }[];
  totalResources: number;
};

type State =
  | { status: "loading" }
  | { status: "error" }
  | { status: "success"; topics: TopicFormats[] };

const TOPICS = ["hospital", "medicare", "vaccine"];

function extractFormats(datasets: DatasetSearchResult["datasets"]): { format: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const ds of datasets) {
    for (const r of ds.resources) {
      const key = r.format?.trim() ? r.format.toUpperCase() : "UNKNOWN";
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([format, count]) => ({ format, count }));
}

export function VizFormatByTopic() {
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        const results = await Promise.all(
          TOPICS.map(async (topic) => {
            const url = `/api/datasets?q=${encodeURIComponent(topic)}&page=1&pageSize=50&sort=relevance`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const data = (await res.json()) as DatasetSearchResult;
            const formats = extractFormats(data.datasets);
            const totalResources = data.datasets.reduce((sum, ds) => sum + ds.resources.length, 0);
            return { topic, formats, totalResources };
          })
        );
        if (mounted) setState({ status: "success", topics: results });
      } catch {
        if (mounted) setState({ status: "error" });
      }
    }

    load();
    return () => { mounted = false; };
  }, []);

  if (state.status === "loading") return <p className="vizLoading">Comparing formats across topics...</p>;
  if (state.status === "error") return <p className="vizError">Failed to load format comparison data.</p>;

  return (
    <div>
      <p className="vizMeta">
        Top 5 resource formats for each topic query via <code>/api/datasets?q=...&amp;pageSize=50</code>
      </p>
      <div className="topicGrid">
        {state.topics.map((t) => (
          <div key={t.topic} className="topicColumn">
            <h4>&ldquo;{t.topic}&rdquo; <span className="topicCount">({t.totalResources} resources)</span></h4>
            <ul className="topicList">
              {t.formats.map((f) => (
                <li key={f.format}>
                  <span className="topicFormat">{f.format}</span>
                  <span className="topicFormatCount">{f.count}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
