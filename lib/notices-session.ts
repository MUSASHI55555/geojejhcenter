// lib/notices-session.ts

export type SessionUser = {
  id: string
  role: "ADMIN"
}

// 공지 관리자 전용 세션 쿠키
// /api/notices/admin/login 에서 이 쿠키를 발급한다.
const COOKIE_NAME = "notice_admin"
const COOKIE_VALUE = "1"

// Cookie 헤더 파싱 유틸
function parseCookies(header: string | null): Record<string, string> {
  if (!header) return {}
  const out: Record<string, string> = {}

  header
    .split(";")
    .map((v) => v.trim())
    .filter(Boolean)
    .forEach((pair) => {
      const idx = pair.indexOf("=")
      if (idx === -1) {
        out[pair] = ""
        return
      }
      const key = pair.slice(0, idx).trim()
      const val = pair.slice(idx + 1).trim()
      if (!key) return
      out[key] = val
    })

  return out
}

// Route Handler에서 Request 기준으로 관리자 세션 판별
export function getSessionUserFromRequest(req: Request): SessionUser | null {
  try {
    const cookies = parseCookies(req.headers.get("cookie"))
    const v = cookies[COOKIE_NAME]

    if (v === COOKIE_VALUE) {
      return {
        id: "notice-admin",
        role: "ADMIN",
      }
    }

    return null
  } catch (e) {
    console.error("[getSessionUserFromRequest] error", e)
    return null
  }
}

// 호환용: 일부 라우트에서 getSessionUser(req) 형태로 사용
export function getSessionUser(req: Request): SessionUser | null {
  return getSessionUserFromRequest(req)
}
