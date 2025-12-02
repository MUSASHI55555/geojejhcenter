// app/api/gallery/[...key]/route.ts
import { NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"
import type { GalleryItem, GalleryImage } from "@/lib/gallery-types"
import { head, put } from "@vercel/blob"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

/* ---------------------------------- utils --------------------------------- */
function jsonError(message: string, status = 400, debug?: any) {
  return NextResponse.json(
    { ok: false, error: message, ...(debug !== undefined ? { debug } : {}) },
    { status },
  )
}

function isValidGalleryKey(key: string) {
  return (
    typeof key === "string" &&
    key.startsWith("galleries/") &&
    key.endsWith(".json") &&
    !key.includes("..") &&
    !key.includes("//")
  )
}

async function buildKeyFromParams(
  params: { key: string | string[] } | Promise<{ key: string | string[] }>,
): Promise<string | null> {
  const resolved = await Promise.resolve(params).catch(() => null)
  const raw = resolved?.key
  if (!raw) return null
  const parts = Array.isArray(raw) ? raw : [raw]
  const joined = parts.join("/").trim()
  if (!isValidGalleryKey(joined)) return null
  return joined
}

function sanitizeImages(input: any): GalleryImage[] | undefined {
  if (!Array.isArray(input)) return undefined
  const list = input
    .filter((img: any) => img && typeof img.url === "string")
    .map((img: any) => ({
      url: String(img.url),
      alt: typeof img.alt === "string" ? img.alt.slice(0, 200) : undefined,
    }))
  return list.length > 0 ? list : undefined
}

function isValidISO(s?: string): boolean {
  if (!s || typeof s !== "string") return false
  const t = Date.parse(s)
  return Number.isFinite(t)
}

/* ------------------------------------ PUT ---------------------------------- */
export async function PUT(
  req: Request,
  ctx:
    | { params: { key: string | string[] } }
    | { params: Promise<{ key: string | string[] }> },
) {
  try {
    // 1) 로그인 필요
    const session = await getSessionFromRequest(req)
    if (!session) return jsonError("로그인이 필요합니다.", 401)

    // 2) 키 복원/검증
    const key = await buildKeyFromParams((ctx as any).params)
    if (!key) {
      console.error("[GalleryCatchAll.PUT] invalid key")
      return jsonError("유효하지 않은 key 형식입니다.", 400)
    }

    // 3) 본문 파싱
    type Incoming = {
      title?: string
      description?: string
      category?: string
      images?: any
      createdAt?: string // 선택: 작성일 수정
      author?: string    // 선택: 작성자 수정
    }
    let body: Incoming | null = null
    try {
      const json = await req.json()
      body = json && typeof json === "object" ? (json as Incoming) : null
    } catch {
      body = null
    }
    if (!body) return jsonError("요청 데이터가 올바르지 않습니다. (본문 누락)", 400)

    // 4) 기존 JSON 로드
    const meta = await head(key).catch((err: any) => {
      console.error("[GalleryCatchAll.PUT] head 실패", key, err)
      return null
    })
    if (!meta || !(meta as any).url) return jsonError("해당 갤러리를 찾을 수 없습니다.", 404)

    const srcUrl = (meta as any).downloadUrl || (meta as any).url
    if (!srcUrl || typeof srcUrl !== "string")
      return jsonError("기존 갤러리 데이터를 불러오지 못했습니다.", 500)

    const current = (await fetch(srcUrl)
      .then((r) => {
        if (!r.ok) throw new Error(`blob fetch 실패: ${r.status}`)
        return r.json()
      })
      .catch((err) => {
        console.error("[GalleryCatchAll.PUT] 기존 JSON 파싱 실패", key, err)
        return null
      })) as GalleryItem | null

    if (!current || !current.title || !current.images)
      return jsonError("기존 갤러리 데이터 형식이 올바르지 않습니다.", 500)

    // 5) 변경 필드 머지
    const nextTitle =
      typeof body.title === "string" && body.title.trim() ? body.title.trim() : current.title

    const nextDesc =
      typeof body.description === "string" ? body.description : current.description

    const nextCategory =
      typeof body.category === "string" && body.category.trim()
        ? body.category.trim()
        : current.category

    const nextImages = body.images !== undefined ? sanitizeImages(body.images) : current.images

    // createdAt(선택) 검증/반영
    let nextCreatedAt = current.createdAt
    if (typeof body.createdAt === "string" && body.createdAt.trim()) {
      if (!isValidISO(body.createdAt)) {
        return jsonError("createdAt은 ISO 형식 문자열이어야 합니다.", 400)
      }
      nextCreatedAt = new Date(body.createdAt).toISOString()
    }

    // author(선택)
    const nextAuthor =
      typeof body.author === "string" && body.author.trim() ? body.author.trim() : current.author

    if (!nextTitle || !nextImages || nextImages.length === 0) {
      return jsonError("수정된 갤러리 데이터가 올바르지 않습니다.", 400)
    }

    // viewCount / views는 별도 카운터 Blob에서 관리하므로
    // 내용 JSON에서는 제거하고 나머지만 유지
    const { viewCount: _vc, views: _v, ...restCurrent } = current

    const next: GalleryItem & { updatedAt?: string } = {
      ...restCurrent,
      title: nextTitle,
      description: nextDesc,
      category: nextCategory,
      images: nextImages,
      createdAt: nextCreatedAt || restCurrent.createdAt, // 지정 시 갱신
      author: nextAuthor,
      updatedAt: new Date().toISOString(),
    }

    // 6) 덮어쓰기 저장
    try {
      const result = await put(key, JSON.stringify(next), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      })
      console.log("[GalleryCatchAll.PUT] put 성공", { key, url: result.url })
      return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err: any) {
      console.error("[GalleryCatchAll.PUT] put 실패", key, err)
      return jsonError("갤러리 저장 중 오류가 발생했습니다.", 500, {
        key,
        message: err?.message || String(err),
        name: err?.name,
      })
    }
  } catch (err: any) {
    console.error("[GalleryCatchAll.PUT] 처리 중 예외", err)
    return jsonError("갤러리 수정 처리 중 예기치 못한 오류가 발생했습니다.", 500, {
      message: err?.message || String(err),
    })
  }
}
