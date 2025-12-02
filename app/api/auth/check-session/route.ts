import { NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(req: Request) {
  try {
    const session = await getSessionFromRequest(req)

    if (!session) {
      return NextResponse.json({ ok: false, session: null }, { status: 401 })
    }

    return NextResponse.json(
      {
        ok: true,
        session: {
          sub: session.sub,
          exp: session.exp,
        },
      },
      { status: 200 },
    )
  } catch (err) {
    console.error("[CheckSession] error", err)
    return NextResponse.json({ ok: false, session: null }, { status: 500 })
  }
}
