// app/api/notices/admin/login/route.ts
import { NextResponse } from "next/server"

export const runtime = "nodejs"

type LoginBody = {
  password?: string
}

export async function POST(req: Request) {
  try {
    const body = (await req.json().catch(() => ({}))) as LoginBody
    const password = (body.password || "").trim()

    const expected = process.env.NOTICE_ADMIN_PASSWORD

    // 1. 서버 설정 확인
    if (!expected) {
      console.error(
        "[NoticesAdminLogin] NOTICE_ADMIN_PASSWORD is not set on server",
      )
      return NextResponse.json(
        {
          ok: false,
          error:
            "서버 설정 오류: NOTICE_ADMIN_PASSWORD가 설정되어 있지 않습니다.",
        },
        { status: 500 },
      )
    }

    // 2. 비밀번호 검증
    if (!password || password !== expected) {
      return NextResponse.json(
        { ok: false, error: "비밀번호가 올바르지 않습니다." },
        { status: 401 },
      )
    }

    // 3. 세션 쿠키 발급
    const res = NextResponse.json({ ok: true }, { status: 200 })

    // 개발 환경에서 https가 아니면 Secure 빼세요.
    const cookieParts = [
      "notice_admin=1",
      "Path=/",
      "HttpOnly",
      "SameSite=Lax",
      // "Secure", // 로컬 http에서 테스트할 땐 주석 처리
      // "Max-Age=86400", // 필요하면 유지시간 지정
    ]

    res.headers.append("Set-Cookie", cookieParts.join("; "))

    return res
  } catch (e) {
    console.error("[NoticesAdminLogin] unexpected error", e)
    return NextResponse.json(
      { ok: false, error: "로그인 처리 중 오류가 발생했습니다." },
      { status: 500 },
    )
  }
}
