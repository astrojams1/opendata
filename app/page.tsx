const example = `/api/datasets?q=hospital&page=1&pageSize=10`;

export default function HomePage() {
  return (
    <main className="container">
      <h1>HHS Open Data API</h1>
      <p>
        This project provides a stable, cache-friendly JSON API on top of
        <code> opendata.hhs.gov </code> for use in apps, notebooks, and dashboards.
      </p>

      <section>
        <h2>Endpoint</h2>
        <pre>{example}</pre>
        <p>Query parameters: q (search), page (1+), pageSize (1-100).</p>
      </section>

      <section>
        <h2>What you get</h2>
        <ul>
          <li>Consistent schema for datasets, tags, and resources.</li>
          <li>Input validation with clear error responses.</li>
          <li>Edge caching for Vercel deployments.</li>
        </ul>
      </section>
    </main>
  );
}
