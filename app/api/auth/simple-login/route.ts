// /app/api/auth/simple-login/route.ts
import { NextResponse } from "next/server";
import { createSessionCookie } from "@/lib/auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function norm(s: unknown) {
  return String(s ?? "").replace(/\r\n/g, "\n").trim().normalize("NFC");
}

export async function POST(req: Request) {
  try {
    // 1) JSON 안전 파싱
    let body: any = null;
    try {
      body = await req.json();
    } catch {
      body = {};
    }

    // 2) ENV 방어
    const expected = norm(process.env.ADMIN_PASSWORD);
    const secret = norm(process.env.AUTH_SECRET);

    if (!expected) {
      return NextResponse.json(
        { ok: false, error: "SERVER_MISCONFIG: ADMIN_PASSWORD missing" },
        { status: 500 }
      );
    }
    if (!secret) {
      return NextResponse.json(
        { ok: false, error: "SERVER_MISCONFIG: AUTH_SECRET missing" },
        { status: 500 }
      );
    }

    // 3) 비밀번호 비교 (공백/정규화 통일)
    const given = norm(body.password);
    if (given !== expected) {
      return NextResponse.json({ ok: false, error: "Invalid credentials" }, { status: 401 });
    }

    // 4) 토큰 생성도 예외 보강
    let token = "";
    try {
      token = createSessionCookie("admin");
    } catch (e: any) {
      return NextResponse.json(
        { ok: false, error: `TOKEN_CREATE_FAILED: ${e?.message ?? "unknown"}` },
        { status: 500 }
      );
    }

    // 5) 쿠키 설정은 응답 객체에서만
    const res = NextResponse.json({ ok: true });
    res.headers.set("cache-control", "no-store");
    res.cookies.set("s", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 12, // 12h
    });
    return res;
  } catch (e: any) {
    // 어떤 이유든 최종 방어막
    return NextResponse.json(
      { ok: false, error: e?.message ?? "unknown" },
      { status: 500 }
    );
  }
}

export async function GET() {
  // 헬스체크 (배포 환경에서 키 존재 확인)
  const hasAdmin = Boolean(norm(process.env.ADMIN_PASSWORD));
  const hasSecret = Boolean(norm(process.env.AUTH_SECRET));
  return NextResponse.json({ ok: hasAdmin && hasSecret, hasAdmin, hasSecret });
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true });
  res.headers.set("cache-control", "no-store");
  res.cookies.set("s", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  return res;
}
