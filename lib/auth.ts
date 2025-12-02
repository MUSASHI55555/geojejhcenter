// lib/auth.ts
// 요청 객체 유무와 무관하게 안전하게 동작하는 인증 유틸 (Only One · Step 1)
import { createHmac, timingSafeEqual } from "node:crypto";

type Payload = { sub: string; iat: number; exp: number };

const ALG = { alg: "HS256", typ: "JWT" } as const;

function b64urlEncode(obj: unknown) {
  return Buffer.from(JSON.stringify(obj)).toString("base64url");
}
function b64urlDecode<T = unknown>(s: string): T {
  return JSON.parse(Buffer.from(s, "base64url").toString("utf8")) as T;
}
function sign(body: string, secret: string) {
  return createHmac("sha256", secret).update(body).digest("base64url");
}

export function createSessionCookie(user = "admin") {
  if (!process.env.AUTH_SECRET) throw new Error("AUTH_SECRET not set");
  const now = Math.floor(Date.now() / 1000);
  const payload: Payload = { sub: user, iat: now, exp: now + 60 * 60 * 12 }; // 12h
  const header = b64urlEncode(ALG);
  const body = `${header}.${b64urlEncode(payload)}`;
  const sig = sign(body, process.env.AUTH_SECRET);
  return `${body}.${sig}`;
}

/**
 * 주어진 Request에서 쿠키를 읽고, 없으면 next/headers.cookies()로 폴백.
 * 어느 컨텍스트(라우트/미들웨어/서버컴포넌트)에서도 예외 없이 동작.
 */
async function readCookie(name: string, req?: Request): Promise<string | null> {
  // 1) 표준 Request 헤더 경로
  try {
    const raw = req?.headers?.get("cookie") ?? "";
    if (raw) {
      const m = raw.match(new RegExp(`(?:^|; )${name}=([^;]+)`));
      if (m) return decodeURIComponent(m[1]);
    }
  } catch {
    // noop
  }
  // 2) 서버 컴포넌트/미들웨어 경로 (동적 임포트로 의존성 지연)
  try {
    const mod = await import("next/headers");
    const v = mod.cookies().get(name)?.value ?? null;
    return v;
  } catch {
    // next/headers 사용 불가 컨텍스트면 무시
  }
  return null;
}

function verifyToken(token: string | null): Payload | null {
  try {
    if (!token || !process.env.AUTH_SECRET) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const [h, p, sig] = parts;
    const body = `${h}.${p}`;
    const expected = sign(body, process.env.AUTH_SECRET);
    if (!timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;

    const payload = b64urlDecode<Payload>(p);
    if (!payload?.exp || Math.floor(Date.now() / 1000) > payload.exp) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getSessionFromRequest(req?: Request) {
  const token = await readCookie("s", req);
  return verifyToken(token);
}

/**
 * 권한이 없으면 401 에러를 던집니다. (어느 레이어에서 호출해도 안전)
 */
export async function requireAuthOrThrow(req?: Request) {
  const payload = await getSessionFromRequest(req);
  if (!payload) {
    const err: any = new Error("Unauthorized");
    err.status = 401;
    throw err;
  }
  return payload;
}
