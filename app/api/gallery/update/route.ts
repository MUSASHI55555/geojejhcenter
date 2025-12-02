// app/api/gallery/update/route.ts
import { NextResponse } from "next/server"
import { head, put } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"
import type { GalleryItem, GalleryImage } from "@/lib/gallery-types"
import { fetchWithRetry } from "@/lib/fetch-with-retry"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function jsonError(message: string, status = 400, debug?: any) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      ...(debug !== undefined ? { debug } : {}),
    },
    { status },
  )
}

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

export async function PUT(req: Request) {
  try {
    // 1. Login required
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    // 2. Parse body
    let body: {
      key?: string
      title?: string
      description?: string
      category?: string
      images?: any
      createdAt?: string
      thumbnail?: {
        imageIndex: number
        focus?: "top" | "center" | "bottom"
      }
    } | null = null

    try {
      const json = await req.json()
      body = json && typeof json === "object" ? json : null
    } catch {
      body = null
    }

    if (!body || !body.key) {
      return jsonError("요청 데이터가 올바르지 않습니다. (key 누락)", 400)
    }

    const key = body.key.trim()

    if (!key.startsWith("galleries/") || !key.endsWith(".json")) {
      return jsonError("유효하지 않은 key 형식입니다.", 400)
    }

    // 3. Load existing gallery item
    const meta = await head(key).catch((err: any) => {
      console.error("[GalleryUpdate] head failed", key, err)
      return null
    })

    if (!meta || !(meta as any).url) {
      console.error("[GalleryUpdate] meta missing or url missing", key, meta)
      return jsonError("해당 갤러리를 찾을 수 없습니다.", 404)
    }

    const srcUrl = (meta as any).downloadUrl || (meta as any).url

    if (!srcUrl || typeof srcUrl !== "string") {
      console.error("[GalleryUpdate] blob URL missing", key, meta)
      return jsonError("기존 갤러리 데이터를 불러오지 못했습니다.", 500)
    }

    let current: GalleryItem | null = null
    
    try {
      const res = await fetchWithRetry(srcUrl, {
        maxRetries: 3,
        initialDelayMs: 100,
        maxDelayMs: 2000,
      })
      
      if (!res.ok) {
        console.error(
          "[GalleryUpdate] fetch failed",
          key,
          res.status,
          res.statusText,
        )
        return jsonError(
          `기존 갤러리 데이터를 불러오지 못했습니다. (HTTP ${res.status})`,
          500,
        )
      }
      
      const text = await res.text()
      
      if (text.startsWith("<!DOCTYPE") || text.startsWith("<html") || text.includes("Too Many Requests")) {
        console.error(
          "[GalleryUpdate] HTML/error response instead of JSON",
          key,
          text.slice(0, 200),
        )
        return jsonError(
          "기존 갤러리 데이터가 손상되었습니다. 관리자에게 문의해 주세요.",
          500,
        )
      }
      
      current = JSON.parse(text) as GalleryItem
    } catch (err: any) {
      console.error(
        "[GalleryUpdate] existing JSON load/parse failed",
        key,
        err?.message || err,
      )
      return jsonError(
        "기존 갤러리 데이터를 읽을 수 없습니다. 잠시 후 다시 시도해 주세요.",
        500,
      )
    }

    if (!current || !current.title) {
      console.error("[GalleryUpdate] existing data format error", key, current)
      return jsonError("기존 갤러리 데이터 형식이 올바르지 않습니다.", 500)
    }

    // Bug was: some fields were being overwritten with undefined when not changed
    const nextTitle =
      typeof body.title === "string" && body.title.trim()
        ? body.title.trim()
        : current.title

    const nextDescription =
      body.description !== undefined
        ? typeof body.description === "string"
          ? body.description.trim() || undefined
          : undefined
        : current.description

    const nextCategory =
      body.category !== undefined
        ? typeof body.category === "string"
          ? body.category.trim() || undefined
          : undefined
        : current.category

    const nextImages =
      body.images !== undefined ? sanitizeImages(body.images) : current.images

    if (!nextTitle) {
      return jsonError("제목은 필수입니다.", 400)
    }

    if (!nextImages || nextImages.length === 0) {
      return jsonError("최소 1개 이상의 이미지가 필요합니다.", 400)
    }

    let nextCreatedAt = current.createdAt

    if ("createdAt" in body) {
      const raw = body.createdAt

      if (raw === "" || raw === null || raw === undefined) {
        nextCreatedAt = current.createdAt
      } else if (typeof raw === "string") {
        nextCreatedAt = raw
      } else {
        return jsonError("createdAt 형식이 올바르지 않습니다.", 400)
      }
    }

    // Previously: if body.thumbnail was undefined, current.thumbnail was lost
    let nextThumbnail: GalleryItem["thumbnail"] = current.thumbnail

    if (body.thumbnail !== undefined) {
      if (body.thumbnail && typeof body.thumbnail.imageIndex === "number") {
        const idx = body.thumbnail.imageIndex
        if (idx >= 0 && idx < nextImages.length) {
          nextThumbnail = {
            imageIndex: idx,
            focus: body.thumbnail.focus || "center",
          }
        } else {
          // Invalid index, clear thumbnail
          nextThumbnail = undefined
        }
      } else {
        // Explicitly remove thumbnail
        nextThumbnail = undefined
      }
    }

    const next: GalleryItem = {
      ...current,
      key,
      title: nextTitle,
      description: nextDescription,
      category: nextCategory,
      images: nextImages,
      createdAt: nextCreatedAt,
      updatedAt: new Date().toISOString(),
      thumbnail: nextThumbnail,
      viewCount: current.viewCount,
    }

    console.log("[GalleryUpdate] 수정 시작", {
      key,
      titleChanged: next.title !== current.title,
      createdAtChanged: next.createdAt !== current.createdAt,
      thumbnailChanged: JSON.stringify(next.thumbnail) !== JSON.stringify(current.thumbnail),
    })

    try {
      const result = await put(key, JSON.stringify(next), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: true,
      })

      console.log("[GalleryUpdate] put success", {
        key,
        url: result.url,
      })

      return NextResponse.json({ ok: true }, { status: 200 })
    } catch (err: any) {
      console.error("[GalleryUpdate] put failed", key, err)
      return jsonError("갤러리 저장 중 오류가 발생했습니다.", 500, {
        key,
        message: err?.message || String(err),
        name: err?.name,
      })
    }
  } catch (err: any) {
    console.error("[GalleryUpdate] processing exception", err)
    return jsonError("갤러리 수정 처리 중 예기치 못한 오류가 발생했습니다.", 500, {
      message: err?.message || String(err),
    })
  }
}
