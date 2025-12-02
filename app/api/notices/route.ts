// app/api/notices/route.ts
import { type NextRequest, NextResponse } from "next/server"
import { list, head } from "@vercel/blob"
import { fetchWithRetry, processBatched } from "@/lib/fetch-with-retry"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

type NoticeListItem = {
  key: string
  title: string
  category?: string
  createdAt?: string
  views?: number
}

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

function parseQueryInt(value: string | null, fallback: number, opts?: { min?: number; max?: number }): number {
  const n = value ? Number.parseInt(value, 10) : Number.NaN
  let v = Number.isFinite(n) ? n : fallback
  if (opts?.min !== undefined && v < opts.min) v = opts.min
  if (opts?.max !== undefined && v > opts.max) v = opts.max
  return v
}

function normScope(searchParams: URLSearchParams): "title" | "content" | "both" {
  const raw = (searchParams.get("scope") || "").toLowerCase()
  if (raw === "title" || raw === "content" || raw === "both") return raw as any

  // 레거시 호환: ?title=1&content=0 같은 패턴
  const legacyTitle = searchParams.get("title")
  const legacyContent = searchParams.get("content")
  if (legacyTitle === "1" && legacyContent === "0") return "title"
  if (legacyTitle === "0" && legacyContent === "1") return "content"
  if (legacyTitle === "1" && legacyContent === "1") return "both"
  return "both"
}

function safeLower(s: any): string {
  if (typeof s === "string") return s.toLowerCase()
  if (s == null) return ""
  try {
    return String(s).toLowerCase()
  } catch {
    return ""
  }
}

function isISODate(s?: string): boolean {
  if (!s) return false
  const t = Date.parse(s)
  return Number.isFinite(t)
}

// notices/... → notices-views/...
function toCounterKey(noticeKey: string): string {
  return noticeKey.replace(/^notices\//, "notices-views/")
}

// key에서 날짜 추출 (예: 2025-03-04T00_00_00_000Z-xxxx.json → ISO)
function deriveCreatedAt(raw: any, key: string): string | undefined {
  // 1) JSON 필드 우선
  const candidates: string[] = []
  if (typeof raw?.createdAt === "string") candidates.push(raw.createdAt)
  if (typeof raw?.created_at === "string") candidates.push(raw.created_at)

  for (const c of candidates) {
    const t = Date.parse(c)
    if (Number.isFinite(t)) {
      return new Date(t).toISOString()
    }
  }

  // 2) key에서 날짜 패턴 추출
  // 예시: notices/2025-03-04T00_00_00_000Z-457a8c...json
  const m = key.match(/\d{4}-\d{2}-\d{2}T\d{2}_\d{2}_\d{2}_\d{3}Z/)
  if (m) {
    const isoLike = m[0].replace(
      /T(\d{2})_(\d{2})_(\d{2})_(\d{3})Z/,
      (_whole, hh, mm, ss, ms) => `T${hh}:${mm}:${ss}.${ms}Z`,
    )
    const t = Date.parse(isoLike)
    if (Number.isFinite(t)) {
      return new Date(t).toISOString()
    }
  }

  // 3) 실패 시 undefined (정렬에서 뒤로 밀리게)
  return undefined
}

// 카운터 Blob에서 viewCount 읽기 (없거나 깨졌으면 undefined)
async function readCounterViewCountForNoticeKey(noticeKey: string): Promise<number | undefined> {
  const counterKey = toCounterKey(noticeKey)

  try {
    const meta = await head(counterKey).catch(() => null)
    if (!meta || !(meta as any).url) {
      return undefined
    }

    const srcUrl = (meta as any).downloadUrl || (meta as any).url

    const res = await fetchWithRetry(srcUrl, {
      maxRetries: 2, // Reduced from 3 to 2
      initialDelayMs: 500, // Increased delay
      maxDelayMs: 10000,
    })

    if (!res.ok) {
      return undefined
    }

    const text = await res.text()

    if (text.startsWith("<!DOCTYPE") || text.startsWith("<html") || text.includes("Too Many Requests")) {
      return undefined
    }

    let data: any
    try {
      data = JSON.parse(text)
    } catch {
      return undefined
    }

    const v =
      typeof data.viewCount === "number" ? data.viewCount : typeof data.views === "number" ? data.views : undefined

    if (typeof v === "number" && Number.isFinite(v) && v >= 0) {
      return v
    }

    return undefined
  } catch {
    return undefined
  }
}

export async function GET(req: NextRequest) {
  console.log("[v0] [GET /api/notices] Request started")
  try {
    const { searchParams } = new URL(req.url)

    const page = parseQueryInt(searchParams.get("page"), 1, { min: 1 })
    const pageSize = parseQueryInt(searchParams.get("pageSize"), 10, {
      min: 1,
      max: 50,
    })
    const qRaw = (searchParams.get("q") || "").trim()
    const q = qRaw.toLowerCase()
    const scope = normScope(searchParams)

    console.log("[v0] [GET /api/notices] Parsed params:", {
      page,
      pageSize,
      q,
      scope,
    })

    // 1) Blob 목록 조회
    let blobsResult: { blobs: Array<{ pathname: string; [key: string]: any }> }
    try {
      console.log("[v0] [GET /api/notices] Calling list() with prefix 'notices/'")
      blobsResult = await list({ prefix: "notices/", limit: 1000 })
      console.log("[v0] [GET /api/notices] list() returned", blobsResult.blobs.length, "blobs")
    } catch (e: any) {
      console.error("[GET /api/notices] Blob list 실패", e?.message || e, e?.stack)
      return jsonError("공지 목록 저장소 조회에 실패했습니다.", 500)
    }

    // 2) .json만
    const noticeBlobs = blobsResult.blobs.filter((b) => typeof b.pathname === "string" && b.pathname.endsWith(".json"))

    const allRowsRaw = await processBatched(
      noticeBlobs,
      5, // Batch size of 5 for initial scan
      async (blob) => {
        const key = blob.pathname as string
        try {
          const url = (blob as any).downloadUrl || (blob as any).url
          if (!url || typeof url !== "string") {
            return null
          }

          const res = await fetchWithRetry(url, {
            maxRetries: 2,
            initialDelayMs: 400,
            maxDelayMs: 10000,
          })

          const text = await res.text()

          if (text.startsWith("<!DOCTYPE") || text.startsWith("<html") || text.includes("Too Many Requests")) {
            console.error("[GET /api/notices] JSON이 아닌 응답 (corrupted?)", key, text.slice(0, 100))
            return null
          }

          let json: any
          try {
            json = JSON.parse(text)
          } catch (e: any) {
            console.error("[GET /api/notices] JSON 파싱 실패", key, e?.message || e)
            return null
          }

          const title =
            typeof json.title === "string" && json.title.trim().length > 0 ? json.title.trim() : "(제목 없음)"
          const category = typeof json.category === "string" ? json.category : undefined
          const createdAt = deriveCreatedAt(json, key)

          const baseViews =
            typeof json.viewCount === "number" ? json.viewCount : typeof json.views === "number" ? json.views : 0

          // 검색 매칭
          let matched = true
          if (q) {
            const hayTitle = safeLower(title)
            const hayContent = safeLower(json.content)
            if (scope === "title") matched = hayTitle.includes(q)
            else if (scope === "content") matched = hayContent.includes(q)
            else matched = hayTitle.includes(q) || hayContent.includes(q)
          }
          if (!matched) return null

          const item: NoticeListItem = { key, title, category, createdAt, views: baseViews }
          return item
        } catch (e: any) {
          console.error("[GET /api/notices] 항목 처리 실패", key, e?.message || e)
          return null
        }
      },
    )

    // 4) null 제거
    const filtered = allRowsRaw.filter((row): row is NoticeListItem => row !== null)

    // 5) 정렬: createdAt 내림차순
    filtered.sort((a, b) => {
      const aHas = isISODate(a.createdAt)
      const bHas = isISODate(b.createdAt)
      if (aHas && bHas) {
        return Date.parse(b.createdAt!) - Date.parse(a.createdAt!)
      }
      if (aHas && !bHas) return -1
      if (!aHas && bHas) return 1
      if (a.key < b.key) return 1
      if (a.key > b.key) return -1
      return 0
    })

    const total = filtered.length

    // 6) 페이지네이션
    const start = (page - 1) * pageSize
    const end = start + pageSize
    const pageItems = filtered.slice(start, end)

    console.log("[v0] [GET /api/notices] Fetching view counts for", pageItems.length, "items")
    const rowsWithCounter = await Promise.all(
      pageItems.map(async (item) => {
        const counterView = await readCounterViewCountForNoticeKey(item.key)
        return {
          ...item,
          views: typeof counterView === "number" ? counterView : item.views,
        }
      }),
    )

    console.log("[v0] [GET /api/notices] Returning response with", rowsWithCounter.length, "items")
    return NextResponse.json({ ok: true, page, pageSize, total, rows: rowsWithCounter }, { status: 200 })
  } catch (e: any) {
    console.error("[GET /api/notices] 최상위 에러 catch", e?.message || e, e?.stack)
    return jsonError("공지 목록을 불러오지 못했습니다.", 500)
  }
}
