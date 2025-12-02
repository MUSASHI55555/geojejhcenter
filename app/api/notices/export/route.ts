// /app/api/notices/export/route.ts
import { NextResponse } from "next/server";
import { list } from "@vercel/blob";
import { requireAuthOrThrow } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    // 관리자만
    requireAuthOrThrow(req);

    // notices/ 하위 목록
    const { blobs } = await list({ prefix: "notices/" });

    // 최신순 정렬 후 모두 fetch
    const rows = blobs
      .filter(b => b.pathname.endsWith(".json"))
      .sort((a, b) => (b.uploadedAt || 0) - (a.uploadedAt || 0));

    const items = [];
    for (const b of rows) {
      const r = await fetch(b.url, { cache: "no-store" });
      if (!r.ok) continue; // 실패 건은 건너뜀
      const data = await r.json().catch(() => null);
      if (data) {
        items.push({
          key: b.pathname,
          url: b.url,
          uploadedAt: b.uploadedAt,
          size: b.size,
          data, // 실제 공지 내용(JSON)
        });
      }
    }

    // 다운로드로 받기 위한 헤더
    const res = NextResponse.json({ ok: true, count: items.length, items });
    res.headers.set("content-disposition", `attachment; filename="notices-export.json"`);
    res.headers.set("cache-control", "no-store");
    return res;
  } catch (e: any) {
    const status = e?.status ?? 500;
    return NextResponse.json({ ok: false, error: e?.message ?? "export failed" }, { status });
  }
}
