// app/api/gallery/detail/route.ts

import { NextResponse } from "next/server"
import { head } from "@vercel/blob"
import type { GalleryItem, GalleryImage } from "@/lib/gallery-types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RawGallery = any

function errorJson(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

function normalizeImages(raw: any): GalleryImage[] {
  if (!Array.isArray(raw)) return []

  return raw
    .filter((img: any) => img && typeof img.url === "string")
    .map((img: any) => ({
      url: String(img.url),
      alt: typeof img.alt === "string" ? img.alt : undefined,
    }))
}

function normalizeGalleryItem(raw: RawGallery, key: string): GalleryItem | null {
  if (!raw || typeof raw !== "object") return null
  if (!raw.title) return null

  const createdAt =
    typeof raw.createdAt === "string" ? raw.createdAt : new Date().toISOString()
  const updatedAt =
    typeof raw.updatedAt === "string" ? raw.updatedAt : undefined

  const viewCount =
    typeof raw.viewCount === "number"
      ? raw.viewCount
      : typeof raw.views === "number"
      ? raw.views
      : 0

  const images = normalizeImages(raw.images)

  if (images.length === 0) {
    console.error("[GET /api/gallery/detail] No valid images found", key)
    return null
  }

  let thumbnail: GalleryItem["thumbnail"] = undefined
  if (raw.thumbnail && typeof raw.thumbnail === "object") {
    const idx = raw.thumbnail.imageIndex
    if (typeof idx === "number" && idx >= 0 && idx < images.length) {
      thumbnail = {
        imageIndex: idx,
        focus: raw.thumbnail.focus || "center",
      }
    }
  }

  return {
    key,
    title: String(raw.title),
    description: typeof raw.description === "string" ? raw.description : undefined,
    category: raw.category || undefined,
    createdAt,
    updatedAt,
    images,
    thumbnail,
    viewCount,
    author: raw.author || "관리자",
  }
}

/**
 * galleries/... → galleries-views/... 로 카운터 blob key 변환
 */
function toCounterKey(decoded: string): string {
  return decoded.replace(/^galleries\//, "galleries-views/")
}

/**
 * 카운터 Blob에서 viewCount 읽어오기 (없거나 깨져 있으면 undefined 반환)
 */
async function readCounterViews(decoded: string): Promise<number | undefined> {
  const counterKey = toCounterKey(decoded)

  const meta = await head(counterKey).catch((e: any) => {
    if (e?.status !== 404) {
      console.error(
        "[GET /api/gallery/detail] counter head failed",
        counterKey,
        e,
      )
    }
    return null
  })

  if (!meta) {
    // 아직 카운터가 생성되지 않은 경우
    return undefined
  }

  const url = (meta as any).downloadUrl || (meta as any).url
  if (!url || typeof url !== "string") {
    console.error(
      "[GET /api/gallery/detail] counter blob URL missing",
      counterKey,
      meta,
    )
    return undefined
  }

  const res = await fetch(url)
  if (!res.ok) {
    console.error(
      "[GET /api/gallery/detail] counter blob fetch failed",
      counterKey,
      res.status,
      await res.text().catch(() => ""),
    )
    return undefined
  }

  const text = await res.text().catch(() => "")
  if (
    !text ||
    text.startsWith("<!DOCTYPE") ||
    text.startsWith("<html") ||
    text.includes("Too Many Requests")
  ) {
    console.error(
      "[GET /api/gallery/detail] counter blob corrupted",
      counterKey,
      text.slice(0, 120),
    )
    return undefined
  }

  try {
    const data: any = JSON.parse(text)
    const v =
      typeof data.viewCount === "number"
        ? data.viewCount
        : typeof data.views === "number"
        ? data.views
        : undefined

    if (typeof v === "number" && v >= 0) {
      return v
    }
    return undefined
  } catch (e: any) {
    console.error(
      "[GET /api/gallery/detail] counter JSON parse failed",
      counterKey,
      e,
    )
    return undefined
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const encoded = searchParams.get("key") || ""

    if (!encoded) {
      console.error("[GET /api/gallery/detail] key missing")
      return errorJson("유효하지 않은 key 입니다. (비어 있음)", 400)
    }

    let decoded: string
    try {
      decoded = decodeURIComponent(encoded).trim()
    } catch (e: any) {
      console.error("[GET /api/gallery/detail] decode failed", encoded, e)
      return errorJson("유효하지 않은 key 형식입니다.", 400)
    }

    if (
      !decoded ||
      !decoded.startsWith("galleries/") ||
      !decoded.endsWith(".json") ||
      decoded.includes("..") ||
      decoded.includes("//")
    ) {
      console.error("[GET /api/gallery/detail] key format error", decoded)
      return errorJson("유효하지 않은 key 형식입니다.", 400)
    }

    const meta = await head(decoded).catch((e: any) => {
      console.error("[GET /api/gallery/detail] head failed", decoded, e)
      return null
    })

    if (!meta) {
      return errorJson("갤러리 데이터를 찾을 수 없습니다.", 404)
    }

    const url = (meta as any).downloadUrl || (meta as any).url

    if (!url || typeof url !== "string") {
      console.error("[GET /api/gallery/detail] blob URL missing", decoded, meta)
      return errorJson("갤러리 데이터를 불러오지 못했습니다.", 500)
    }

    const res = await fetch(url)
    if (!res.ok) {
      console.error(
        "[GET /api/gallery/detail] blob fetch failed",
        decoded,
        res.status,
        await res.text().catch(() => ""),
      )
      return errorJson("갤러리 데이터를 불러오지 못했습니다.", 500)
    }

    const raw = await res.json().catch((e: any) => {
      console.error("[GET /api/gallery/detail] blob JSON parse failed", decoded, e)
      return null
    })

    const itemBase = normalizeGalleryItem(raw, decoded)
    if (!itemBase) {
      console.error("[GET /api/gallery/detail] normalize failed", decoded, raw)
      return errorJson("갤러리 데이터 형식이 올바르지 않습니다.", 500)
    }

    // 🔹 조회수 카운터 Blob에서 값 읽어와서 merge
    let finalItem: GalleryItem = { ...itemBase }

    try {
      const counterViews = await readCounterViews(decoded)
      if (typeof counterViews === "number") {
        finalItem = {
          ...finalItem,
          viewCount: counterViews,
          // 과거/호환용 필드도 같이 맞춰준다
          ...(counterViews >= 0 ? { views: counterViews } : {}),
        } as any
      }
    } catch (e: any) {
      console.error(
        "[GET /api/gallery/detail] counter merge failed",
        decoded,
        e,
      )
      // 조회수 실패는 치명적 에러로 보지 않고, 본문만이라도 반환
    }

    return NextResponse.json({ ok: true, item: finalItem }, { status: 200 })
  } catch (e: any) {
    console.error("[GET /api/gallery/detail] server error", e)
    return errorJson("서버 오류로 갤러리 데이터를 불러오지 못했습니다.", 500)
  }
}

export async function POST() {
  return errorJson("Method Not Allowed", 405)
}
