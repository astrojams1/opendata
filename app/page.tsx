const example = `/api/datasets?q=hospital&page=1&pageSize=10&sort=recent&format=CSV`;

const sampleQueries = [
  {
    label: "Hospital quality datasets",
    path: "/api/datasets?q=hospital+quality&page=1&pageSize=5&sort=relevance"
  },
  {
    label: "Latest CSV resources",
    path: "/api/datasets?q=&page=1&pageSize=10&sort=recent&format=CSV"
  },
  {
    label: "Tagged behavioral health",
    path: "/api/datasets?q=health&page=1&pageSize=10&tag=behavioral+health"
  }
];

export default function HomePage() {
  return (
    <main className="container">
      <p className="eyebrow">HHS // OPEN DATA // API</p>
      <h1>Neon-fast health data discovery.</h1>
      <p className="lead">
        A polished gateway for data scientists, analysts, and builders who want a stable JSON API
        over <code>opendata.hhs.gov</code> with better defaults, stricter validation, and cleaner
        pagination.
      </p>

      <section>
        <h2>Quick start</h2>
        <pre>{example}</pre>
        <p>Query params: q, page, pageSize, sort (recent|relevance|title), tag, format.</p>
      </section>

      <section>
        <h2>Playground queries</h2>
        <ul className="queryList">
          {sampleQueries.map((query) => (
            <li key={query.path}>
              <a href={query.path}>{query.label}</a>
              <code>{query.path}</code>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>What makes this useful</h2>
        <ul>
          <li>Stable response schema with explicit sort + filter metadata.</li>
          <li>Resource formats normalized (e.g., CSV, JSON) for clean downstream analysis.</li>
          <li>Edge-friendly cache headers for responsive dashboards and notebooks.</li>
        </ul>
      </section>
    </main>
  );
}
