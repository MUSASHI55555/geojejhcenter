// app/gallery/view/page.tsx

"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"

import { SkipLink } from "@/components/skip-link"
import { Footer } from "@/components/footer"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import type { GalleryItem } from "@/lib/gallery-types"
import { IncrementView } from "./IncrementView"

const Header = dynamic(
  () => import("@/components/header").then((m) => ({ default: m.Header })),
  { ssr: false },
)

type GalleryDetailResponse = {
  ok: boolean
  item?: GalleryItem
  error?: string
}

function formatKST(input?: string): string {
  if (!input) return ""
  const d = new Date(input)
  if (Number.isNaN(d.getTime())) return ""
  const kst = new Date(d.getTime() + 9 * 60 * 60 * 1000)
  return kst.toISOString().slice(0, 10).replace(/-/g, ". ")
}

export default function GalleryViewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawKey = searchParams.get("key") || ""

  const [item, setItem] = useState<GalleryItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    if (!rawKey) {
      setError("유효하지 않은 갤러리 키입니다.")
      setLoading(false)
      return
    }

    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError("")

        // rawKey는 그대로 전달, decode/검증은 API에서 수행
        const res = await fetch(`/api/gallery/detail?key=${rawKey}`, {
          cache: "no-store",
        })

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error(
            "[GalleryView] /api/gallery/detail error",
            res.status,
            text.slice(0, 300),
          )
          throw new Error("갤러리를 불러오지 못했습니다.")
        }

        const data = (await res.json()) as GalleryDetailResponse
        if (!data || data.ok !== true || !data.item) {
          console.error(
            "[GalleryView] /api/gallery/detail format error",
            data,
          )
          throw new Error("갤러리 데이터를 불러오지 못했습니다.")
        }

        if (cancelled) return
        setItem(data.item)
      } catch (err: any) {
        if (cancelled) return
        console.error("[GalleryView] load failed", err)
        setError(err?.message || "갤러리를 불러오지 못했습니다.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [rawKey])

  let decodedKey = ""
  try {
    decodedKey = rawKey ? decodeURIComponent(rawKey).trim() : ""
  } catch {
    decodedKey = ""
  }

  const viewsValue =
    item?.viewCount ??
    (item as any)?.views ??
    0

  const showEditDelete = !!item && !!decodedKey

  const handleEdit = () => {
    if (!decodedKey || !item) {
      alert("유효하지 않은 갤러리입니다.")
      return
    }
    const encoded = encodeURIComponent(decodedKey)
    router.push(`/gallery/edit?key=${encoded}`)
  }

  const handleDelete = async () => {
    if (!decodedKey || !item) {
      alert("유효하지 않은 갤러리입니다.")
      return
    }

    const ok = window.confirm("해당 갤러리를 삭제하시겠습니까?")
    if (!ok) return

    try {
      const res = await fetch("/api/gallery/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ key: decodedKey }),
      })

      const data: any = await res.json().catch(() => null)

      if (!res.ok || !data?.ok) {
        console.error("[GalleryView] 삭제 실패", res.status, data)
        alert(data?.error || "삭제 중 문제가 발생했습니다.")
        return
      }

      router.push("/gallery")
    } catch (e) {
      console.error("[GalleryView] 삭제 요청 에러", e)
      alert("삭제 처리 중 오류가 발생했습니다.")
    }
  }

  if (loading) {
    return (
      <>
        <SkipLink />
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#F7F7F9]">
          <div className="text-center text-sm text-slate-500">
            갤러리를 불러오는 중입니다...
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error || !item) {
    return (
      <>
        <SkipLink />
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#F7F7F9]">
          <div className="text-center">
            <p className="mb-3 text-base text-red-500">
              {error || "갤러리를 찾을 수 없습니다."}
            </p>
            <Link
              href="/gallery"
              className="inline-block px-4 py-2 rounded-lg bg-[#1F3AA7] text-white text-sm hover:bg-[#182e82] transition"
            >
              목록으로 돌아가기
            </Link>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <SkipLink />
      <Header />

      {/* 공유 히어로: 상단 라벨 커뮤니티, 제목 갤러리 */}
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

      <main id="main-content" className="min-h-screen bg-[#F7F7F9]">
        <section className="max-w-4xl mx-auto px-4 pb-16 pt-10">
          <article className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm">
            {/* Header */}
            <header className="mb-6 pb-6 border-b border-neutral-200">
              <div className="flex items-center gap-2 mb-3">
                {item.category && (
                  <span className="inline-block px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-medium">
                    {item.category}
                  </span>
                )}
              </div>
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4">
                {item.title}
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-xs md:text-sm text-neutral-600">
                <span>{item.author || "관리자"}</span>
                {item.createdAt && (
                  <>
                    <span className="text-neutral-300">|</span>
                    <span>{formatKST(item.createdAt)}</span>
                  </>
                )}
                <span className="text-neutral-300">|</span>
                <span>조회 {viewsValue}</span>
              </div>
            </header>

            {/* Images: 상세 상단에 먼저 배치 */}
            {item.images && item.images.length > 0 && (
              <div className="mb-8 space-y-4">
                {item.images.map((img, index) => (
                  <div
                    key={`${img.url}-${index}`}
                    className="rounded-xl overflow-hidden border border-neutral-200 bg-neutral-50"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={img.url || "/placeholder.svg"}
                      alt={img.alt || `${item.title} - 이미지 ${index + 1}`}
                      className="w-full h-auto"
                      loading={index === 0 ? "eager" : "lazy"}
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Description: 이미지를 본 뒤 읽도록 하단에 배치 */}
            {item.description && (
              <div className="text-neutral-700 leading-relaxed whitespace-pre-wrap text-sm md:text-[15px]">
                {item.description}
              </div>
            )}

            {/* Footer: 목록 / 수정 / 삭제 */}
            <div className="mt-8 pt-6 border-t border-neutral-200 flex items-center justify-between gap-3 text-xs">
              <Link
                href="/gallery"
                className="inline-flex items-center px-4 py-2 rounded-full border border-neutral-300 text-neutral-700 hover:bg-neutral-50 transition"
              >
                목록으로
              </Link>

              {showEditDelete && (
                <div className="flex items-center gap-2">
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

            {/* 조회수 증가 트리거 */}
            {decodedKey && (
              <IncrementView
                blobKey={decodedKey}
                url={
                  typeof window !== "undefined"
                    ? window.location.pathname + window.location.search
                    : `/gallery/view?key=${rawKey}`
                }
                onUpdated={(v) => {
                  setItem((prev) =>
                    prev
                      ? {
                          ...prev,
                          viewCount: v,
                          ...(typeof (prev as any).views === "number"
                            ? { ...(prev as any), views: v }
                            : {}),
                        }
                      : prev,
                  )
                }}
              />
            )}
          </article>
        </section>
      </main>

      <Footer />
    </>
  )
}
