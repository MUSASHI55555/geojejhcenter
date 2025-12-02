// app/api/notice-view/route.ts
import { NextResponse } from "next/server"

export const runtime = "nodejs"

function jsonError(message: string, status: number) {
  return NextResponse.json({ ok: false, error: message }, { status })
}

/**
 * 안정 전용 엔드포인트
 *
 * - IncrementView에서 호출
 * - 항상 JSON으로만 응답
 * - 현재는 조회수 실제 반영 없이 "ok"만 반환 (페이지 안 깨지게 하는 게 1순위)
 * - 나중에 Blob 연동해서 views 증가 로직 여기에 추가하면 됨
 */
export async function POST(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const key = searchParams.get("key") || ""
    const url = searchParams.get("url") || ""

    if (!key || !url) {
      return jsonError("key와 url이 필요합니다.", 400)
    }

    // 여기서는 no-op: 호출 성공만 보장
    return NextResponse.json({ ok: true }, { status: 200 })
  } catch (e: any) {
    console.error("[notice-view] 서버 에러", e)
    return jsonError("조회수 처리 중 오류가 발생했습니다.", 500)
  }
}

export async function GET() {
  return jsonError("Method Not Allowed", 405)
}
