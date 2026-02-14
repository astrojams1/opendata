import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];

if (!inputPath) {
  console.error("Usage: node scripts/format-viz.mjs <api-response.json>");
  process.exit(1);
}

const payload = JSON.parse(fs.readFileSync(inputPath, "utf-8"));
const counts = new Map();
for (const dataset of payload.datasets ?? []) {
  for (const resource of dataset.resources ?? []) {
    const format = resource.format?.trim() ? resource.format.toUpperCase() : "UNKNOWN";
    counts.set(format, (counts.get(format) ?? 0) + 1);
  }
}

const series = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8);
const max = Math.max(1, ...series.map(([, count]) => count));

const bars = series
  .map(([format, count]) => {
    const width = Math.round((count / max) * 460);
    return `<g><text x="0" y="0" fill="#d8f9ff" font-size="13">${format} (${count})</text><rect x="170" y="-12" width="${width}" height="14" rx="7" fill="url(#bar)" /></g>`;
  })
  .map((row, index) => `<g transform="translate(20, ${40 + index * 32})">${row}</g>`)
  .join("\n");

const html = `<!doctype html>
<html>
  <body style="margin:0;font-family:Inter,Arial,sans-serif;background:#07040f;color:#d8f9ff;">
    <main style="max-width:760px;margin:0 auto;padding:24px;">
      <h1 style="color:#ff66e8;">HHS API format distribution</h1>
      <p>Input: ${path.basename(inputPath)}</p>
      <svg width="700" height="340" role="img" aria-label="Resource format distribution bar chart">
        <defs>
          <linearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#7df9ff"/>
            <stop offset="100%" stop-color="#ff66e8"/>
          </linearGradient>
        </defs>
        ${bars}
      </svg>
    </main>
  </body>
</html>`;

const output = inputPath.replace(/\.json$/i, "-viz.html");
fs.writeFileSync(output, html);
console.log(`Wrote ${output}`);
