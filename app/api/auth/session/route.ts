// /app/api/auth/session/route.ts
import { NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"

export const runtime = "nodejs"

export async function GET(req: Request) {
  try {
    // getSessionFromRequest가 동기여도 await는 안전하게 동작
    const session = await getSessionFromRequest(req)

    return NextResponse.json(
      {
        ok: true,
        authed: Boolean(session),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[/api/auth/session] error:", error)

    // 에러가 나도 헤더가 오탐지하지 않도록 authed:false로 고정
    return NextResponse.json(
      {
        ok: false,
        authed: false,
      },
      { status: 200 },
    )
  }
}
