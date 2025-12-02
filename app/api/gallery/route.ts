// app/api/gallery/route.ts
// [GALLERY_LIST_API] 갤러리 목록 조회 (날짜 기반 정렬 + 분리된 조회수 카운터 병합 버전)

import { type NextRequest, NextResponse } from "next/server"
import { list, head } from "@vercel/blob"
import { fetchWithRetry, processBatched } from "@/lib/fetch-with-retry"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type GalleryListItem = {
  key: string
  title: string
  category?: string
  createdAt?: string
  thumbnailUrl?: string
  viewCount?: number
  thumbnailFocus?: "top" | "center" | "bottom"
}

// 날짜 문자열을 타임스탬프(ms)로 변환 (실패 시 0)
function parseDateToMs(value?: string): number {
  if (!value || typeof value !== "string") return 0

  const trimmed = value.trim()
  if (!trimmed) return 0

  // YYYY.MM.DD, YYYY/MM/DD 같은 것도 어느 정도 흡수
  const normalized = trimmed.replace(/[./]/g, "-")

  const t = Date.parse(normalized)
  if (!Number.isFinite(t)) return 0
  return t
}

// blob key (예: galleries/20251118-123456-xxxx.json)에서 날짜 추론
function inferDateFromKey(key: string): number {
  const m = key.match(/(\d{4})(\d{2})(\d{2})/)
  if (!m) return 0

  const [, y, mo, d] = m
  const iso = `${y}-${mo}-${d}T00:00:00Z`
  const t = Date.parse(iso)
  if (!Number.isFinite(t)) return 0
  return t
}

// galleries/... → galleries-views/...
function toCounterKey(key: string): string {
  return key.replace(/^galleries\//, "galleries-views/")
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

function parseQueryInt(
  value: string | null,
  fallback: number,
  opts?: { min?: number; max?: number },
): number {
  const n = value ? Number.parseInt(value, 10) : Number.NaN
  let v = Number.isFinite(n) ? n : fallback

  if (opts?.min !== undefined && v < opts.min) v = opts.min
  if (opts?.max !== undefined && v > opts.max) v = opts.max

  return v
}

// 개별 갤러리의 카운터 Blob(galleries-views/...)에서 viewCount 읽기
async function readCounterView(key: string): Promise<number | undefined> {
  const counterKey = toCounterKey(key)

  try {
    const meta = await head(counterKey).catch(() => null)
    if (!meta || !(meta as any).url) {
      return undefined
    }

    const srcUrl = (meta as any).downloadUrl || (meta as any).url
    if (!srcUrl || typeof srcUrl !== "string") return undefined

    const res = await fetchWithRetry(srcUrl, {
      maxRetries: 3,
      initialDelayMs: 100,
      maxDelayMs: 2000,
    })

    if (!res.ok) {
      console.error(
        "[GET /api/gallery] counter fetch failed",
        counterKey,
        res.status,
      )
      return undefined
    }

    const text = await res.text()

    // HTML / Too Many Requests 같은 에러 페이지가 저장돼 있으면 무시
    if (
      text.startsWith("<!DOCTYPE") ||
      text.startsWith("<html") ||
      text.includes("Too Many Requests")
    ) {
      console.error(
        "[GET /api/gallery] counter corrupted",
        counterKey,
        text.slice(0, 100),
      )
      return undefined
    }

    let data: any
    try {
      data = JSON.parse(text)
    } catch (e: any) {
      console.error(
        "[GET /api/gallery] counter JSON parse failed",
        counterKey,
        e?.message || e,
      )
      return undefined
    }

    const v =
      typeof data.viewCount === "number"
        ? data.viewCount
        : typeof data.views === "number"
        ? data.views
        : 0

    if (!Number.isFinite(v) || v < 0) return undefined
    return v
  } catch (e: any) {
    console.error(
      "[GET /api/gallery] counter read error",
      toCounterKey(key),
      e?.message || e,
    )
    return undefined
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const page = parseQueryInt(searchParams.get("page"), 1, { min: 1 })
    const pageSize = parseQueryInt(searchParams.get("pageSize"), 9, {
      min: 1,
      max: 50,
    })

    // 1) Blob list query
    let blobsResult: { blobs: Array<{ pathname: string; [key: string]: any }> }

    try {
      blobsResult = await list({
        prefix: "galleries/",
        limit: 1000,
      })
    } catch (e: any) {
      console.error("[GET /api/gallery] Blob list failed", e?.message || e)
      return jsonError("갤러리 목록 저장소 조회에 실패했습니다.", 500)
    }

    const { blobs } = blobsResult

    // 2) Filter .json only
    const galleryBlobs = blobs.filter(
      (b) => typeof b.pathname === "string" && b.pathname.endsWith(".json"),
    )

    // 3) 모든 JSON 로드 + sortOrder 계산 (여기서는 '내용 Blob'만 사용, 조회수는 나중에 병합)
    type InternalItem = GalleryListItem & {
      sortOrder: number
      sortTieBreaker: string
    }

    const rowsRaw = await processBatched(
      galleryBlobs,
      10, // Process 10 blobs at a time
      async (blob): Promise<InternalItem | null> => {
        const key = blob.pathname as string

        try {
          const url = (blob as any).downloadUrl || (blob as any).url
          if (!url || typeof url !== "string") {
            console.error("[GET /api/gallery] blob URL missing", key)
            return null
          }

          const res = await fetchWithRetry(url, {
            maxRetries: 3,
            initialDelayMs: 100,
            maxDelayMs: 2000,
          })

          const text = await res.text()

          let json: any
          try {
            json = JSON.parse(text)
          } catch (e: any) {
            console.error(
              "[GET /api/gallery] JSON parse failed",
              key,
              e?.message || e,
            )
            return null
          }

          const title =
            typeof json.title === "string" && json.title.trim().length > 0
              ? json.title.trim()
              : "(제목 없음)"

          const category =
            typeof json.category === "string" ? json.category : undefined

          const createdAt =
            typeof json.createdAt === "string" ? json.createdAt : undefined

          const updatedAt =
            typeof json.updatedAt === "string" ? json.updatedAt : undefined

          // ⚠️ 여기의 viewCount는 "기본값" 정도로만 사용 (실제 값은 counter Blob에서 덮어씀)
          const baseViewCount =
            typeof json.viewCount === "number"
              ? json.viewCount
              : typeof json.views === "number"
              ? json.views
              : 0

          let thumbnailUrl: string | undefined
          let thumbnailFocus: "top" | "center" | "bottom" | undefined

          if (Array.isArray(json.images) && json.images.length > 0) {
            if (json.thumbnail && typeof json.thumbnail.imageIndex === "number") {
              const idx = json.thumbnail.imageIndex
              if (idx >= 0 && idx < json.images.length) {
                thumbnailUrl = json.images[idx]?.url
                thumbnailFocus = json.thumbnail.focus || "center"
              } else {
                // Invalid index, fallback to first
                thumbnailUrl = json.images[0]?.url
                thumbnailFocus = "center"
              }
            } else {
              // No thumbnail selected, use first image
              thumbnailUrl = json.images[0]?.url
              thumbnailFocus = "center"
            }
          }

          // 정렬용 숫자 값: updatedAt > createdAt > key에서 추론
          const fromUpdated = parseDateToMs(updatedAt)
          const fromCreated = parseDateToMs(createdAt)
          const fromKey = inferDateFromKey(key)

          const sortOrder = fromUpdated || fromCreated || fromKey || 0

          const item: InternalItem = {
            key,
            title,
            category,
            createdAt,
            thumbnailUrl,
            thumbnailFocus,
            viewCount: baseViewCount,
            sortOrder,
            sortTieBreaker: key,
          }

          return item
        } catch (e: any) {
          console.error(
            "[GET /api/gallery] item processing failed",
            key,
            e?.message || e,
          )
          return null
        }
      },
    )

    // 4) null 제거 후 날짜 기준 내림차순 정렬
    const allItems = rowsRaw.filter(
      (row): row is InternalItem => row !== null,
    )

    allItems.sort((a, b) => {
      if (a.sortOrder < b.sortOrder) return 1
      if (a.sortOrder > b.sortOrder) return -1
      // 날짜가 같거나 둘 다 0인 경우 key로 안정적인 정렬
      if (a.sortTieBreaker < b.sortTieBreaker) return 1
      if (a.sortTieBreaker > b.sortTieBreaker) return -1
      return 0
    })

    const total = allItems.length

    // 5) Pagination (정렬 후 페이지네이션)
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const pageItems = allItems.slice(start, end)

    // 6) 해당 페이지 항목들에 대해서만 counter Blob에서 viewCount 병합
    const mergedItems: InternalItem[] = await Promise.all(
      pageItems.map(async (item) => {
        const counterView = await readCounterView(item.key)
        const finalView =
          typeof counterView === "number"
            ? counterView
            : typeof item.viewCount === "number"
            ? item.viewCount
            : 0

        return {
          ...item,
          viewCount: finalView,
        }
      }),
    )

    // 7) 정렬용 필드 제거 후 반환
    const rows: GalleryListItem[] = mergedItems.map(
      ({ sortOrder, sortTieBreaker, ...rest }) => rest,
    )

    return NextResponse.json(
      {
        ok: true,
        page,
        pageSize,
        total,
        rows,
      },
      { status: 200 },
    )
  } catch (e: any) {
    console.error("[GET /api/gallery] top-level error", e?.message || e)
    return jsonError("갤러리 목록을 불러오지 못했습니다.", 500)
  }
}
