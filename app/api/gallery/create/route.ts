// app/api/gallery/create/route.ts
import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"
import type { GalleryItem, GalleryImage } from "@/lib/gallery-types"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/* ---------------------------------- utils --------------------------------- */
// JSON 에러 응답
function jsonError(message: string, status = 400, debug?: any) {
  return NextResponse.json(
    { ok: false, error: message, ...(debug !== undefined ? { debug } : {}) },
    { status },
  )
}

// 이미지 배열 sanitize
function sanitizeImages(input: any): GalleryImage[] | null {
  if (!Array.isArray(input)) return null
  const list = input
    .filter((img: any) => img && typeof img.url === "string")
    .map((img: any) => ({
      url: String(img.url),
      alt: typeof img.alt === "string" ? img.alt : undefined,
    }))
  return list.length > 0 ? list : null
}

// ISO 문자열 유효성
function isValidISO(s?: string): boolean {
  if (!s || typeof s !== "string") return false
  const t = Date.parse(s)
  return Number.isFinite(t)
}

// 키에 들어갈 안전한 타임스탬프 포맷 (키 정렬 안정성)
function toSafeTimestamp(d: Date) {
  return d.toISOString().replace(/[:.]/g, "_")
}

/* ----------------------------------- API ---------------------------------- */
export async function POST(req: Request) {
  try {
    // 1) 로그인 필요
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    // 2) 본문 파싱
    type Incoming = {
      title?: string
      description?: string
      category?: string
      images?: any
      // 선택: 생성 시 작성일 직접 지정(ISO)
      createdAt?: string
      // 선택: 작성자 지정(없으면 '관리자')
      author?: string
      thumbnail?: {
        imageIndex: number
        focus?: "top" | "center" | "bottom"
      }
    }
    let body: Incoming | null = null
    try {
      const json = await req.json()
      body = json && typeof json === "object" ? (json as Incoming) : null
    } catch {
      body = null
    }
    if (!body) return jsonError("요청 데이터가 올바르지 않습니다.", 400)

    const title = (body.title || "").toString().trim()
    const description = body.description ? body.description.toString().trim() : undefined
    const category = body.category ? body.category.toString().trim() : undefined
    const images = sanitizeImages(body.images)
    const author =
      body.author && body.author.toString().trim().length > 0
        ? body.author.toString().trim()
        : "관리자"

    if (!title) return jsonError("제목을 입력해 주세요.", 400)
    if (!images || images.length === 0) return jsonError("최소 1개 이상의 이미지가 필요합니다.", 400)

    // 3) createdAt 결정 (있으면 유효성 검사 후 사용, 없으면 now)
    const now = new Date()
    let createdAtISO = now.toISOString()
    if (typeof body.createdAt === "string" && body.createdAt.trim()) {
      if (!isValidISO(body.createdAt)) {
        return jsonError("createdAt은 ISO 형식 문자열이어야 합니다.", 400)
      }
      createdAtISO = new Date(body.createdAt).toISOString()
    }

    // 4) 키 생성: 정렬 일관성을 위해 createdAt 기준 타임스탬프 사용
    const safeTimestamp = toSafeTimestamp(new Date(createdAtISO))
    const random =
      (globalThis.crypto &&
        "randomUUID" in globalThis.crypto &&
        (globalThis.crypto as any).randomUUID()) ||
      Math.random().toString(36).slice(2)
    const key = `galleries/${safeTimestamp}-${random}.json`

    let thumbnail: GalleryItem["thumbnail"] = undefined
    if (body.thumbnail && typeof body.thumbnail.imageIndex === "number") {
      const idx = body.thumbnail.imageIndex
      if (idx >= 0 && idx < images.length) {
        thumbnail = {
          imageIndex: idx,
          focus: body.thumbnail.focus || "center",
        }
      }
    }

    // 5) 저장 객체 구성
    const item: Omit<GalleryItem, "key"> & { key?: string; updatedAt?: string } = {
      title,
      description,
      category,
      createdAt: createdAtISO,
      images,
      thumbnail,
      viewCount: 0,
      author,
      // 최초 생성 시 updatedAt = createdAt과 동일하게 맞춰 두는 편이 깔끔
      updatedAt: createdAtISO,
    }

    // 6) Blob 저장 (신규 생성: addRandomSuffix=false, allowOverwrite=false)
    try {
      const result = await put(key, JSON.stringify({ ...item, key }), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: false,
      })

      // 로깅은 참고용
      console.log("[GalleryCreate] success", { key, url: result.url })

      return NextResponse.json({ ok: true, key }, { status: 200 })
    } catch (err: any) {
      console.error("[GalleryCreate] put failed", err)
      return jsonError("갤러리 저장 중 오류가 발생했습니다.", 500, {
        message: err?.message || String(err),
        name: err?.name,
      })
    }
  } catch (err: any) {
    console.error("[GalleryCreate] processing exception", err)
    return jsonError("갤러리 등록 처리 중 예기치 못한 오류가 발생했습니다.", 500, {
      message: err?.message || String(err),
    })
  }
}
