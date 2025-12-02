// app/api/gallery/delete/route.ts

import { NextResponse } from "next/server"
import { head, del } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"

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

function isValidGalleryKey(key: string): boolean {
  return (
    typeof key === "string" &&
    key.startsWith("galleries/") &&
    key.endsWith(".json") &&
    !key.includes("..") &&
    !key.includes("//")
  )
}

async function safeJson<T>(req: Request): Promise<T | null> {
  try {
    const data = (await req.json()) as T
    if (!data || typeof data !== "object") return null
    return data
  } catch {
    return null
  }
}

export async function POST(req: Request) {
  try {
    // 1. 로그인 체크 (공지와 동일 패턴)
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    // 2. Body 파싱
    const body = await safeJson<{ key?: string }>(req)
    const key = (body?.key || "").toString().trim()

    if (!key) {
      return jsonError("요청 데이터가 올바르지 않습니다. (key 누락)", 400)
    }

    // 3. key 검증 (Blob key = 단일 진실)
    if (!isValidGalleryKey(key)) {
      console.error("[GalleryDelete] invalid key format", key)
      return jsonError("유효하지 않은 갤러리 key입니다.", 400)
    }

    // 4. 존재 여부 확인
    const meta = await head(key).catch((err: any) => {
      console.error("[GalleryDelete] head failed", key, err)
      return null
    })

    if (!meta || !(meta as any).url) {
      return NextResponse.json(
        {
          ok: false,
          error: "이미 삭제되었거나 존재하지 않는 갤러리입니다.",
        },
        { status: 404 },
      )
    }

    // 5. 삭제 수행
    try {
      await del(key)
      console.log("[GalleryDelete] 삭제 성공", key)
    } catch (err: any) {
      console.error("[GalleryDelete] del failed", key, err)
      return jsonError("갤러리 삭제 중 오류가 발생했습니다.", 500, {
        key,
        message: err?.message || String(err),
        name: err?.name,
      })
    }

    // 6. 성공 응답
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err: any) {
    console.error("[GalleryDelete] processing exception", err)
    return jsonError("갤러리 삭제 처리 중 예기치 못한 오류가 발생했습니다.", 500, {
      message: err?.message || String(err),
    })
  }
}
