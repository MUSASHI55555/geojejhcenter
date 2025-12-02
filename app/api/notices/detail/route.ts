// app/api/notices/detail/route.ts

import { NextResponse } from "next/server"
import { head } from "@vercel/blob"
import type {
  Notice as NoticeType,
  NoticeAttachment,
  NoticeImage,
} from "@/lib/notices-types"
import { fetchWithRetry } from "@/lib/fetch-with-retry"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type RawNotice = any

function errorJson(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

// --- attachments / images normalize ---

function normalizeAttachments(raw: any): NoticeAttachment[] | undefined {
  if (!Array.isArray(raw)) return undefined

  const list = raw
    .filter((f: any) => f && typeof f.url === "string")
    .map((f: any) => ({
      name: String(f.name || "첨부파일"),
      url: String(f.url),
      size:
        typeof f.size === "number" && f.size >= 0
          ? f.size
          : undefined,
      contentType:
        typeof f.contentType === "string"
          ? f.contentType
          : undefined,
    }))

  return list.length > 0 ? list : undefined
}

function normalizeImages(raw: any): NoticeImage[] | undefined {
  if (!Array.isArray(raw)) return undefined

  const list = raw
    .filter((img: any) => img && typeof img.url === "string")
    .map((img: any) => ({
      url: String(img.url),
      alt:
        typeof img.alt === "string"
          ? img.alt.slice(0, 200)
          : undefined,
    }))

  return list.length > 0 ? list : undefined
}

// --- main notice normalize (콘텐츠 JSON만 기준) ---

function normalizeNotice(raw: RawNotice): NoticeType | null {
  if (!raw || typeof raw !== "object") return null
  if (!raw.title || raw.content === undefined || raw.content === null) {
    return null
  }

  // createdAt/updatedAt은 없는 경우 undefined 유지
  const createdAt =
    typeof raw.createdAt === "string"
      ? raw.createdAt
      : typeof raw.created_at === "string"
      ? raw.created_at
      : undefined

  const updatedAt =
    typeof raw.updatedAt === "string"
      ? raw.updatedAt
      : typeof raw.updated_at === "string"
      ? raw.updated_at
      : undefined

  const viewsValue =
    typeof raw.viewCount === "number"
      ? raw.viewCount
      : typeof raw.views === "number"
      ? raw.views
      : 0

  const attachments = normalizeAttachments(raw.attachments)
  const images = normalizeImages(raw.images)

  return {
    title: String(raw.title),
    content: String(raw.content),
    category: raw.category || "공지",
    createdAt,
    updatedAt,
    author: raw.author || "관리자",
    views: viewsValue,
    viewCount: viewsValue,
    ...(attachments ? { attachments } : {}),
    ...(images ? { images } : {}),
  }
}

// 조회수 카운터 Blob key 생성: notices/... → notices-views/...
function toCounterKey(noticeKey: string): string {
  return noticeKey.replace(/^notices\//, "notices-views/")
}

// 카운터 Blob에서 viewCount 읽기 (없거나 깨졌으면 undefined 반환)
async function readCounterViewCount(
  counterKey: string,
): Promise<number | undefined> {
  try {
    const meta = await head(counterKey).catch(() => null)
    if (!meta || !(meta as any).url) {
      return undefined
    }

    const srcUrl =
      (meta as any).downloadUrl || (meta as any).url

    const res = await fetchWithRetry(srcUrl, {
      maxRetries: 3,
      initialDelayMs: 100,
      maxDelayMs: 2000,
    })

    if (!res.ok) {
      console.error(
        "[NoticesDetail] counter fetch failed",
        counterKey,
        res.status,
      )
      return undefined
    }

    const text = await res.text()

    // HTML 에러 페이지나 Rate limit 응답이 저장된 경우 무시
    if (
      text.startsWith("<!DOCTYPE") ||
      text.startsWith("<html") ||
      text.includes("Too Many Requests")
    ) {
      console.error(
        "[NoticesDetail] counter corrupted",
        counterKey,
        text.slice(0, 100),
      )
      return undefined
    }

    let data: any
    try {
      data = JSON.parse(text)
    } catch (e) {
      console.error(
        "[NoticesDetail] counter JSON parse failed",
        counterKey,
        e,
      )
      return undefined
    }

    const v =
      typeof data.viewCount === "number"
        ? data.viewCount
        : typeof data.views === "number"
        ? data.views
        : undefined

    if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
      return v
    }

    return undefined
  } catch (e) {
    console.error("[NoticesDetail] counter read error", counterKey, e)
    return undefined
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const encoded = searchParams.get("key") || ""

    if (!encoded) {
      console.error("[GET /api/notices/detail] key 없음")
      return errorJson("유효하지 않은 key 입니다. (비어 있음)", 400)
    }

    let decoded: string
    try {
      decoded = decodeURIComponent(encoded).trim()
    } catch (e: any) {
      console.error("[GET /api/notices/detail] decode 실패", encoded, e)
      return errorJson("유효하지 않은 key 형식입니다.", 400)
    }

    if (
      !decoded ||
      !decoded.startsWith("notices/") ||
      !decoded.endsWith(".json") ||
      decoded.includes("..") ||
      decoded.includes("//")
    ) {
      console.error("[GET /api/notices/detail] key 형식 오류", decoded)
      return errorJson("유효하지 않은 key 형식입니다.", 400)
    }

    const meta = await head(decoded).catch((e: any) => {
      console.error(
        "[GET /api/notices/detail] head 실패",
        decoded,
        e,
      )
      return null
    })

    if (!meta) {
      return errorJson("공지 데이터를 찾을 수 없습니다.", 404)
    }

    const url =
      (meta as any).downloadUrl || (meta as any).url

    if (!url || typeof url !== "string") {
      console.error(
        "[GET /api/notices/detail] blob URL 없음",
        decoded,
        meta,
      )
      return errorJson("공지 데이터를 불러오지 못했습니다.", 500)
    }

    const res = await fetch(url)
    if (!res.ok) {
      console.error(
        "[GET /api/notices/detail] blob fetch 실패",
        decoded,
        res.status,
        await res.text().catch(() => ""),
      )
      return errorJson("공지 데이터를 불러오지 못했습니다.", 500)
    }

    const raw = await res.json().catch((e: any) => {
      console.error(
        "[GET /api/notices/detail] blob JSON 파싱 실패",
        decoded,
        e,
      )
      return null
    })

    const baseNotice = normalizeNotice(raw)
    if (!baseNotice) {
      console.error(
        "[GET /api/notices/detail] normalize 실패",
        decoded,
        raw,
      )
      return errorJson("공지 데이터 형식이 올바르지 않습니다.", 500)
    }

    // --- 조회수 카운터 Blob에서 값 읽어서 merge ---

    const counterKey = toCounterKey(decoded)
    const counterView = await readCounterViewCount(counterKey)

    const baseView =
      typeof baseNotice.viewCount === "number"
        ? baseNotice.viewCount
        : typeof baseNotice.views === "number"
        ? baseNotice.views
        : 0

    const finalView =
      typeof counterView === "number" ? counterView : baseView

    const mergedNotice: NoticeType = {
      ...baseNotice,
      views: finalView,
      viewCount: finalView,
    }

    return NextResponse.json({ ok: true, notice: mergedNotice }, { status: 200 })
  } catch (e: any) {
    console.error("[GET /api/notices/detail] 서버 에러", e)
    return errorJson(
      "서버 오류로 공지 데이터를 불러오지 못했습니다.",
      500,
    )
  }
}

export async function POST() {
  return errorJson("Method Not Allowed", 405)
}
