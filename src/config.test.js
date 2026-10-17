import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const read = (file) => readFileSync(resolve(root, file), "utf8");

describe("index.html", () => {
  const html = read("index.html");

  it("memiliki meta description dan bahasa dokumen", () => {
    expect(html).toMatch(/<html lang="id">/);
    expect(html).toMatch(/<meta\s+name="description"\s+content="[^"]{20,}"/);
  });

  it("memuat Google Fonts tanpa memblokir render", () => {
    expect(html).toMatch(/media="print"\s+onload="this\.media='all'"/);
    expect(html).toMatch(/<noscript>[\s\S]*fonts\.googleapis\.com[\s\S]*<\/noscript>/);
  });
});

describe("robots.txt", () => {
  it("valid: hanya direktif robots, bukan HTML", () => {
    const lines = read("public/robots.txt").split("\n").filter(Boolean);
    expect(lines.length).toBeGreaterThan(0);
    for (const line of lines) {
      expect(line).toMatch(/^(User-agent|Allow|Disallow|Sitemap|Crawl-delay):\s*\S*/);
    }
  });
});

describe("vercel.json", () => {
  const { rewrites } = JSON.parse(read("vercel.json"));

  it("mem-proxy /delcom-api ke API Delcom sebelum fallback SPA", () => {
    const proxyIndex = rewrites.findIndex((r) => r.source.startsWith("/delcom-api/"));
    const spaIndex = rewrites.findIndex((r) => r.destination === "/index.html");
    expect(proxyIndex).toBeGreaterThanOrEqual(0);
    expect(proxyIndex).toBeLessThan(spaIndex);
    expect(rewrites[proxyIndex].destination).toBe("https://open-api.delcom.org/api/v1/:path*");
  });

  it("fallback SPA tidak menangkap /delcom-api", () => {
    const spa = rewrites.find((r) => r.destination === "/index.html");
    const re = new RegExp(`^${spa.source}$`);
    expect(re.test("/delcom-api/users/me")).toBe(false);
    expect(re.test("/link-trees/7")).toBe(true);
  });
});
