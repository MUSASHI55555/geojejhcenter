// app/gallery/view/IncrementView.tsx

"use client"

import { useEffect, useRef } from "react"

type Props = {
  blobKey: string
  url: string
  onUpdated?: (viewCount: number) => void
}

export function IncrementView({
  blobKey,
  url,
  onUpdated,
}: Props) {
  const calledRef = useRef(false)

  useEffect(() => {
    if (!blobKey || calledRef.current) return
    calledRef.current = true

    ;(async () => {
      try {
        const res = await fetch(
          "/api/gallery/increment-view",
          {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            cache: "no-store",
            body: JSON.stringify({
              key: blobKey,
              url,
            }),
          },
        )

        if (!res.ok) {
          const text =
            await res
              .text()
              .catch(() => "")
          console.error(
            "[Gallery IncrementView] 응답 오류",
            res.status,
            text.slice(0, 200),
          )
          return
        }

        const ct =
          res.headers.get(
            "content-type",
          ) || ""
        if (!ct.includes("application/json")) {
          console.error(
            "[Gallery IncrementView] JSON 아님",
            ct,
          )
          return
        }

        const data: any =
          await res
            .json()
            .catch(() => null)
        if (
          !data ||
          data.ok !== true
        ) {
          console.error(
            "[Gallery IncrementView] 형식 오류",
            data,
          )
          return
        }

        const v =
          typeof data.viewCount ===
          "number"
            ? data.viewCount
            : typeof data.views ===
                "number"
            ? data.views
            : undefined

        if (
          typeof v === "number" &&
          onUpdated
        ) {
          onUpdated(v)
        }
      } catch (e) {
        console.error(
          "[Gallery IncrementView] 요청 실패",
          e,
        )
      }
    })()
  }, [blobKey, url, onUpdated])

  return null
}
