// app/api/notices/delete/route.ts
import { NextResponse } from "next/server"
import { head, del } from "@vercel/blob"
import { getSessionFromRequest } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

function isValidNoticeKey(key: string): boolean {
  return (
    typeof key === "string" &&
    key.startsWith("notices/") &&
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
    // 1. 로그인 여부만 확인 (역할 체크 X)
    const session = await getSessionFromRequest(req)
    if (!session) {
      return jsonError("로그인이 필요합니다.", 401)
    }

    // 2. body 파싱
    const body = await safeJson<{ key?: string }>(req)
    const key = body?.key

    if (!key) {
      return jsonError(
        "요청 데이터가 올바르지 않습니다. (key 누락)",
        400,
      )
    }

    // 3. key 검증
    if (!isValidNoticeKey(key)) {
      console.error("[NoticesDelete] 잘못된 key 형식", key)
      return jsonError("유효하지 않은 공지 key입니다.", 400)
    }

    // 4. 존재 확인
    const meta = await head(key).catch((err: any) => {
      console.error("[NoticesDelete] head 실패", key, err)
      return null
    })

    if (!meta || !(meta as any).url) {
      return NextResponse.json(
        {
          ok: false,
          error: "이미 삭제되었거나 존재하지 않는 공지입니다.",
        },
        { status: 404 },
      )
    }

    // 5. 삭제
    try {
      await del(key)
    } catch (err) {
      console.error("[NoticesDelete] del 실패", key, err)
      return jsonError("공지 삭제 중 오류가 발생했습니다.", 500)
    }

    // 6. 성공
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (err) {
    console.error("[NoticesDelete] 처리 중 예외", err)
    return jsonError(
      "공지 삭제 처리 중 예기치 못한 오류가 발생했습니다.",
      500,
    )
  }
}
