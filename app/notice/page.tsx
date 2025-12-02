// app/notice/page.tsx
"use client"

import type React from "react"

import { useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"

import { SkipLink } from "@/components/skip-link"
import { Footer } from "@/components/footer"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { getCategoryLabel, getCategoryClass } from "@/lib/notice-category"

const Header = dynamic(
  () => import("@/components/header").then((m) => ({ default: m.Header })),
  { ssr: false },
)
const AdminWriteButton = dynamic(
  () => import("@/components/admin-write-button").then((m) => ({ default: m.AdminWriteButton })),
  { ssr: false },
)

type NoticeListItem = {
  key: string
  title: string
  category?: string
  createdAt?: string
  views?: number
  author?: string
}

type NoticesResponse = {
  ok: boolean
  page: number
  pageSize: number
  total: number
  rows: NoticeListItem[]
  error?: string
}

type SearchMode = "title" | "content" | "both"

function formatKST(input?: string): string {
  if (!input) return ""
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ""
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10)
}

// ---- 유틸: URLSearchParams -> SearchMode 파싱 (레거시 호환) ----
function parseScope(sp: URLSearchParams): SearchMode {
  const s = (sp.get("scope") || "").toLowerCase()
  if (s === "title" || s === "content" || s === "both") return s
  const legacyTitle = sp.get("title")
  const legacyContent = sp.get("content")
  if (legacyTitle === "1" && legacyContent === "0") return "title"
  if (legacyTitle === "0" && legacyContent === "1") return "content"
  return "both"
}

export default function NoticeListPage() {
  const router = useRouter()
  const searchParams = useSearchParams()

  // ---- URL에서 적용 중인 값들(applied*)을 파생 ----
  const appliedPage = useMemo(() => {
    const p = searchParams.get("page")
    const n = p ? Number.parseInt(p, 10) : 1
    return Number.isNaN(n) || n < 1 ? 1 : n
  }, [searchParams])

  const appliedQ = useMemo(() => (searchParams.get("q") || "").toString(), [searchParams])
  const appliedScope = useMemo(() => parseScope(searchParams), [searchParams])

  // ---- 입력 전용 로컬 상태(qLocal/scopeLocal). URL 변경 시 동기화 ----
  const [qLocal, setQLocal] = useState(appliedQ)
  const [scopeLocal, setScopeLocal] = useState<SearchMode>(appliedScope)

  useEffect(() => {
    setQLocal(appliedQ)
    setScopeLocal(appliedScope)
  }, [appliedQ, appliedScope])

  // ---- 목록 상태 ----
  const [page, setPage] = useState(appliedPage) // 내부 페이지 상태
  const [pageSize] = useState(10)
  const [total, setTotal] = useState(0)
  const [rows, setRows] = useState<NoticeListItem[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // URL의 page가 바뀌면 내부 page도 맞춤(뒤로/앞으로 대응)
  useEffect(() => {
    setPage(appliedPage)
  }, [appliedPage])

  // ---- 서버에서 목록 로드: "적용된" 값들(appliedQ/appliedScope/page)에만 반응 ----
  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError("")

        const sp = new URLSearchParams()
        sp.set("page", String(page))
        sp.set("pageSize", String(pageSize))

        const q = appliedQ.trim()
        if (q) sp.set("q", q)

        if (appliedScope === "title") {
          sp.set("scope", "title")
          sp.set("title", "1")
          sp.set("content", "0")
        } else if (appliedScope === "content") {
          sp.set("scope", "content")
          sp.set("title", "0")
          sp.set("content", "1")
        } else {
          sp.set("scope", "both")
          // both일 때는 레거시 title/content 생략 가능 (서버에서 both로 처리)
        }

        const res = await fetch(`/api/notices?${sp.toString()}`, { cache: "no-store" })
        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error("[NoticeList] /api/notices 응답 오류", res.status, text.slice(0, 300))
          throw new Error("공지 목록을 불러오지 못했습니다.")
        }

        const ct = res.headers.get("content-type") || ""
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "")
          console.error("[NoticeList] /api/notices 응답이 JSON 아님", ct, text.slice(0, 300))
          throw new Error("공지 목록을 불러오지 못했습니다.")
        }

        const data = (await res.json()) as NoticesResponse
        if (!data || data.ok !== true || !Array.isArray(data.rows)) {
          console.error("[NoticeList] /api/notices 형식 오류", data)
          throw new Error("공지 목록 데이터를 불러오지 못했습니다.")
        }

        if (cancelled) return
        setRows(data.rows)
        setTotal(data.total ?? 0)
      } catch (err: any) {
        if (cancelled) return
        console.error("[NoticeList] 목록 로드 실패", err)
        setError(err?.message || "공지 목록을 불러오지 못했습니다.")
        setRows([])
        setTotal(0)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [page, pageSize, appliedQ, appliedScope])

  // ---- URL 동기화: 페이지 이동 시에만 URL 갱신 (scroll:false) ----
  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("page", String(page))

    // 현재 적용된 검색 파라미터 보존
    if (appliedQ.trim()) params.set("q", appliedQ.trim())
    else params.delete("q")

    params.set("scope", appliedScope)
    if (appliedScope === "title") {
      params.set("title", "1")
      params.set("content", "0")
    } else if (appliedScope === "content") {
      params.set("title", "0")
      params.set("content", "1")
    } else {
      params.delete("title")
      params.delete("content")
    }

    const next = `/notice?${params.toString()}`
    const current = `/notice?${searchParams.toString()}`
    if (next !== current) {
      router.replace(next, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]) // 페이지 바뀔 때만

  // ---- 검색 제출(엔터/버튼) 시에만 URL 갱신 + page=1 ----
  function submitSearch(nextQ: string, nextScope: SearchMode) {
    const params = new URLSearchParams(searchParams.toString())
    if (nextQ.trim()) params.set("q", nextQ.trim())
    else params.delete("q")

    params.set("scope", nextScope)
    if (nextScope === "title") {
      params.set("title", "1")
      params.set("content", "0")
    } else if (nextScope === "content") {
      params.set("title", "0")
      params.set("content", "1")
    } else {
      params.delete("title")
      params.delete("content")
    }

    params.set("page", "1")
    router.replace(`/notice?${params.toString()}`, { scroll: false })
  }

  const totalPages = Math.max(1, Math.ceil((total || 0) / pageSize))

  const goPage = (next: number) => {
    if (next < 1 || next > totalPages) return
    setPage(next)
  }

  const handleRowClick = (key: string) => {
    const encodedKey = encodeURIComponent(key)
    router.push(`/notice/view?key=${encodedKey}`)
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    submitSearch(qLocal, scopeLocal)
  }

  // ---- 페이지네이션: 최대 7개 버튼만 윈도우로 노출 ----
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

  return (
    <>
      <SkipLink />
      <Header />

      {/* 공유 히어로: 상단 섹션 */}
      <SectionHero sectionKey="community" title="공지사항" />

      <BreadcrumbBar
        topLabel="커뮤니티"
        topHref="/notice"
        currentLabel="공지사항"
        siblingsOfTop={[{ label: "커뮤니티", href: "/notice" }]}
        siblingsOfCurrent={[
          { label: "공지사항", href: "/notice" },
          { label: "갤러리", href: "/gallery" },
          { label: "후원안내", href: "/donation" },
        ]}
      />

      <main id="main-content" className="min-h-screen bg-white">
        <div className="max-w-5xl mx-auto px-4 pb-16">
          {/* 제목 + 공지 작성 버튼 (우상단) */}
          <div className="mt-10 mb-4 flex items-center justify-between">
            <div className="flex justify-center w-full md:w-auto">
              <h1 className="relative inline-block text-2xl font-bold text-[#222] leading-tight">
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -left-3 w-2 h-2 rounded-full bg-[#1F3AA7]"
                />
                공지사항
              </h1>
            </div>
            <div className="hidden md:block">
              <AdminWriteButton href="/notice/new" label="공지 작성" />
            </div>
          </div>

          {/* 모바일에서도 우상단으로 보이도록 별도 처리 */}
          <div className="mb-2 flex justify-end md:hidden">
            <AdminWriteButton href="/notice/new" label="공지 작성" />
          </div>

          {/* 공지 목록 */}
          {loading && (
            <div className="py-10 text-center text-sm text-slate-500">
              공지 목록을 불러오는 중입니다...
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
              등록된 공지가 없습니다.
            </div>
          )}

          {!loading && !error && rows.length > 0 && (
            <>
              <div className="mt-2 overflow-x-auto">
                <table className="w-full border-t border-[#1F3AA7] text-[12px]">
                  <thead>
                    <tr className="text-[#666]" style={{ backgroundColor: "#fafbff" }}>
                      <th className="w-[70px] py-3 text-center font-semibold border-b border-[#e5e5e5]">
                        No
                      </th>
                      <th className="py-3 text-left font-semibold border-b border-[#e5e5e5]">
                        제목
                      </th>
                      <th className="w-[90px] py-3 text-center font-semibold border-b border-[#e5e5e5]">
                        작성자
                      </th>
                      <th className="w-[110px] py-3 text-center font-semibold border-b border-[#e5e5e5]">
                        등록일
                      </th>
                      <th className="w-[70px] py-3 text-center font-semibold border-b border-[#e5e5e5]">
                        조회수
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((item, index) => {
                      const displayIndex = total - ((appliedPage - 1) * pageSize + index)
                      return (
                        <tr
                          key={item.key}
                          className="cursor-pointer border-b border-[#f0f0f0] hover:bg-[#f6f8ff] transition-colors"
                          onClick={() => handleRowClick(item.key)}
                        >
                          <td className="py-3 text-center text-[#666]">
                            {displayIndex > 0 ? displayIndex : "-"}
                          </td>
                          <td className="py-3">
                            <div className="flex items-center gap-2">
                              <span className={getCategoryClass(item.category)}>
                                {getCategoryLabel(item.category)}
                              </span>
                              <span className="line-clamp-1 text-[13px] md:text-[15px] text-[#333]">
                                {item.title}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 text-center text-[#666]">
                            {item.author || "관리자"}
                          </td>
                          <td className="py-3 text-center text-[#666]">
                            {formatKST(item.createdAt)}
                          </td>
                          <td className="py-3 text-center text-[#666]">
                            {item.views ?? 0}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* 검색 영역: 목록 우측 하단 - 입력은 로컬 상태, 제출 시에만 URL 갱신 */}
              <form
                onSubmit={handleSearchSubmit}
                className="mt-6 flex items-center justify-end gap-2 text-[11px]"
              >
                <select
                  value={scopeLocal}
                  onChange={(e) => setScopeLocal(e.target.value as SearchMode)}
                  className="h-8 w-28 border border-[#d9d9d9] px-2 bg-white text-[11px] focus:outline-none focus:border-[#4B6AD0]"
                >
                  <option value="title">제목</option>
                  <option value="content">내용</option>
                  <option value="both">제목+내용</option>
                </select>
                <input
                  type="text"
                  value={qLocal}
                  onChange={(e) => setQLocal(e.target.value)}
                  className="h-8 w-48 border border-[#d9d9d9] px-2 text-[11px] focus:outline-none focus:border-[#4B6AD0]"
                  placeholder="검색어를 입력하세요"
                />
                <button
                  type="submit"
                  className="h-8 px-5 rounded-sm bg-[#4B6AD0] text-[11px] text-white"
                >
                  검색
                </button>
              </form>
            </>
          )}

          {/* 페이지네이션 */}
          {!loading && totalPages > 1 && (() => {
            const blockSize = 7
            const currentBlock = Math.floor((page - 1) / blockSize)
            const blockStart = currentBlock * blockSize + 1
            const blockEnd = Math.min(blockStart + blockSize - 1, totalPages)
            const hasPrevBlock = blockStart > 1
            const hasNextBlock = blockEnd < totalPages
            const prevBlockStart = hasPrevBlock ? blockStart - blockSize : blockStart
            const nextBlockStart = hasNextBlock ? blockStart + blockSize : blockStart

            return (
              <div className="mt-6 flex items-center justify-center gap-1 text-[11px]">
                {/* 맨 앞으로 */}
                <button
                  type="button"
                  onClick={() => goPage(1)}
                  disabled={page === 1}
                  className="min-w-7 h-7 border border-[#d9d9d9] text-[#666] disabled:cursor-default disabled:opacity-40 hover:bg-[#f6f8ff] transition"
                >
                  {"<<"}
                </button>

                {/* 이전 블록의 첫 페이지로 */}
                <button
                  type="button"
                  onClick={() => goPage(prevBlockStart)}
                  disabled={!hasPrevBlock}
                  className="min-w-7 h-7 border border-[#d9d9d9] text-[#666] disabled:cursor-default disabled:opacity-40 hover:bg-[#f6f8ff] transition"
                >
                  {"<"}
                </button>

                {/* 현재 블록(최대 7개) */}
                {Array.from({ length: blockEnd - blockStart + 1 }).map((_, i) => {
                  const p = blockStart + i
                  const active = p === page
                  return (
                    <button
                      key={p}
                      type="button"
                      onClick={() => goPage(p)}
                      className={`min-w-7 h-7 border text-[11px] ${
                        active
                          ? "bg-[#1F3AA7] border-[#1F3AA7] text-white"
                          : "border-[#d9d9d9] text-[#666] hover:bg-[#f6f8ff]"
                      }`}
                    >
                      {p}
                    </button>
                  )
                })}

                {/* 다음 블록의 첫 페이지로 */}
                <button
                  type="button"
                  onClick={() => goPage(nextBlockStart)}
                  disabled={!hasNextBlock}
                  className="min-w-7 h-7 border border-[#d9d9d9] text-[#666] disabled:cursor-default disabled:opacity-40 hover:bg-[#f6f8ff] transition"
                >
                  {">"}
                </button>

                {/* 맨 끝으로 */}
                <button
                  type="button"
                  onClick={() => goPage(totalPages)}
                  disabled={page === totalPages}
                  className="min-w-7 h-7 border border-[#d9d9d9] text-[#666] disabled:cursor-default disabled:opacity-40 hover:bg-[#f6f8ff] transition"
                >
                  {">>"}
                </button>
              </div>
            )
          })()}
        </div>
      </main>

      <Footer />
    </>
  )
}
