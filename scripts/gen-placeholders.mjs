import { writeFileSync } from "fs";
import { join } from "path";

const outDir = join(process.cwd(), "public", "images");

function svg({ w, h, label, bg = "#111827", fg = "#CBD5E1", accent = "#005FAD" }) {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${bg}"/>
      <stop offset="100%" stop-color="#0A0F1E"/>
    </linearGradient>
  </defs>
  <rect width="${w}" height="${h}" fill="url(#g)"/>
  <rect x="0" y="0" width="${w}" height="6" fill="${accent}"/>
  <text x="50%" y="50%" fill="${fg}" font-family="Arial, sans-serif" font-size="${Math.max(14, Math.round(w / 22))}" text-anchor="middle" dominant-baseline="middle">${label}</text>
</svg>`;
}

const files = [
  ...[1, 2, 3].map((n) => [`placeholder-hero-${n}.svg`, svg({ w: 1600, h: 900, label: `Hero Image ${n} (replace)` })]),
  ["placeholder-event-axis.svg", svg({ w: 800, h: 500, label: "AXIS Congress (replace)" })],
  ...[1, 2, 3, 4].map((n) => [`placeholder-event-${n}.svg`, svg({ w: 800, h: 500, label: `Event Photo ${n} (replace)` })]),
  ...[1, 2, 3, 4, 5, 6, 7].map((n) => [`placeholder-avatar-${n}.svg`, svg({ w: 400, h: 400, label: `Headshot ${n}`, bg: "#1E2A3A" })]),
  ["placeholder-avatar-advisor.svg", svg({ w: 400, h: 400, label: "Advisor Photo", bg: "#1E2A3A" })],
  ...[1, 2, 3].map((n) => [`placeholder-project-${n}.svg`, svg({ w: 800, h: 500, label: `Project ${n} (replace)` })]),
  ["placeholder-logo-ieee.svg", svg({ w: 240, h: 120, label: "IEEE", bg: "#0A0F1E" })],
  ["placeholder-logo-babcock.svg", svg({ w: 240, h: 120, label: "Babcock Univ.", bg: "#0A0F1E" })],
  ["placeholder-logo-bucc.svg", svg({ w: 240, h: 120, label: "BUCC", bg: "#0A0F1E" })],
  ["placeholder-logo-gdg.svg", svg({ w: 240, h: 120, label: "GDG Babcock", bg: "#0A0F1E" })],
  ...[1, 2, 3].map((n) => [`placeholder-news-${n}.svg`, svg({ w: 800, h: 500, label: `News Image ${n} (replace)` })]),
  ["placeholder-axis-banner.svg", svg({ w: 1920, h: 1080, label: "AXIS Congress 2026 Banner (replace)", accent: "#F59E0B" })],
  ...[1, 2, 3, 4].map((n) => [`placeholder-gallery-${n}.svg`, svg({ w: 800, h: 600, label: `Gallery Photo ${n} (replace)` })]),
];

for (const [name, content] of files) {
  writeFileSync(join(outDir, name), content, "utf-8");
}

console.log(`Generated ${files.length} placeholder images in ${outDir}`);
