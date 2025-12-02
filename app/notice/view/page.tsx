"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"

import { SkipLink } from "@/components/skip-link"
import { Footer } from "@/components/footer"
import { IncrementView } from "@/app/notice/view/IncrementView"
import type { Notice as NoticeType } from "@/lib/notices-types"
import { getCategoryLabel, getCategoryClass } from "@/lib/notice-category"

const Header = dynamic(
  () => import("@/components/header").then((m) => ({ default: m.Header })),
  { ssr: false },
)

const SectionHero = dynamic(
  () =>
    import("@/components/section-hero").then((m) => ({
      default: m.SectionHero,
    })),
  { ssr: false },
)

const BreadcrumbBar = dynamic(
  () =>
    import("@/components/breadcrumb-bar").then((m) => ({
      default: m.BreadcrumbBar,
    })),
  { ssr: false },
)

type DetailResponse = {
  ok: boolean
  notice?: NoticeType
  error?: string
}

function formatKST(input?: string): string {
  if (!input) return ""
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ""
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10).replace(/-/g, ". ")
}

export default function NoticeViewPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawKey = searchParams.get("key") ?? ""

  const [notice, setNotice] = useState<NoticeType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")

  useEffect(() => {
    if (!rawKey) {
      setError("유효하지 않은 접근입니다. (key가 없습니다)")
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch(`/api/notices/detail?key=${rawKey}`, {
          method: "GET",
          cache: "no-store",
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error(
            "[NoticeView] /api/notices/detail 응답 오류",
            res.status,
            text.slice(0, 300),
          )
          throw new Error("공지 데이터를 불러오지 못했습니다.")
        }

        const contentType = res.headers.get("content-type") || ""
        if (!contentType.includes("application/json")) {
          const text = await res.text().catch(() => "")
          console.error(
            "[NoticeView] /api/notices/detail 응답이 JSON 아님",
            contentType,
            text.slice(0, 300),
          )
          throw new Error("공지 데이터를 불러오지 못했습니다.")
        }

        const data = (await res.json().catch((e: any) => {
          console.error(
            "[NoticeView] /api/notices/detail JSON 파싱 실패",
            e,
          )
          throw new Error("공지 데이터를 불러오지 못했습니다.")
        })) as DetailResponse

        if (!data || data.ok !== true || !data.notice) {
          console.error(
            "[NoticeView] /api/notices/detail 형식 오류",
            data,
          )
          throw new Error(
            data?.error || "공지 데이터를 불러오지 못했습니다.",
          )
        }

        if (cancelled) return

        setNotice(data.notice)
        setError("")
      } catch (e: any) {
        if (cancelled) return
        console.error("[NoticeView] 상세 로드 실패", e)
        setNotice(null)
        setError(e?.message || "공지 데이터를 불러오지 못했습니다.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [rawKey])

  const viewsValue = notice?.viewCount ?? notice?.views ?? 0

  let decodedKey = ""
  try {
    decodedKey = rawKey ? decodeURIComponent(rawKey) : ""
  } catch {
    decodedKey = ""
  }

  const showEditDelete = !!notice && !!decodedKey

  const handleEdit = () => {
    if (!decodedKey || !notice) {
      alert("유효하지 않은 공지입니다.")
      return
    }
    const encodedKey = encodeURIComponent(decodedKey)
    router.push(`/notice/edit?key=${encodedKey}`)
  }

  const handleDelete = async () => {
    if (!decodedKey || !notice) {
      alert("유효하지 않은 공지입니다.")
      return
    }

    const ok = window.confirm("해당 공지를 삭제하시겠습니까?")
    if (!ok) return

    try {
      const res = await fetch("/api/notices/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ key: decodedKey }),
      })

      const data: any = await res.json().catch(() => null)

      if (!res.ok || !data?.ok) {
        console.error("[NoticeView] 삭제 실패", res.status, data)
        alert(data?.error || "삭제 중 문제가 발생했습니다.")
        return
      }

      router.push("/notice")
    } catch (e) {
      console.error("[NoticeView] 삭제 요청 에러", e)
      alert("삭제 처리 중 오류가 발생했습니다.")
    }
  }

  const renderImages = () => {
    if (!notice || !Array.isArray(notice.images) || notice.images.length === 0) {
      return null
    }

    return (
      <div className="mb-6 grid gap-3 md:gap-4">
        {notice.images.map((img, idx) => (
          <div
            key={`${img.url}-${idx}`}
            className="w-full overflow-hidden rounded-xl bg-neutral-50 border border-neutral-100"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={img.url}
              alt={img.alt || `공지 이미지 ${idx + 1}`}
              className="w-full h-auto max-h-[420px] object-contain bg-neutral-50"
              loading={idx === 0 ? "eager" : "lazy"}
            />
          </div>
        ))}
      </div>
    )
  }

  return (
    <>
      <SkipLink />
      <Header />

      <SectionHero sectionKey="community" title="공지사항" />

      <BreadcrumbBar
        topLabel="커뮤니티"
        topHref="/notice"
        currentLabel="공지사항"
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

      <main id="main-content" className="min-h-screen bg-[#F7F7F9]">
        <section className="max-w-5xl mx-auto px-4 pb-16 pt-10">
          {loading && (
            <div className="py-16 text-center text-sm text-neutral-500">
              공지 내용을 불러오는 중입니다...
            </div>
          )}

          {!loading && error && (
            <div className="py-16 text-center">
              <p className="mb-3 text-base text-red-500">{error}</p>
              <p className="mb-6 text-sm text-neutral-500">
                문제가 지속될 경우 관리자에게 문의해 주세요.
              </p>
              <button
                type="button"
                onClick={() => router.push("/notice")}
                className="inline-flex items-center px-4 py-2 rounded-full border border-neutral-300 text-sm hover:bg-neutral-100 transition"
              >
                목록으로 돌아가기
              </button>
            </div>
          )}

          {!loading && !error && notice && (
            <article className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
              <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
                <span className={getCategoryClass(notice.category)}>
                  {getCategoryLabel(notice.category)}
                </span>
                {notice.createdAt && (
                  <>
                    <span className="h-3 w-px bg-neutral-300" />
                    <span>등록일 {formatKST(notice.createdAt)}</span>
                  </>
                )}
                {notice.updatedAt && (
                  <>
                    <span className="h-3 w-px bg-neutral-300" />
                    <span>수정 {formatKST(notice.updatedAt)}</span>
                  </>
                )}
                <span className="h-3 w-px bg-neutral-300" />
                <span>조회 {viewsValue}</span>
              </div>

              <h1 className="mb-6 text-xl md:text-2xl font-semibold text-neutral-900 leading-snug">
                {notice.title}
              </h1>

              {/* 본문 상단 이미지 (있으면 텍스트보다 먼저 렌더링) */}
              {renderImages()}

              {/* 내용 */}
              <div className="prose prose-neutral max-w-none text-sm md:text-[15px] leading-relaxed">
                {typeof notice.content === "string" &&
                /<\/?[a-z][\s\S]*>/i.test(notice.content) ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: notice.content,
                    }}
                  />
                ) : (
                  <p className="whitespace-pre-wrap">
                    {notice.content}
                  </p>
                )}
              </div>

              {/* 첨부파일 */}
              {Array.isArray((notice as any).attachments) &&
                (notice as any).attachments.length > 0 && (
                  <div className="mt-8 border-t border-neutral-100 pt-4">
                    <div className="mb-2 text-xs font-medium text-neutral-700">
                      첨부파일
                    </div>
                    <ul className="space-y-1 text-[11px] text-neutral-700">
                      {(notice as any).attachments.map(
                        (file: any, index: number) => (
                          <li
                            key={`${file.url}-${index}`}
                            className="flex items-center gap-2"
                          >
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="max-w-xs truncate text-[#1F3AA7] hover:underline"
                            >
                              {file.name || file.url}
                            </a>
                          </li>
                        ),
                      )}
                    </ul>
                  </div>
                )}

              {/* 하단 버튼들 */}
              <div className="mt-10 flex items-center justify-between gap-4 text-xs text-neutral-500">
                <Link
                  href="/notice"
                  className="inline-flex items-center px-3 py-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
                >
                  목록으로 돌아가기
                </Link>

                {showEditDelete && (
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={handleEdit}
                      className="px-3 py-1.5 rounded-full border border-[#1F3AA7] text-[#1F3AA7] hover:bg-[#EEF3FF] transition"
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={handleDelete}
                      className="px-3 py-1.5 rounded-full border border-red-400 text-red-500 hover:bg-red-50 transition"
                    >
                      삭제
                    </button>
                  </div>
                )}
              </div>

              {/* 조회수 증가 */}
              {decodedKey && notice && (
                <IncrementView
                  blobKey={decodedKey}
                  url={
                    typeof window !== "undefined"
                      ? window.location.pathname + window.location.search
                      : `/notice/view?key=${rawKey}`
                  }
                  onUpdated={(v) => {
                    setNotice((prev) =>
                      prev
                        ? {
                            ...prev,
                            viewCount: v,
                            views: v,
                          }
                        : prev,
                    )
                  }}
                />
              )}
            </article>
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
