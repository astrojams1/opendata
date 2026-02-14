import { LiveFormatViz } from "@/components/live-format-viz";

const exampleQueries = [
  {
    description: "Search for hospital datasets, sorted by most recent, first page of 10 results in CSV format",
    path: "/api/datasets?q=hospital&page=1&pageSize=10&sort=recent&format=CSV"
  },
  {
    description: "Search by keyword with relevance sorting",
    path: "/api/datasets?q=hospital+quality&page=1&pageSize=5&sort=relevance"
  },
  {
    description: "Filter by tag",
    path: "/api/datasets?q=health&page=1&pageSize=10&tag=behavioral+health"
  },
  {
    description: "Sort alphabetically by title",
    path: "/api/datasets?q=vaccine&page=1&pageSize=15&sort=title"
  },
  {
    description: "Filter to JSON-format resources only",
    path: "/api/datasets?q=care+quality&page=1&pageSize=10&format=JSON"
  }
];

const usageSnippets = [
  {
    title: "Python",
    code: `import requests

url = "https://hhs-open-data-api.vercel.app/api/datasets"
params = {"q": "hospital", "pageSize": 5, "sort": "recent"}
response = requests.get(url, params=params, timeout=30)
response.raise_for_status()
datasets = response.json()["datasets"]
print([item["title"] for item in datasets])`
  },
  {
    title: "R",
    code: `library(httr2)
library(jsonlite)

resp <- request("https://hhs-open-data-api.vercel.app/api/datasets") |>
  req_url_query(q = "medicare", pageSize = 10, format = "CSV") |>
  req_perform()

body <- resp_body_string(resp) |> fromJSON()
print(body$filters)`
  },
  {
    title: "JavaScript",
    code: `const params = new URLSearchParams({
  q: "behavioral health",
  page: "1",
  pageSize: "8",
  sort: "relevance"
});

const res = await fetch(\`/api/datasets?\${params.toString()}\`);
const data = await res.json();
console.log(data.datasets);`
  }
];

const exampleResponse = `{
  "query": "hospital",
  "page": 1,
  "pageSize": 10,
  "total": 351,
  "totalPages": 36,
  "sort": "recent",
  "filters": { "tag": null, "format": "CSV" },
  "datasets": [
    {
      "id": "...",
      "title": "...",
      "description": "...",
      "lastUpdated": "2024-03-08T16:17:50.604682",
      "tags": ["health"],
      "resources": [
        {
          "id": "...",
          "name": "CSV Export",
          "format": "CSV",
          "url": "https://..."
        }
      ]
    }
  ],
  "source": "https://catalog.data.gov/api/3/action/package_search",
  "generatedAt": "2026-02-14T00:00:00.000Z"
}`;

export default function HomePage() {
  return (
    <main className="container">
      <h1>HHS Open Data API — Getting Started</h1>
      <p className="lead">
        This API lets you search HHS dataset metadata from{" "}
        <a href="https://catalog.data.gov/">catalog.data.gov</a>. It returns
        dataset titles, descriptions, tags, and resource links. It does not
        serve the underlying data files themselves.
      </p>

      <section>
        <h2>Base endpoint</h2>
        <pre>GET /api/datasets</pre>
      </section>

      <section>
        <h2>Query parameters</h2>
        <table className="paramTable">
          <thead>
            <tr>
              <th>Parameter</th>
              <th>Type</th>
              <th>Default</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><code>q</code></td>
              <td>string</td>
              <td><code>&quot;&quot;</code></td>
              <td>Full-text search query</td>
            </tr>
            <tr>
              <td><code>page</code></td>
              <td>number</td>
              <td><code>1</code></td>
              <td>1-indexed page number</td>
            </tr>
            <tr>
              <td><code>pageSize</code></td>
              <td>number</td>
              <td><code>20</code></td>
              <td>Results per page (max 100)</td>
            </tr>
            <tr>
              <td><code>sort</code></td>
              <td>enum</td>
              <td><code>recent</code></td>
              <td><code>recent</code>, <code>relevance</code>, or <code>title</code></td>
            </tr>
            <tr>
              <td><code>tag</code></td>
              <td>string</td>
              <td>—</td>
              <td>Filter by exact tag name</td>
            </tr>
            <tr>
              <td><code>format</code></td>
              <td>string</td>
              <td>—</td>
              <td>Filter by resource format (e.g. <code>CSV</code>, <code>JSON</code>)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section>
        <h2>Example request</h2>
        <pre>GET /api/datasets?q=hospital&amp;page=1&amp;pageSize=10&amp;sort=recent&amp;format=CSV</pre>
      </section>

      <section>
        <h2>Example response</h2>
        <pre>{exampleResponse}</pre>
      </section>

      <section>
        <h2>More examples</h2>
        <ul className="queryList">
          {exampleQueries.map((query) => (
            <li key={query.path}>
              <span>{query.description}</span>
              <a href={query.path}>{query.path}</a>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2>Live example</h2>
        <p>
          This section runs a real request against <code>/api/datasets</code>{" "}
          and shows the resource format distribution from the response.
        </p>
        <LiveFormatViz />
      </section>

      <section>
        <h2>Code snippets</h2>
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
        <h2>Notes</h2>
        <ul>
          <li>
            Responses are cached at the edge for 5 minutes (<code>s-maxage=300</code>).
          </li>
          <li>
            Invalid query parameters return a <code>400</code> response with validation details.
          </li>
          <li>
            The upstream source is the CKAN API at{" "}
            <code>catalog.data.gov</code>, filtered to the HHS publisher.
          </li>
        </ul>
      </section>
    </main>
  );
}
