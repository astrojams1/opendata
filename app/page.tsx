const quickStartExample = "/api/datasets?q=hospital&page=1&pageSize=10&sort=recent&format=CSV";

const sampleQueries = [
  {
    label: "Hospital quality datasets",
    path: "/api/datasets?q=hospital+quality&page=1&pageSize=5&sort=relevance",
    useCase: "Benchmark hospital performance"
  },
  {
    label: "Latest CSV resources",
    path: "/api/datasets?q=&page=1&pageSize=10&sort=recent&format=CSV",
    useCase: "Build fresh ingestion jobs"
  },
  {
    label: "Behavioral health tag filter",
    path: "/api/datasets?q=health&page=1&pageSize=10&tag=behavioral+health",
    useCase: "Focus on a specific program area"
  },
  {
    label: "Medicare payment policy",
    path: "/api/datasets?q=medicare+payment&page=1&pageSize=10&sort=relevance",
    useCase: "Policy impact analysis"
  },
  {
    label: "Title-sorted vaccine datasets",
    path: "/api/datasets?q=vaccine&page=1&pageSize=15&sort=title",
    useCase: "Create alphabetized internal catalogs"
  },
  {
    label: "JSON resources for app integration",
    path: "/api/datasets?q=care+quality&page=1&pageSize=10&format=JSON",
    useCase: "Feed application APIs directly"
  },
  {
    label: "Health equity content",
    path: "/api/datasets?q=equity&page=1&pageSize=20&sort=relevance",
    useCase: "Support grant and disparity research"
  },
  {
    label: "Recent maternal health datasets",
    path: "/api/datasets?q=maternal+health&page=1&pageSize=10&sort=recent",
    useCase: "Track new publication activity"
  },
  {
    label: "Substance use datasets in CSV",
    path: "/api/datasets?q=substance+use&page=1&pageSize=10&format=CSV",
    useCase: "Batch load into data warehouses"
  },
  {
    label: "Rural health tagged datasets",
    path: "/api/datasets?q=&page=1&pageSize=25&tag=rural+health",
    useCase: "Target population-level analysis"
  }
];

const usageSnippets = [
  {
    title: "Python notebook",
    code: `import requests\n\nurl = \"https://hhs-open-data-api.vercel.app/api/datasets\"\nparams = {\"q\": \"hospital\", \"pageSize\": 5, \"sort\": \"recent\"}\nresponse = requests.get(url, params=params, timeout=30)\nresponse.raise_for_status()\ndatasets = response.json()[\"datasets\"]\nprint([item[\"title\"] for item in datasets])`
  },
  {
    title: "R analytics script",
    code: `library(httr2)\nlibrary(jsonlite)\n\nresp <- request(\"https://hhs-open-data-api.vercel.app/api/datasets\") |>\n  req_url_query(q = \"medicare\", pageSize = 10, format = \"CSV\") |>\n  req_perform()\n\nbody <- resp_body_string(resp) |> fromJSON()\nprint(body$filters)`
  },
  {
    title: "JavaScript dashboard",
    code: `const params = new URLSearchParams({\n  q: \"behavioral health\",\n  page: \"1\",\n  pageSize: \"8\",\n  sort: \"relevance\"\n});\n\nconst res = await fetch(\`/api/datasets?\${params.toString()}\`);\nconst data = await res.json();\nrenderCards(data.datasets);`
  }
];

export default function HomePage() {
  return (
    <main className="container">
      <p className="eyebrow">HHS // OPEN DATA // API</p>
      <h1>Reliable health data discovery for research and product teams.</h1>
      <p className="lead">
        A stable API gateway for analysts, data scientists, and builders who want clean dataset
        search responses from <code>opendata.hhs.gov</code> with predictable pagination, filtering,
        and caching.
      </p>

      <section>
        <h2>Quick start</h2>
        <pre>{quickStartExample}</pre>
        <p>Query params: q, page, pageSize, sort (recent|relevance|title), tag, format.</p>
      </section>

      <section>
        <h2>API in use: query examples</h2>
        <ul className="queryList">
          {sampleQueries.map((query) => (
            <li key={query.path}>
              <strong>{query.label}</strong>
              <span>{query.useCase}</span>
              <a href={query.path}>{query.path}</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>API in use: code snippets</h2>
        <div className="snippetGrid">
          {usageSnippets.map((snippet) => (
            <article key={snippet.title} className="snippetCard">
              <h3>{snippet.title}</h3>
              <pre>{snippet.code}</pre>
            </article>
          ))}
        </div>
      </section>

      <section>
        <h2>Why teams use this gateway</h2>
        <ul>
          <li>Stable response schema with explicit sort and filter metadata.</li>
          <li>Resource formats normalized (CSV, JSON, XML) for cleaner downstream joins.</li>
          <li>Edge-friendly cache headers for responsive dashboards and notebooks.</li>
        </ul>
      </section>
    </main>
  );
}
