import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("uses unbranded headline copy", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Reliable health data discovery for research and product teams.");
    expect(html).not.toContain("Neon-fast");
  });

  it("includes a broad set of API query examples", () => {
    const html = renderToStaticMarkup(<HomePage />);

    const matches = html.match(/\/api\/datasets\?/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(11);
    expect(html).toContain("API in use: live visualization");
    expect(html).toContain("Loading live API example…");
    expect(html).toContain("Python notebook");
    expect(html).toContain("JavaScript dashboard");
  });

  it("includes four medicaid autism claims visualizations", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Medicaid autism claims visualizations");
    expect(html).toContain("Autism claims as % of total Medicaid claims (by state)");
    expect(html).toContain("Autism claims per 10,000 Medicaid members");
    expect(html).toContain("Autism service category mix");
    expect(html).toContain("Year-over-year autism claims trend");
  });
});
