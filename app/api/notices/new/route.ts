// app/api/notices/new/route.ts

import { NextResponse } from "next/server"
import { put } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"
import type {
  Notice as NoticeType,
  NoticeAttachment,
  NoticeImage,
} from "@/lib/notices-types"

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

function sanitizeAttachments(input: any): NoticeAttachment[] | undefined {
  if (!Array.isArray(input)) return undefined

  const list = input
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

function sanitizeImages(input: any): NoticeImage[] | undefined {
  if (!Array.isArray(input)) return undefined

  const list = input
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

function resolveCreatedAt(raw: any, nowISO: string): string {
  if (!raw) return nowISO

  const str = String(raw).trim()
  if (!str) return nowISO

  // yyyy-MM-dd 또는 ISO 형식 모두 허용
  let d = new Date(str)
  if (Number.isNaN(d.getTime())) {
    // yyyy-MM-dd 강제 파싱 시도
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(str)
    if (m) {
      const [_, y, mo, da] = m
      d = new Date(Date.UTC(Number(y), Number(mo) - 1, Number(da), 0, 0, 0))
    }
  }

  if (Number.isNaN(d.getTime())) {
    return nowISO
  }

  return d.toISOString()
}

export async function POST(req: Request) {
  try {
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    let body:
      | {
          title?: string
          content?: string
          category?: string
          attachments?: any
          images?: any
          createdAt?: any
        }
      | null = null

    try {
      const json = await req.json()
      body = json && typeof json === "object" ? json : null
    } catch {
      body = null
    }

    if (!body) {
      return jsonError("요청 데이터가 올바르지 않습니다.", 400)
    }

    const title = (body.title || "").toString().trim()
    const content = (body.content || "").toString()
    const category =
      (body.category || "공지").toString().trim() || "공지"

    const attachments = sanitizeAttachments(body.attachments)
    const images = sanitizeImages(body.images)

    if (!title || !content.trim()) {
      return jsonError("제목과 내용을 모두 입력해 주세요.", 400)
    }

    const now = new Date().toISOString()
    const createdAt = resolveCreatedAt(body.createdAt, now)

    const notice: NoticeType = {
      title,
      content,
      category,
      createdAt,
      author: "관리자",
      views: 0,
      viewCount: 0,
      ...(attachments ? { attachments } : {}),
      ...(images ? { images } : {}),
    }

    const safeTimestamp = createdAt.replace(/[:.]/g, "_")
    const random =
      (globalThis.crypto &&
        "randomUUID" in globalThis.crypto &&
        (globalThis.crypto as any).randomUUID()) ||
      Math.random().toString(36).slice(2)

    const key = `notices/${safeTimestamp}-${random}.json`

    try {
      const result = await put(key, JSON.stringify(notice), {
        access: "public",
        contentType: "application/json",
        addRandomSuffix: false,
        allowOverwrite: false,
      })

      console.log("[NoticesNew] 생성 성공", {
        key,
        url: result.url,
      })

      return NextResponse.json({ ok: true, key }, { status: 200 })
    } catch (err: any) {
      console.error("[NoticesNew] put 실패", err)
      return jsonError("공지 저장 중 오류가 발생했습니다.", 500, {
        message: err?.message || String(err),
        name: err?.name,
      })
    }
  } catch (err: any) {
    console.error("[NoticesNew] 처리 중 예외", err)
    return jsonError(
      "공지 등록 처리 중 예기치 못한 오류가 발생했습니다.",
      500,
      { message: err?.message || String(err) },
    )
  }
}
