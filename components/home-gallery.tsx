// components/home-gallery.tsx
"use client"

import { useEffect, useState } from "react"
import Link from "next/link"

type GalleryListItem = {
  key: string
  title: string
  category?: string
  createdAt?: string
  thumbnailUrl?: string
  thumbnailFocus?: "top" | "center" | "bottom"
}

type GalleryListResponse = {
  ok: boolean
  rows?: GalleryListItem[]
  error?: string
}

function formatDate(dateString?: string) {
  if (!dateString) return ""
  const d = new Date(dateString)
  if (Number.isNaN(d.getTime())) return dateString
  const yyyy = d.getFullYear()
  const mm = `${d.getMonth() + 1}`.padStart(2, "0")
  const dd = `${d.getDate()}`.padStart(2, "0")
  return `${yyyy}.${mm}.${dd}`
}

function getFocusPosition(focus?: "top" | "center" | "bottom"): string {
  switch (focus) {
    case "top":
      return "50% 0%"
    case "bottom":
      return "50% 100%"
    case "center":
    default:
      return "50% 50%"
  }
}

export function HomeGallery() {
  const [items, setItems] = useState<GalleryListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const res = await fetch("/api/gallery?page=1&pageSize=2", {
          cache: "no-store",
        })

        if (!res.ok) {
          if (!cancelled) setError("갤러리를 불러오지 못했습니다.")
          return
        }

        const data = (await res.json()) as GalleryListResponse

        if (!data.ok || !data.rows) {
          if (!cancelled) setError(data.error || "갤러리를 불러오지 못했습니다.")
          return
        }

        if (!cancelled) {
          setItems(data.rows.slice(0, 2))
          setError(null)
        }
      } catch {
        if (!cancelled) setError("갤러리를 불러오지 못했습니다.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  if (loading || error || items.length === 0) return null

  return (
    <div
      className="
        flex h-full w-full flex-col
        rounded-3xl border border-black/[0.08]
        bg-white shadow-sm
      "
    >
      {/* 헤더 + 구분선: 공지사항과 완전히 동일한 구조 */}
      <div className="px-5 pt-4">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-[18px] md:text-[20px] font-semibold text-[#0B1320]">
            갤러리
          </h3>
          <Link
            href="/gallery"
            aria-label="갤러리 전체보기"
            className="
              flex h-7 w-7 items-center justify-center
              rounded-full border border-slate-200
              text-slate-500 hover:bg-slate-50 hover:text-slate-900
              transition-colors
            "
          >
            <span className="text-base leading-none">+</span>
          </Link>
        </div>

        <hr className="mt-2 w-full border-t-2 border-[#1F3AA7] rounded-full" />
      </div>

      {/* 썸네일 2개: 카드 전체 각지게, 텍스트는 하단 정렬 */}
      <div
        className="
          flex-1
          px-4 pb-4 pt-3
          grid grid-cols-2 gap-3
          min-h-[190px] md:min-h-[230px]
        "
      >
        {items.map((item) => {
          const encodedKey = encodeURIComponent(item.key)
          const hasThumb = Boolean(item.thumbnailUrl)

          return (
            <Link
              key={item.key}
              href={`/gallery/view?key=${encodedKey}`}
              className="
                group
                flex h-full flex-col
                bg-white
                border border-black/[0.06]
                shadow-xs
                hover:-translate-y-0.5 hover:shadow-md
                transition-all
                focus-visible:outline-none
                focus-visible:ring-2 focus-visible:ring-[#1F3AA7]
                focus-visible:ring-offset-2
                rounded-none
              "
            >
              {/* 이미지: 윗부분/모서리 전부 각진 상태 유지 */}
              <div className="relative h-28 md:h-44 w-full overflow-hidden bg-neutral-100">
                {hasThumb ? (
                  <img
                    src={item.thumbnailUrl as string || "/placeholder.svg"}
                    alt={item.title}
                    style={{
                      objectPosition: getFocusPosition(item.thumbnailFocus),
                    }}
                    className="
                      h-full w-full object-cover
                      transition-transform duration-300
                      group-hover:scale-105
                    "
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-[9px] text-slate-400">
                    이미지 준비 중
                  </div>
                )}
              </div>

              {/* 텍스트: 아래쪽으로 붙여서 카드 하단선 근처에 위치 */}
              <div className="px-3 pt-2 pb-3 mt-auto flex flex-col gap-0.5">
                <p className="line-clamp-2 text-[11px] md:text-[12px] font-semibold text-[#111827]">
                  {item.title}
                </p>
                {item.createdAt && (
                  <span className="text-[8px] text-slate-400">
                    {formatDate(item.createdAt)}
                  </span>
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
