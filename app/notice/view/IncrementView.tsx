// app/notice/view/IncrementView.tsx
"use client"

import { useEffect, useRef } from "react"

type Props = {
  blobKey: string
  url: string
  onUpdated?: (views: number) => void
}

export function IncrementView({ blobKey, url, onUpdated }: Props) {
  const sentRef = useRef(false)

  useEffect(() => {
    if (sentRef.current) return
    sentRef.current = true

    const run = async () => {
      try {
        const encodedKey = encodeURIComponent(blobKey)

        const res = await fetch(
          `/api/notices/incr-view?key=${encodedKey}`,
          {
            method: "POST",
            cache: "no-store",
          },
        )

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error(
            "[IncrementView] 응답 오류",
            res.status,
            text.slice(0, 200),
          )
          return
        }

        const ct = res.headers.get("content-type") || ""
        if (!ct.includes("application/json")) {
          console.error(
            "[IncrementView] JSON 아님",
            ct,
          )
          return
        }

        const data: any = await res.json().catch((e: any) => {
          console.error(
            "[IncrementView] JSON 파싱 실패",
            e,
          )
          return null
        })

        if (!data || data.ok !== true) {
          console.error(
            "[IncrementView] 실패 응답",
            data,
          )
          return
        }

        const serverValue =
          typeof data.viewCount === "number"
            ? data.viewCount
            : typeof data.views === "number"
            ? data.views
            : null

        if (serverValue != null) {
          onUpdated?.(serverValue)
        }
        // serverValue 없으면 그냥 조용히 패스: 기존 값 유지
      } catch (e) {
        console.error("[IncrementView] 요청 에러", e)
      }
    }

    run()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return null
}
