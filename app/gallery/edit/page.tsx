// app/gallery/edit/page.tsx
"use client"

// ========================
// 갤러리 수정 페이지 (작성일 변경 + 대표 이미지 선택 포함 버전)
// ========================

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from 'next/navigation'
import dynamic from "next/dynamic"
import Link from "next/link"

import { SkipLink } from "@/components/skip-link"
import { Footer } from "@/components/footer"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import type { GalleryItem, GalleryImage, ThumbnailFocus } from "@/lib/gallery-types"

const Header = dynamic(
  () => import("@/components/header").then((m) => ({ default: m.Header })),
  { ssr: false },
)

// == API Types ==
type DetailResponse = {
  ok: boolean
  item?: GalleryItem
  error?: string
}

type UpdateResponse = {
  ok: boolean
  error?: string
}


function toISOFromLocalDate(dateStr: string): string | null {
  if (!dateStr) return null
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const y = Number(m[1])
  const mo = Number(m[2]) - 1 // 0-based
  const d = Number(m[3])
  const dt = new Date(y, mo, d, 0, 0, 0, 0) // 로컬 자정
  if (isNaN(dt.getTime())) return null
  return dt.toISOString()
}

// ISO 문자열 -> yyyy-MM-dd (로컬 기준)
// (서버에 저장된 ISO를 폼에 보이기 위해 사용)
function toLocalDateInputValue(iso?: string): string {
  if (!iso) return ""
  const dt = new Date(iso)
  if (isNaN(dt.getTime())) return ""
  const yyyy = dt.getFullYear()
  const mm = String(dt.getMonth() + 1).padStart(2, "0")
  const dd = String(dt.getDate()).padStart(2, "0")
  return `${yyyy}-${mm}-${dd}`
}

export default function GalleryEditPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawKey = searchParams.get("key") || ""

  // 상태
  const [blobKey, setBlobKey] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState("")

  const [title, setTitle] = useState("")
  const [category, setCategory] = useState("")
  const [description, setDescription] = useState("")
  const [images, setImages] = useState<GalleryImage[]>([])

  // [작성일 입력 상태]  // [anchor:createdAt-input]
  const [createdAtInput, setCreatedAtInput] = useState("")

  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null)
  const [thumbnailFocus, setThumbnailFocus] = useState<ThumbnailFocus>("center")

  useEffect(() => {
    if (!rawKey) {
      setError("유효하지 않은 접근입니다. (key가 없습니다)")
      setLoading(false)
      return
    }

    let decoded = ""
    try {
      decoded = decodeURIComponent(rawKey).trim()
    } catch {
      setError("유효하지 않은 key 형식입니다.")
      setLoading(false)
      return
    }

    if (!decoded.startsWith("galleries/") || !decoded.endsWith(".json")) {
      setError("유효하지 않은 key 형식입니다.")
      setLoading(false)
      return
    }

    setBlobKey(decoded)

    let cancelled = false

    async function load() {
      try {
        setLoading(true)
        setError("")

        const res = await fetch(
          `/api/gallery/detail?key=${encodeURIComponent(decoded)}`,
          { cache: "no-store" },
        )

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error("[GalleryEdit] /api/gallery/detail error", res.status, text.slice(0, 300))
          throw new Error("갤러리 데이터를 불러오지 못했습니다.")
        }

        const data = (await res.json()) as DetailResponse
        if (!data.ok || !data.item) {
          console.error("[GalleryEdit] /api/gallery/detail format error", data)
          throw new Error(data.error || "갤러리 데이터를 불러오지 못했습니다.")
        }

        if (cancelled) return

        const item = data.item
        setTitle(item.title || "")
        setCategory(item.category || "")
        setDescription(item.description || "")
        setImages(Array.isArray(item.images) ? item.images : [])

        // 서버 저장 ISO -> yyyy-MM-dd로 폼 초기화
        setCreatedAtInput(toLocalDateInputValue(item.createdAt))

        if (item.thumbnail && typeof item.thumbnail.imageIndex === "number") {
          setThumbnailIndex(item.thumbnail.imageIndex)
          setThumbnailFocus(item.thumbnail.focus || "center")
        } else if (item.images && item.images.length > 0) {
          // Default to first image if no thumbnail set
          setThumbnailIndex(0)
          setThumbnailFocus("center")
        }
      } catch (e: any) {
        if (cancelled) return
        console.error("[GalleryEdit] load failed", e)
        setError(e?.message || "갤러리 데이터를 불러오지 못했습니다.")
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    load()

    return () => {
      cancelled = true
    }
  }, [rawKey])

  const handleSave = async () => {
    if (!blobKey) {
      alert("유효하지 않은 갤러리입니다.")
      return
    }
    if (!title.trim()) {
      alert("제목을 입력해 주세요.")
      return
    }
    if (!images || images.length === 0) {
      alert("최소 1개의 이미지를 등록해 주세요.")
      return
    }

    try {
      setSaving(true)
      setError("")

      // [작성일 직교차 처리]  // [anchor:createdAt-serialize]
      const createdAtISO = createdAtInput ? toISOFromLocalDate(createdAtInput) : null
      if (createdAtInput && !createdAtISO) {
        alert("작성일 형식이 올바르지 않습니다. 예: 2025-11-12")
        setSaving(false)
        return
      }

      const payload: any = {
        key: blobKey,
        title: title.trim(),
        category: category.trim() || undefined,
        description,
        images,
      }
      if (createdAtISO) {
        payload.createdAt = createdAtISO
      }

      if (thumbnailIndex !== null && thumbnailIndex >= 0 && thumbnailIndex < images.length) {
        payload.thumbnail = {
          imageIndex: thumbnailIndex,
          focus: thumbnailFocus,
        }
      }

      const res = await fetch("/api/gallery/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data: UpdateResponse = await res.json().catch(() => ({ ok: false, error: "응답 파싱 오류" }))

      if (!res.ok || !data.ok) {
        console.error("[GalleryEdit] PUT 실패", res.status, data)
        alert(data.error || "갤러리 저장 중 오류가 발생했습니다.")
        return
      }

      const encoded = encodeURIComponent(blobKey)
      router.push(`/gallery/view?key=${encoded}`)
    } catch (e) {
      console.error("[GalleryEdit] 저장 요청 에러", e)
      alert("갤러리 저장 중 오류가 발생했습니다.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <>
        <SkipLink />
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#F7F7F9]">
          <div className="text-sm text-neutral-500">갤러리 정보를 불러오는 중입니다...</div>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <SkipLink />
        <Header />
        <main className="min-h-screen flex items-center justify-center bg-[#F7F7F9]">
          <div className="text-center">
            <p className="mb-3 text-base text-red-500">{error}</p>
            <button
              type="button"
              onClick={() => router.push("/gallery")}
              className="inline-flex items-center px-4 py-2 rounded-full border border-neutral-300 text-sm hover:bg-neutral-100 transition"
            >
              목록으로 돌아가기
            </button>
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

      <SectionHero sectionKey="community" title="갤러리 수정" />

      <BreadcrumbBar
        topLabel="커뮤니티"
        topHref="/notice"
        currentLabel="갤러리 수정"
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
          <article className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs text-neutral-600">이미지 목록</label>
                <span className="text-[10px] text-neutral-400">
                  대표 이미지를 선택하고 필요 시 이미지를 삭제한 뒤 &quot;저장하기&quot;를 누르면 반영됩니다.
                </span>
              </div>

              {(!images || images.length === 0) && (
                <p className="text-[11px] text-neutral-400">
                  등록된 이미지가 없습니다. 새 갤러리는 등록 페이지에서 이미지를 함께 업로드해 주세요.
                </p>
              )}

              {images && images.length > 0 && (
                <div className="mt-3 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img, idx) => (
                      <div
                        key={`${img.url}-${idx}`}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-neutral-200 group"
                        style={{
                          borderColor: thumbnailIndex === idx ? "#1F3AA7" : undefined,
                        }}
                      >
                        {/* 썸네일 */}
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={img.alt || `이미지 ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* 대표 이미지 뱃지 */}
                        {thumbnailIndex === idx && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#1F3AA7] text-white text-[9px] font-semibold">
                            대표
                          </div>
                        )}
                        {/* 대표 선택 버튼 */}
                        <button
                          type="button"
                          onClick={() => setThumbnailIndex(idx)}
                          className="absolute inset-0 bg-black/0 hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100"
                          aria-label="대표 이미지로 선택"
                          title="대표 이미지로 선택"
                        >
                          <span className="px-2 py-1 rounded bg-white/90 text-[10px] font-medium">
                            대표로 지정
                          </span>
                        </button>
                        {/* 삭제 버튼 */}
                        <button
                          type="button"
                          onClick={() => {
                            setImages((prev) => {
                              const newImages = prev.filter((_, i) => i !== idx)
                              // Adjust thumbnailIndex after removal
                              if (thumbnailIndex === idx) {
                                setThumbnailIndex(newImages.length > 0 ? 0 : null)
                              } else if (thumbnailIndex !== null && thumbnailIndex > idx) {
                                setThumbnailIndex(thumbnailIndex - 1)
                              }
                              return newImages
                            })
                          }}
                          className="absolute top-2 right-2 w-6 h-6 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          aria-label="이미지 삭제"
                          title="이미지 삭제"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>

                  {thumbnailIndex !== null && (
                    <div className="flex items-center gap-3 pt-2">
                      <label className="text-xs text-neutral-600">대표 이미지 위치:</label>
                      <div className="flex items-center gap-2">
                        {[
                          { value: "top", label: "위쪽" },
                          { value: "center", label: "가운데" },
                          { value: "bottom", label: "아래쪽" },
                        ].map((option) => (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => setThumbnailFocus(option.value as ThumbnailFocus)}
                            className={`px-3 py-1 rounded-full text-[10px] font-medium transition ${
                              thumbnailFocus === option.value
                                ? "bg-[#1F3AA7] text-white"
                                : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                            }`}
                          >
                            {option.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 제목 */}
            <div>
              <label className="block mb-1 text-xs text-neutral-600">제목</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40"
                placeholder="갤러리 제목을 입력해 주세요."
              />
            </div>

            {/* 카테고리 (선택) */}
            <div>
              <label className="block mb-1 text-xs text-neutral-600">카테고리 (선택)</label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-56 px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40"
                placeholder="예: 행사, 교육, 현장스냅"
              />
            </div>

            {/* 설명 (선택) */}
            <div>
              <label className="block mb-1 text-xs text-neutral-600">설명 (선택)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[160px] px-3 py-2 rounded-lg border border-neutral-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40"
                placeholder="갤러리 설명을 입력해 주세요."
              />
            </div>

            {/* 작성일 (선택)  // [anchor:createdAt-field] */}
            <div>
              <label className="block mb-1 text-xs text-neutral-600">작성일 (선택)</label>
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={createdAtInput}
                  onChange={(e) => setCreatedAtInput(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40"
                />
                <span className="text-[11px] text-neutral-400">
                  입력 시 해당 날짜 00:00(로컬) 기준으로 저장됩니다.
                </span>
              </div>
            </div>

            {/* 버튼 영역 */}
            <div className="pt-4 flex items-center justify-between gap-4 text-xs">
              <Link
                href={blobKey ? `/gallery/view?key=${encodeURIComponent(blobKey)}` : "/gallery"}
                className="inline-flex items-center px-3 py-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
              >
                취소
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-5 py-2 rounded-full bg-[#1F3AA7] text-white text-xs font-medium hover:bg-[#182e82] disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {saving ? "저장 중..." : "저장하기"}
              </button>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </>
  )
}
