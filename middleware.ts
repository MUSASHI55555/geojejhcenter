// middleware.ts
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

// 공지 작성 페이지 접근 제어:
// - s 쿠키(세션 토큰)가 없으면 /login?next=/notice/new 로 보냄
// - 쿠키가 있으면 통과 (유효성 검사는 서버 라우트에서 처리)
export function middleware(req: NextRequest) {
  const { pathname, search } = req.nextUrl

  if (pathname === "/notice/new") {
    const token = req.cookies.get("s")?.value

    if (!token) {
      const loginUrl = req.nextUrl.clone()
      loginUrl.pathname = "/login"
      loginUrl.search = `?next=${encodeURIComponent(pathname + search)}`
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/notice/new"],
}
