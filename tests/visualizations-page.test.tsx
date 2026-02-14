import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import VisualizationsPage from "@/app/visualizations/page";

describe("VisualizationsPage", () => {
  it("renders all six visualization sections", () => {
    const html = renderToStaticMarkup(<VisualizationsPage />);

    expect(html).toContain("Resource Format Distribution");
    expect(html).toContain("Tag Frequency");
    expect(html).toContain("Search Term Comparison");
    expect(html).toContain("Resources per Dataset");
    expect(html).toContain("Update Timeline");
    expect(html).toContain("Format Comparison by Topic");
  });

  it("declares that all data comes from real API calls", () => {
    const html = renderToStaticMarkup(<VisualizationsPage />);

    expect(html).toContain("No data on this page is fabricated");
    expect(html).toContain("/api/datasets");
  });

  it("does not contain any fabricated data values", () => {
    const html = renderToStaticMarkup(<VisualizationsPage />);

    // The server render should only show loading states, not hardcoded numbers
    expect(html).toContain("Fetching format distribution");
    expect(html).toContain("Fetching tag frequency data");
    expect(html).toContain("Querying dataset counts");
    expect(html).toContain("Analyzing resource counts");
    expect(html).toContain("Building update timeline");
    expect(html).toContain("Comparing formats across topics");
  });

  it("links back to the API documentation", () => {
    const html = renderToStaticMarkup(<VisualizationsPage />);
    expect(html).toContain("Back to API documentation");
  });
});
