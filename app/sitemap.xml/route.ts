import { NextResponse } from "next/server"

export const dynamic = "force-static"

const BASE_URL = "https://www.geojejh.or.kr"

const paths = [
  "/",
  "/intro",
  "/intro/greeting",
  "/intro/mother-foundation",
  "/intro/history",
  "/intro/organization",
  "/intro/location",
  "/business/self-support",
  "/business/workfare",
  "/business/social-enterprise",
  "/business/case-management",
  "/business/care",
  "/notice",
  "/gallery",
]

export async function GET() {
  const now = new Date().toISOString()

  const body =
    `<?xml version="1.0" encoding="UTF-8"?>` +
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">` +
    paths
      .map((path) => {
        const priority = path === "/" ? "1.0" : "0.7"
        return `
  <url>
    <loc>${BASE_URL}${path}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`
      })
      .join("") +
    `\n</urlset>`

  return new NextResponse(body, {
    status: 200,
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
    },
  })
}
