import { VizFormatDistribution } from "@/components/viz-format-distribution";
import { VizTagFrequency } from "@/components/viz-tag-frequency";
import { VizSearchComparison } from "@/components/viz-search-comparison";
import { VizResourceCounts } from "@/components/viz-resource-counts";
import { VizUpdateTimeline } from "@/components/viz-update-timeline";
import { VizFormatByTopic } from "@/components/viz-format-by-topic";

export default function VisualizationsPage() {
  return (
    <main className="container">
      <h1>API Visualizations</h1>
      <p className="lead">
        Each visualization below is an independent subagent &mdash; a client
        component that autonomously fetches live data from{" "}
        <code>/api/datasets</code> and renders its own analysis. No data on this
        page is fabricated; every number comes from a real API call to the HHS
        dataset catalog.
      </p>

      <section>
        <h2>1. Resource Format Distribution</h2>
        <p>
          Aggregates every resource across the 100 most recently modified HHS
          datasets and counts how often each file format appears.
        </p>
        <VizFormatDistribution />
      </section>

      <section>
        <h2>2. Tag Frequency</h2>
        <p>
          Extracts all tags from the 100 most recently modified datasets and
          ranks them by how many datasets carry each tag.
        </p>
        <VizTagFrequency />
      </section>

      <section>
        <h2>3. Search Term Comparison</h2>
        <p>
          Runs parallel searches for six health-related terms and compares the
          total number of matching datasets for each term.
        </p>
        <VizSearchComparison />
      </section>

      <section>
        <h2>4. Resources per Dataset</h2>
        <p>
          Groups 50 recent health-related datasets by how many downloadable
          resources each one contains.
        </p>
        <VizResourceCounts />
      </section>

      <section>
        <h2>5. Update Timeline</h2>
        <p>
          Shows when the 100 most recently modified datasets were last updated,
          grouped by month.
        </p>
        <VizUpdateTimeline />
      </section>

      <section>
        <h2>6. Format Comparison by Topic</h2>
        <p>
          Compares the top 5 resource formats across three different search
          topics to reveal how data packaging varies by subject area.
        </p>
        <VizFormatByTopic />
      </section>

      <p>
        <a href="/">&larr; Back to API documentation</a>
      </p>
    </main>
  );
}
