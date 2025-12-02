// app/login/page.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

/**
 * 로그인 페이지 동작 원칙
 * - 이미 로그인(유효 세션)이면 next 로 바로 리다이렉트
 * - 세션 없을 때만 로그인 폼 노출
 * - 로그인 성공 시 next (기본: /notice) 로 이동
 */

export default function LoginPage() {
  const router = useRouter()
  const [nextPath, setNextPath] = useState<string>("/notice")
  const [checking, setChecking] = useState(true)

  // ✅ URL의 ?next= 파라미터를 클라이언트에서만 파싱
  useEffect(() => {
    if (typeof window === "undefined") return

    const url = new URL(window.location.href)
    const next = url.searchParams.get("next")

    if (next && typeof next === "string") {
      setNextPath(next)
    }
  }, [])

  // ✅ 세션 체크: 이미 로그인 상태면 nextPath 로 바로 보냄
  useEffect(() => {
    let mounted = true

    async function checkSession() {
      try {
        const res = await fetch("/api/auth/session", {
          method: "GET",
          cache: "no-store",
          credentials: "include",
        })

        if (!res.ok) throw new Error()

        const data = await res.json()

        const isAuthed =
          Boolean(data?.authed) ||
          Boolean(data?.user) ||
          Boolean(data?.session) ||
          (data?.ok === true &&
            (data?.role || data?.email || data?.name))

        if (!mounted) return

        if (isAuthed) {
          // 이미 로그인 상태 → 로그인 화면 보여줄 필요 없이 즉시 이동
          router.replace(nextPath || "/notice")
          return
        }
      } catch {
        // 세션 없음 → 폼 보여주면 됨
      } finally {
        if (mounted) setChecking(false)
      }
    }

    checkSession()
    return () => {
      mounted = false
    }
  }, [nextPath, router])

  if (checking) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center text-sm text-slate-500">
        인증 상태 확인 중…
      </div>
    )
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4 py-10 bg-slate-50">
      <div className="w-full max-w-sm rounded-2xl bg-white shadow-md px-6 py-7">
        <h1 className="text-lg font-semibold text-slate-900 mb-1">
          관리자 로그인
        </h1>
        <p className="text-[11px] text-slate-500 mb-5">
          거제지역자활센터 공지사항 관리를 위한 전용 로그인입니다.
        </p>
        <LoginForm next={nextPath} />
      </div>
    </div>
  )
}

/* ---------------- LoginForm (내장형) ---------------- */

function LoginForm({ next }: { next: string }) {
  const router = useRouter()
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch("/api/auth/simple-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const msg = await safeText(res)
        throw new Error(msg || "로그인에 실패했습니다.")
      }

      // 세션 쿠키 설정 후 next 로 이동
      const target = next && typeof next === "string" ? next : "/notice"
      router.push(target)
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "로그인 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <label
          htmlFor="password"
          className="block text-[11px] font-medium text-slate-800"
        >
          관리자 비밀번호
        </label>
        <input
          id="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]"
          placeholder="비밀번호를 입력하세요."
        />
      </div>

      {error && (
        <p className="text-[10px] text-red-600 whitespace-pre-line">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={submitting}
        className="mt-1 w-full inline-flex items-center justify-center rounded-md bg-[#1F3AA7] px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#152a7c] disabled:opacity-60"
      >
        {submitting ? "로그인 중…" : "로그인"}
      </button>
    </form>
  )
}

/* ---------------- Util ---------------- */

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text()
  } catch {
    return ""
  }
}
