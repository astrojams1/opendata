import { describe, expect, it } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";

import HomePage from "@/app/page";

describe("HomePage", () => {
  it("renders as a getting-started guide, not a sales page", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Getting Started");
    expect(html).toContain("does not serve the underlying data files themselves");

    // No marketing language
    expect(html).not.toContain("Reliable health data discovery");
    expect(html).not.toContain("Why teams use this gateway");
    expect(html).not.toContain("product teams");
  });

  it("documents query parameters in a table", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Query parameters");
    expect(html).toContain("<table");
    expect(html).toContain("pageSize");
    expect(html).toContain("sort");
    expect(html).toContain("format");
  });

  it("shows an example response", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Example response");
    expect(html).toContain("&quot;datasets&quot;");
    expect(html).toContain("&quot;totalPages&quot;");
  });

  it("includes query examples with descriptions", () => {
    const html = renderToStaticMarkup(<HomePage />);

    const matches = html.match(/\/api\/datasets\?/g) ?? [];
    expect(matches.length).toBeGreaterThanOrEqual(6);
    expect(html).toContain("More examples");
  });

  it("includes code snippets for Python, R, and JavaScript", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Python");
    expect(html).toContain("requests.get");
    expect(html).toContain(">R<");
    expect(html).toContain("httr2");
    expect(html).toContain("JavaScript");
    expect(html).toContain("fetch");
  });

  it("includes the live visualization section", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).toContain("Live example");
    expect(html).toContain("Loading live API example");
  });

  it("does not contain fabricated Medicaid data", () => {
    const html = renderToStaticMarkup(<HomePage />);

    expect(html).not.toContain("Medicaid");
    expect(html).not.toContain("autism");
    expect(html).not.toContain("ABA therapy");
  });
});
