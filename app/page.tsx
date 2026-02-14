import { LiveFormatViz } from "@/components/live-format-viz";
import {
  buildAutismClaimsByStatePercent,
  buildAutismClaimsPer10kMembers,
  buildAutismServiceMix,
  buildAutismYearlyTrend
} from "@/lib/visualization";

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
    code: `import requests\n\nurl = "https://hhs-open-data-api.vercel.app/api/datasets"\nparams = {"q": "hospital", "pageSize": 5, "sort": "recent"}\nresponse = requests.get(url, params=params, timeout=30)\nresponse.raise_for_status()\ndatasets = response.json()["datasets"]\nprint([item["title"] for item in datasets])`
  },
  {
    title: "R analytics script",
    code: `library(httr2)\nlibrary(jsonlite)\n\nresp <- request("https://hhs-open-data-api.vercel.app/api/datasets") |>\n  req_url_query(q = "medicare", pageSize = 10, format = "CSV") |>\n  req_perform()\n\nbody <- resp_body_string(resp) |> fromJSON()\nprint(body$filters)`
  },
  {
    title: "JavaScript dashboard",
    code: `const params = new URLSearchParams({\n  q: "behavioral health",\n  page: "1",\n  pageSize: "8",\n  sort: "relevance"\n});\n\nconst res = await fetch(\`/api/datasets?\${params.toString()}\`);\nconst data = await res.json();\nrenderCards(data.datasets);`
  }
];

const medicaidStateClaims = [
  { state: "CA", totalClaims: 6500000, autismClaims: 121000, members: 1450000 },
  { state: "TX", totalClaims: 5700000, autismClaims: 92000, members: 1320000 },
  { state: "NY", totalClaims: 4300000, autismClaims: 88000, members: 980000 },
  { state: "FL", totalClaims: 3900000, autismClaims: 74000, members: 910000 },
  { state: "PA", totalClaims: 2500000, autismClaims: 51000, members: 640000 },
  { state: "IL", totalClaims: 2300000, autismClaims: 47000, members: 600000 }
];

const medicaidServiceMix = [
  { category: "ABA therapy", claims: 223000 },
  { category: "Speech therapy", claims: 118000 },
  { category: "Occupational therapy", claims: 97000 },
  { category: "Behavioral diagnostics", claims: 73000 },
  { category: "Care coordination", claims: 61000 }
];

const medicaidYearlyTrend = [
  { year: 2020, claims: 296000, spendingMillions: 945 },
  { year: 2021, claims: 322000, spendingMillions: 1024 },
  { year: 2022, claims: 349000, spendingMillions: 1122 },
  { year: 2023, claims: 376000, spendingMillions: 1211 },
  { year: 2024, claims: 404000, spendingMillions: 1318 }
];

export default function HomePage() {
  const stateShare = buildAutismClaimsByStatePercent(medicaidStateClaims);
  const stateRate = buildAutismClaimsPer10kMembers(medicaidStateClaims);
  const serviceMix = buildAutismServiceMix(medicaidServiceMix);
  const yearlyTrend = buildAutismYearlyTrend(medicaidYearlyTrend);

  return (
    <main className="container">
      <p className="eyebrow">HHS Open Data API</p>
      <h1>Reliable health data discovery for research and product teams.</h1>
      <p className="lead">
        A stable API gateway for analysts, data scientists, and builders who want clean dataset
        search responses from <code>catalog.data.gov</code> with predictable pagination, filtering,
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
        <h2>API in use: live visualization</h2>
        <p>
          This chart runs a real request against <code>/api/datasets</code> and visualizes the
          resource format distribution from the returned page.
        </p>
        <LiveFormatViz />
      </section>

      <section>
        <h2>Medicaid autism claims visualizations</h2>
        <p>Illustrative Medicaid claims cuts for autism services, shown with direct comparisons.</p>
        <div className="vizGrid">
          <article className="vizCard">
            <h3>Autism claims as % of total Medicaid claims (by state)</h3>
            <ul className="vizList">
              {stateShare.map((item) => (
                <li key={item.label}>
                  <span className="vizLabel">{item.label}</span>
                  <div className="vizTrack" aria-hidden="true">
                    <div className="vizBar" style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="vizPercent">{item.percent.toFixed(2)}%</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="vizCard">
            <h3>Autism claims per 10,000 Medicaid members</h3>
            <ul className="vizList">
              {stateRate.map((item) => (
                <li key={item.label}>
                  <span className="vizLabel">{item.label}</span>
                  <div className="vizTrack" aria-hidden="true">
                    <div className="vizBar" style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="vizPercent">{item.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="vizCard">
            <h3>Autism service category mix</h3>
            <ul className="vizList">
              {serviceMix.map((item) => (
                <li key={item.label}>
                  <span className="vizLabel">{item.label}</span>
                  <div className="vizTrack" aria-hidden="true">
                    <div className="vizBar" style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="vizPercent">{item.percent.toFixed(1)}%</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="vizCard">
            <h3>Year-over-year autism claims trend</h3>
            <ul className="vizList">
              {yearlyTrend.map((item) => (
                <li key={item.label}>
                  <span className="vizLabel">{item.label}</span>
                  <div className="vizTrack" aria-hidden="true">
                    <div className="vizBar" style={{ width: `${item.percent}%` }} />
                  </div>
                  <span className="vizPercent">{item.value.toLocaleString()}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
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
