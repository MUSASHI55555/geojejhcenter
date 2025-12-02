// lib/notices-permission.ts

export type SessionUser = {
  id: string
  role: "ADMIN" | "EDITOR" | "VIEWER" | (string & {})
}

export type Notice = {
  title: string
  content: string
  category?: string
  createdAt?: string
  updatedAt?: string
  author?: string
  views?: number
  viewCount?: number
  ownerId?: string
  allowedRoles?: string[]
}

// Blob key 형식이 안전한지 검증 (수정/삭제 API에서만 사용)
export function isValidNoticeKey(key: string | undefined | null): key is string {
  if (!key || typeof key !== "string") return false
  if (!key.startsWith("notices/")) return false
  if (!key.endsWith(".json")) return false
  if (key.includes("..")) return false
  if (key.includes("//")) return false
  return true
}

// 공지 수정/삭제 가능 여부 (서버에서 최종 판단)
export function canEditNotice(user: SessionUser | null | undefined, notice: Notice | null | undefined): boolean {
  if (!user || !notice) return false

  // 최고 권한
  if (user.role === "ADMIN") return true

  // 작성자 본인
  if (notice.ownerId && notice.ownerId === user.id) return true

  // 공지에 허용된 역할 목록이 지정된 경우
  if (Array.isArray(notice.allowedRoles) && notice.allowedRoles.includes(user.role)) {
    return true
  }

  return false
}
