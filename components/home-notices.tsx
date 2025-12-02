// components/home-notices.tsx
"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCategoryLabel, getCategoryClass } from "@/lib/notice-category"

type NoticeListItem = {
  key: string
  title: string
  category?: string
  createdAt?: string
  views?: number
}

type NoticesResponse = {
  ok: boolean
  page: number
  pageSize: number
  total: number
  rows: NoticeListItem[]
  error?: string
}

function formatKST(input?: string): string {
  if (!input) return ""
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ""
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10).replace(/-/g, ". ")
}

export function HomeNoticesBox() {
  const router = useRouter()

  const [rows, setRows] = useState<NoticeListItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch("/api/notices?page=1&pageSize=6", {
          cache: "no-store",
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error(
            "[HomeNotices] /api/notices 응답 오류",
            res.status,
            text.slice(0, 300),
          )
          throw new Error("공지 목록을 불러오지 못했습니다.")
        }

        const ct = res.headers.get("content-type") || ""
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "")
          console.error(
            "[HomeNotices] /api/notices 응답이 JSON 아님",
            ct,
            text.slice(0, 300),
          )
          throw new Error("공지 목록을 불러오지 못했습니다.")
        }

        const data = (await res.json()) as NoticesResponse

        if (!data || data.ok !== true || !Array.isArray(data.rows)) {
          console.error("[HomeNotices] /api/notices 형식 오류", data)
          throw new Error("공지 목록 데이터를 불러오지 못했습니다.")
        }

        if (cancelled) return
        setRows(data.rows.slice(0, 6))
      } catch (e: any) {
        if (cancelled) return
        console.error("[HomeNotices] 목록 로드 실패", e)
        setError(e?.message || "공지 목록을 불러오지 못했습니다.")
        setRows([])
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [])

  const handleClick = (key: string) => {
    const encodedKey = encodeURIComponent(key)
    router.push(`/notice/view?key=${encodedKey}`)
  }

  const goNoticeList = () => {
    router.push("/notice")
  }

  return (
    <div className="h-full w-full">
      <div
        className="
          flex h-full w-full flex-col
          rounded-3xl border border-slate-200 bg-white text-slate-900
          pt-5 pb-5 md:pt-6 md:pb-6
          shadow-[0_18px_45px_rgba(15,23,42,0.10)]
        "
      >
        {/* 헤더 + 구분선: 하나의 px-5 래퍼 안에서 정렬 */}
        <div className="px-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg md:text-xl font-semibold tracking-tight">
              공지사항
            </h2>
            <button
              type="button"
              onClick={goNoticeList}
              aria-label="공지사항 전체보기"
              className="
                flex h-7 w-7 items-center justify-center
                rounded-full border border-slate-200
                text-slate-500 hover:bg-slate-50 hover:text-slate-900
                transition-colors
              "
            >
              <span className="text-base leading-none">+</span>
            </button>
          </div>

          {/* 공지 텍스트 왼쪽 ~ + 버튼 오른쪽 끝에 딱 맞게 */}
          <hr className="mt-2 w-full border-t-2 border-[#1F3AA7] rounded-full" />
        </div>

        {/* 목록 */}
        <div className="mt-3 flex-1 px-5">
          {loading && (
            <div className="py-3 text-[10px] text-slate-500">
              공지 목록을 불러오는 중입니다...
            </div>
          )}

          {!loading && error && (
            <div className="py-3 text-[10px] text-red-500">{error}</div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="py-3 text-[10px] text-slate-500">
              등록된 공지가 없습니다.
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <ul className="space-y-1.5">
              {rows.map((item) => (
                <li key={item.key}>
                  <button
                    type="button"
                    onClick={() => handleClick(item.key)}
                    className="
                      flex w-full items-center gap-2
                      rounded-xl px-2 py-1.5
                      text-left text-slate-700
                      hover:bg-slate-50 hover:text-slate-900
                      transition-colors
                    "
                  >
                    <span className={getCategoryClass(item.category)}>
                      {getCategoryLabel(item.category)}
                    </span>
                    <span className="flex-1 line-clamp-1 text-[13px] md:text-[14px]">
                      {item.title}
                    </span>
                    <span className="shrink-0 text-[9px] text-slate-400">
                      {formatKST(item.createdAt)}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
