// app/gallery/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from "next/dynamic"

import { SkipLink } from "@/components/skip-link"
import { Footer } from "@/components/footer"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"

const Header = dynamic(
  () => import("@/components/header").then((m) => ({ default: m.Header })),
  { ssr: false },
)

const AdminWriteButton = dynamic(
  () => import("@/components/admin-write-button").then((m) => ({ default: m.AdminWriteButton })),
  { ssr: false },
)

const BRAND_BLUE = "#1F3AA7"

type GalleryListItem = {
  key: string
  title: string
  category?: string
  createdAt?: string
  thumbnailUrl?: string
  viewCount?: number
  thumbnailFocus?: "top" | "center" | "bottom"
}

type GalleryResponse = {
  ok: boolean
  page: number
  pageSize: number
  total: number
  rows: GalleryListItem[]
  error?: string
}

function formatKST(input?: string): string {
  if (!input) return ""
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ""
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
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

export default function GalleryListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  const initialPage = (() => {
    const p = searchParams.get("page")
    const n = p ? Number.parseInt(p, 10) : 1
    return Number.isNaN(n) || n < 1 ? 1 : n
  })()

  const [page, setPage] = useState(initialPage)
  const [pageSize] = useState(9)
  const [total, setTotal] = useState(0)
  const [rows, setRows] = useState<GalleryListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    let cancelled = false

    async function load(pageToLoad: number) {
      try {
        setLoading(true)
        setError("")

        const sp = new URLSearchParams()
        sp.set("page", String(pageToLoad))
        sp.set("pageSize", String(pageSize))

        const res = await fetch(`/api/gallery?${sp.toString()}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error(
            "[GalleryList] /api/gallery response error",
            res.status,
            text.slice(0, 300),
          )
          throw new Error("갤러리 목록을 불러오지 못했습니다.")
        }

        const ct = res.headers.get("content-type") || ""
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "")
          console.error(
            "[GalleryList] /api/gallery response not JSON",
            ct,
            text.slice(0, 300),
          )
          throw new Error("갤러리 목록을 불러오지 못했습니다.")
        }

        const data = (await res.json()) as GalleryResponse
        if (!data || data.ok !== true || !Array.isArray(data.rows)) {
          console.error("[GalleryList] /api/gallery format error", data)
          throw new Error("갤러리 목록 데이터를 불러오지 못했습니다.")
        }

        if (cancelled) return
        setRows(data.rows)
        setTotal(data.total ?? 0)
      } catch (err: any) {
        if (cancelled) return
        console.error("[GalleryList] load failed", err)
        setError(err?.message || "갤러리 목록을 불러오지 못했습니다.")
        setRows([])
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load(page)
    return () => {
      cancelled = true
    }
  }, [page, pageSize])

  useEffect(() => {
    const sp = new URLSearchParams()
    sp.set("page", String(page))

    const next = `/gallery?${sp.toString()}`
    const current = `/gallery?${searchParams.toString()}`

    if (next !== current) {
      router.replace(next)
    }
  }, [page, router, searchParams])

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize))

  const maxPageButtons = 7
  const half = Math.floor(maxPageButtons / 2)

  let startPage = Math.max(1, page - half)
  let endPage = startPage + maxPageButtons - 1

  if (endPage > totalPages) {
    endPage = totalPages
    startPage = Math.max(1, endPage - maxPageButtons + 1)
  }

  const pageNumbers: number[] = []
  for (let p = startPage; p <= endPage; p += 1) {
    pageNumbers.push(p)
  }

  const goPage = (next: number) => {
    if (next < 1 || next > totalPages) return
    setPage(next)
  }

  const goNextBlock = () => {
    // Jump to the first page of the next block, not just +1
    // If current block shows pages [1,2,3,4,5,6,7], next block starts at 8
    const nextBlockStart = endPage + 1
    if (nextBlockStart <= totalPages) {
      setPage(nextBlockStart)
    }
  }

  const goPrevBlock = () => {
    // Jump to the first page of the previous block
    const prevBlockStart = startPage - maxPageButtons
    if (prevBlockStart >= 1) {
      setPage(prevBlockStart)
    } else {
      setPage(1)
    }
  }

  const handleCardClick = (key: string) => {
    const encodedKey = encodeURIComponent(key)
    router.push(`/gallery/view?key=${encodedKey}`)
  }

  return (
    <>
      <SkipLink />
      <Header />

      <SectionHero sectionKey="community" title="갤러리" />

      <BreadcrumbBar
        topLabel="커뮤니티"
        topHref="/notice"
        currentLabel="갤러리"
        siblingsOfTop={[
          { label: "공지사항", href: "/notice" },
          { label: "갤러리", href: "/gallery" },
          { label: "후원안내", href: "/donation" },
        ]}
        siblingsOfCurrent={[
          { label: "공지사항", href: "/notice" },
          { label: "갤러리", href: "/gallery" },
          { label: "후원안내", href: "/donation" },
        ]}
      />

      <main id="main-content" className="min-h-screen bg-white">
        <div className="max-w-6xl mx-auto px-4 pb-16">
          {/* 제목 + 갤러리 작성 버튼 (공지 페이지와 동일 패턴) */}
          <div className="mt-10 mb-4 flex items-center justify-between">
            {/* 가운데 정렬되는 제목 */}
            <div className="flex justify-center w-full md:w-auto">
              <h1 className="relative inline-block text-2xl font-bold text-[#222] leading-tight">
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -left-3 w-2 h-2 rounded-full"
                  style={{ backgroundColor: BRAND_BLUE }}
                />
                갤러리
              </h1>
            </div>

            {/* 데스크탑에서만 보이는 작성 버튼 */}
            <div className="hidden md:block">
              <AdminWriteButton href="/gallery/new" label="갤러리 작성" />
            </div>
          </div>

          {/* 모바일에서 우측에 붙는 작성 버튼 */}
          <div className="mb-2 flex justify-end md:hidden">
            <AdminWriteButton href="/gallery/new" label="갤러리 작성" />
          </div>

          <div
            className="h-[3px] w-full mb-6"
            style={{
              background:
                "linear-gradient(to right, rgba(31,58,167,0.9) 0%, rgba(31,58,167,0.4) 40%, rgba(31,58,167,0.08) 75%, transparent 100%)",
            }}
          />

          {loading && (
            <div className="py-10 text-center text-sm text-slate-500">
              갤러리 목록을 불러오는 중입니다...
            </div>
          )}

          {!loading && error && (
            <div className="py-10 text-center">
              <p className="mb-3 text-base text-red-500">{error}</p>
              <p className="mb-6 text-sm text-slate-500">
                잠시 후 다시 시도하시거나, 문제가 계속되면 관리자에게 문의해 주세요.
              </p>
            </div>
          )}

          {!loading && !error && rows.length === 0 && (
            <div className="py-10 text-center text-sm text-slate-500">
              등록된 갤러리가 없습니다.
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {rows.map((item) => (
                <div
                  key={item.key}
                  className="group cursor-pointer bg-white border border-neutral-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                  onClick={() => handleCardClick(item.key)}
                >
                  <div className="aspect-[4/3] bg-neutral-100 relative overflow-hidden">
                    {item.thumbnailUrl ? (
                      <img
                        src={item.thumbnailUrl || "/placeholder.svg"}
                        alt={item.title}
                        style={{
                          objectPosition: getFocusPosition(item.thumbnailFocus),
                        }}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-neutral-400">
                        <svg
                          className="w-12 h-12"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1.5}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2 1.586-1.586a2 2 0 012.828 0L20 14M14 8h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      {item.category && (
                        <span className="inline-block px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[10px] font-medium">
                          {item.category}
                        </span>
                      )}
                      <span className="text-[11px] text-neutral-500">
                        {formatKST(item.createdAt)}
                      </span>
                    </div>
                    <h3 className="text-sm font-semibold text-neutral-800 line-clamp-2 group-hover:text-[#1F3AA7] transition-colors">
                      {item.title}
                    </h3>
                    <div className="mt-2 flex items-center gap-1 text-[11px] text-neutral-500">
                      <svg
                        className="w-3.5 h-3.5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                      <span>{item.viewCount ?? 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && totalPages > 1 && (
            <div className="mt-8 flex items-center justify-center gap-1 text-[11px]">
              <button
                type="button"
                onClick={() => goPage(1)}
                disabled={page <= 1}
                className="min-w-7 h-7 border border-[#d9d9d9] text-[#666] disabled:cursor-default disabled:opacity-40 hover:bg-[#f6f8ff] transition"
                aria-label="첫 페이지"
              >
                &lt;&lt;
              </button>
              <button
                type="button"
                onClick={goPrevBlock}
                disabled={page <= 1}
                className="min-w-7 h-7 border border-[#d9d9d9] text-[#666] disabled:cursor-default disabled:opacity-40 hover:bg-[#f6f8ff] transition"
                aria-label="이전 블록"
              >
                &lt;
              </button>
              {pageNumbers.map((p) => {
                const active = p === page
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => goPage(p)}
                    className={`min-w-7 h-7 border text-[11px] ${
                      active
                        ? "text-white"
                        : "border-[#d9d9d9] text-[#666] hover:bg-[#f6f8ff]"
                    }`}
                    style={
                      active
                        ? {
                            backgroundColor: BRAND_BLUE,
                            borderColor: BRAND_BLUE,
                          }
                        : undefined
                    }
                    aria-label={`${p}페이지`}
                    aria-current={active ? "page" : undefined}
                  >
                    {p}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={goNextBlock}
                disabled={page >= totalPages}
                className="min-w-7 h-7 border border-[#d9d9d9] text-[#666] disabled:cursor-default disabled:opacity-40 hover:bg-[#f6f8ff] transition"
                aria-label="다음 블록"
              >
                &gt;
              </button>
              <button
                type="button"
                onClick={() => goPage(totalPages)}
                disabled={page >= totalPages}
                className="min-w-7 h-7 border border-[#d9d9d9] text-[#666] disabled:cursor-default disabled:opacity-40 hover:bg-[#f6f8ff] transition"
                aria-label="마지막 페이지"
              >
                &gt;&gt;
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  )
}
