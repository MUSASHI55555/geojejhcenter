"use client"

// ========================
// 갤러리 신규 등록 페이지 (작성일 선택 + 대표 이미지 선택 포함 버전)
// ========================

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from 'next/navigation'
import dynamic from "next/dynamic"
import Link from "next/link"
import { SkipLink } from "@/components/skip-link"
import { Footer } from "@/components/footer"
import type { GalleryImage, ThumbnailFocus } from "@/lib/gallery-types"

// == Lazy Components ==
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

// == Types ==
type CreateResponse = {
  ok: boolean
  key?: string
  error?: string
}

// == Helpers ==
// (주석 기준 검색: [date-normalize])
// yyyy-MM-dd -> 로컬 자정 Date -> ISO 문자열 (유효하지 않으면 null)
function toISOFromLocalDate(dateStr: string): string | null {
  if (!dateStr) return null
  // 안전 파싱
  const m = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!m) return null
  const year = Number(m[1])
  const month = Number(m[2]) - 1 // 0-based
  const day = Number(m[3])
  const d = new Date(year, month, day, 0, 0, 0, 0) // 로컬 자정
  if (isNaN(d.getTime())) return null
  return d.toISOString()
}

export default function GalleryNewPage() {
  const router = useRouter()

  // 폼 상태
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [category, setCategory] = useState("")
  const [images, setImages] = useState<GalleryImage[]>([])

  // [작성일] 입력 상태 (yyyy-MM-dd)  // [anchor:createdAt-input]
  const [createdAtInput, setCreatedAtInput] = useState("")

  // 대표 이미지 선택 상태
  const [thumbnailIndex, setThumbnailIndex] = useState<number | null>(null)
  const [thumbnailFocus, setThumbnailFocus] = useState<ThumbnailFocus>("center")

  // UX 상태
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // 파일 선택 열기
  const openFilePicker = () => {
    fileInputRef.current?.click()
  }

  // 이미지 업로드
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/gallery/upload-image", {
          method: "POST",
          body: formData,
        })

        const data: any = await res.json().catch(() => null)

        if (!res.ok || !data?.ok || !data.image) {
          console.error("[GalleryNew] image upload failed", res.status, data)
          alert(data?.error || "이미지 업로드 중 오류가 발생했습니다.")
          continue
        }

        setImages((prev) => {
          const newImages = [...prev, data.image]
          if (thumbnailIndex === null && newImages.length === 1) {
            setThumbnailIndex(0)
          }
          return newImages
        })
      } catch (err) {
        console.error("[GalleryNew] image upload request failed", err)
        alert("이미지 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.")
      }
    }

    // 같은 파일 재선택 허용
    e.target.value = ""
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => {
      const newImages = prev.filter((_, i) => i !== index)
      if (thumbnailIndex === index) {
        // Removed the selected thumbnail
        setThumbnailIndex(newImages.length > 0 ? 0 : null)
      } else if (thumbnailIndex !== null && thumbnailIndex > index) {
        // Shift index down
        setThumbnailIndex(thumbnailIndex - 1)
      }
      return newImages
    })
  }

  // 저장
  const handleSave = async () => {
    setError("")

    if (!title.trim()) {
      alert("제목을 입력해 주세요.")
      return
    }
    if (images.length === 0) {
      alert("최소 1개 이상의 이미지를 추가해 주세요.")
      return
    }

    try {
      setSaving(true)

      // [작성일 처리]  // [anchor:createdAt-serialize]
      const createdAtISO = createdAtInput ? toISOFromLocalDate(createdAtInput) : null
      if (createdAtInput && !createdAtISO) {
        alert("작성일 형식이 올바르지 않습니다. 예: 2025-11-12")
        setSaving(false)
        return
      }

      const payload: any = {
        title: title.trim(),
        description: description.trim() || undefined,
        category: category.trim() || undefined,
        images,
      }
      // 선택 입력일 때만 포함
      if (createdAtISO) {
        payload.createdAt = createdAtISO
      }

      if (thumbnailIndex !== null && thumbnailIndex >= 0 && thumbnailIndex < images.length) {
        payload.thumbnail = {
          imageIndex: thumbnailIndex,
          focus: thumbnailFocus,
        }
      }

      const res = await fetch("/api/gallery/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      const data: CreateResponse = await res.json().catch(() => ({
        ok: false,
        error: "응답 파싱 오류",
      }))

      if (!res.ok || !data.ok || !data.key) {
        console.error("[GalleryNew] create failed", res.status, data)
        const msg = data.error || "갤러리 등록 중 오류가 발생했습니다."
        setError(msg)
        alert(msg)
        return
      }

      const encodedKey = encodeURIComponent(data.key)
      router.push(`/gallery/view?key=${encodedKey}`)
    } catch (err) {
      console.error("[GalleryNew] save request error", err)
      const msg = "갤러리 등록 중 오류가 발생했습니다."
      setError(msg)
      alert(msg)
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SkipLink />
      <Header />

      {/* 공유 히어로: 상단 라벨 커뮤니티, 제목 갤러리 등록 (설명문 제거) */}
      <SectionHero sectionKey="community" title="갤러리 등록" />

      <BreadcrumbBar
        topLabel="커뮤니티"
        topHref="/notice"
        currentLabel="갤러리 등록"
        siblingsOfTop={[{ label: "커뮤니티", href: "/notice" }]}
        siblingsOfCurrent={[
          { label: "공지사항", href: "/notice" },
          { label: "갤러리", href: "/gallery" },
          { label: "후원안내", href: "/donation" },
        ]}
      />

      <main id="main-content" className="min-h-screen bg-[#F7F7F9]">
        <section className="max-w-5xl mx-auto px-4 pb-16 pt-10">
          <article className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
            {error && <div className="mb-2 text-xs text-red-500">{error}</div>}

            {/* 이미지 업로드 (우선 배치) */}
            <div>
              <label className="block mb-1 text-xs text-neutral-600">
                이미지 <span className="text-red-500">*</span>
              </label>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={openFilePicker}
                  className="px-4 py-1.5 rounded-full border border-neutral-300 text-[11px] text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition"
                >
                  이미지 추가하기
                </button>
                {images.length === 0 && (
                  <span className="text-[11px] text-neutral-400">
                    선택된 이미지 없음 (최소 1개 필요)
                  </span>
                )}
              </div>

              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {images.length > 0 && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {images.map((img, index) => (
                      <div
                        key={`${img.url}-${index}`}
                        className="relative aspect-square rounded-lg overflow-hidden border-2 border-neutral-200 group"
                        style={{
                          borderColor: thumbnailIndex === index ? "#1F3AA7" : undefined,
                        }}
                      >
                        <img
                          src={img.url || "/placeholder.svg"}
                          alt={img.alt || `이미지 ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* 대표 이미지 뱃지 */}
                        {thumbnailIndex === index && (
                          <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full bg-[#1F3AA7] text-white text-[9px] font-semibold">
                            대표
                          </div>
                        )}
                        {/* 대표 선택 버튼 */}
                        <button
                          type="button"
                          onClick={() => setThumbnailIndex(index)}
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
                          onClick={() => handleRemoveImage(index)}
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
                className="w-48 px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40"
                placeholder="예: 행사, 교육, 현장스냅"
              />
            </div>

            {/* 설명 (선택) */}
            <div>
              <label className="block mb-1 text-xs text-neutral-600">설명 (선택)</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full min-h-[120px] px-3 py-2 rounded-lg border border-neutral-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40"
                placeholder="갤러리 설명을 입력해 주세요."
              />
            </div>

            {/* 작성일 (선택)  // [anchor:createdAt-field] */}
            <div>
              <label className="block mb-1 text-xs text-neutral-600">
                작성일 (선택)
              </label>
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
                href="/gallery"
                className="inline-flex items-center px-3 py-1.5 rounded-full border border-neutral-300 hover:bg-neutral-100 transition"
              >
                목록으로 돌아가기
              </Link>
              <button
                type="button"
                onClick={handleSave}
                disabled={saving}
                className="inline-flex items-center px-5 py-2 rounded-full bg-[#1F3AA7] text-white text-xs font-medium hover:bg-[#182e82] disabled:opacity-60 disabled:cursor-not-allowed transition"
              >
                {saving ? "등록 중..." : "등록하기"}
              </button>
            </div>
          </article>
        </section>
      </main>

      <Footer />
    </>
  )
}
