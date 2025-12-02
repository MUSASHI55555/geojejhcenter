"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type AdminWriteButtonProps = {
  href: string
  label: string
}

export function AdminWriteButton({ href, label }: AdminWriteButtonProps) {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let alive = true

    ;(async () => {
      try {
        const res = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "include",
        })

        if (!res.ok) {
          if (alive) setVisible(false)
          return
        }

        const data = await res.json().catch(() => null)

        // 세션 규약: { authed: true } 일 때만 작성 버튼 노출
        const authed = data?.authed === true

        if (alive) setVisible(authed)
      } catch (err) {
        console.error("[AdminWriteButton] session check failed", err)
        if (alive) setVisible(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  if (!visible) return null

  return (
    <Link
      href={href}
      className="inline-flex items-center px-4 py-2 rounded-full bg-[#1F3AA7] text-white text-xs font-medium hover:bg-[#182e82] transition shadow-sm"
    >
      {label}
    </Link>
  )
}
