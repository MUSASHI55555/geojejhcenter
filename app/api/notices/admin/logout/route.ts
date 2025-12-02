// app/api/notices/admin/logout/route.ts
import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function POST() {
  const res = NextResponse.json({ ok: true }, { status: 200 })
  // 쿠키 삭제
  res.headers.append(
    "Set-Cookie",
    [
      "notice_admin=; Path=/",
      "HttpOnly",
      "SameSite=Lax",
      "Secure",
      "Max-Age=0",
    ].join("; "),
  )
  return res
}
