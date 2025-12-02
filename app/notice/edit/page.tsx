"use client"

import { useEffect, useState, useRef } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import dynamic from "next/dynamic"
import Link from "next/link"

import { SkipLink } from "@/components/skip-link"
import { Footer } from "@/components/footer"
import type {
  Notice as NoticeType,
  NoticeAttachment,
  NoticeImage,
} from "@/lib/notices-types"

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

function formatInputFromNotice(notice: NoticeType | null) {
  if (!notice) {
    return {
      title: "",
      content: "",
      category: "공지",
      attachments: [] as NoticeAttachment[],
      images: [] as NoticeImage[],
      createdAtInput: "",
    }
  }

  // createdAt → yyyy-MM-dd (date input)
  let createdAtInput = ""
  if (notice.createdAt) {
    const d = new Date(notice.createdAt)
    if (!Number.isNaN(d.getTime())) {
      createdAtInput = d.toISOString().slice(0, 10)
    }
  }

  return {
    title: notice.title || "",
    content: typeof notice.content === "string" ? notice.content : "",
    category: notice.category || "공지",
    attachments: Array.isArray(notice.attachments) ? notice.attachments : [],
    images: Array.isArray(notice.images) ? notice.images : [],
    createdAtInput,
  }
}

function toCreatedAtISO(raw: string | undefined): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.trim()
  if (!trimmed) return undefined
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return undefined
  const [y, m, d] = trimmed.split("-").map((v) => Number.parseInt(v, 10))
  if (!y || !m || !d) return undefined
  return new Date(Date.UTC(y, m - 1, d, 0, 0, 0)).toISOString()
}

export default function NoticeEditPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const rawKey = searchParams.get("key") ?? ""

  const [blobKey, setBlobKey] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string>("")

  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [category, setCategory] = useState("공지")
  const [attachments, setAttachments] = useState<NoticeAttachment[]>([])
  const [images, setImages] = useState<NoticeImage[]>([])
  const [createdAtInput, setCreatedAtInput] = useState("")

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const imageInputRef = useRef<HTMLInputElement | null>(null)

  const openFilePicker = () => {
    if (fileInputRef.current) fileInputRef.current.click()
  }

  const openImagePicker = () => {
    if (imageInputRef.current) imageInputRef.current.click()
  }

  // 초기 key 검증 + 상세 데이터 로드
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

    if (!decoded.startsWith("notices/") || !decoded.endsWith(".json")) {
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
          `/api/notices/detail?key=${encodeURIComponent(decoded)}`,
          { cache: "no-store" },
        )

        if (!res.ok) {
          const text = await res.text().catch(() => "")
          console.error(
            "[NoticeEdit] /api/notices/detail 응답 오류",
            res.status,
            text.slice(0, 300),
          )
          throw new Error("공지 데이터를 불러오지 못했습니다.")
        }

        const ct = res.headers.get("content-type") || ""
        if (!ct.includes("application/json")) {
          const text = await res.text().catch(() => "")
          console.error(
            "[NoticeEdit] /api/notices/detail JSON 아님",
            ct,
            text.slice(0, 300),
          )
          throw new Error("공지 데이터를 불러오지 못했습니다.")
        }

        const data = (await res.json().catch((e: any) => {
          console.error(
            "[NoticeEdit] /api/notices/detail JSON 파싱 실패",
            e,
          )
          throw new Error("공지 데이터를 불러오지 못했습니다.")
        })) as DetailResponse

        if (!data || data.ok !== true || !data.notice) {
          console.error(
            "[NoticeEdit] /api/notices/detail 형식 오류",
            data,
          )
          throw new Error(
            data?.error || "공지 데이터를 불러오지 못했습니다.",
          )
        }

        if (cancelled) return

        const initial = formatInputFromNotice(data.notice)
        setTitle(initial.title)
        setContent(initial.content)
        setCategory(initial.category)
        setAttachments(initial.attachments)
        setImages(initial.images)
        setCreatedAtInput(initial.createdAtInput)
        setError("")
      } catch (e: any) {
        if (cancelled) return
        console.error("[NoticeEdit] 상세 로드 실패", e)
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

  // 첨부 업로드
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/notices/upload-attachment", {
          method: "POST",
          body: formData,
        })

        const data: any = await res.json().catch(() => null)

        if (!res.ok || !data?.ok || !data.attachment) {
          console.error("[NoticeEdit] 첨부 업로드 실패", res.status, data)
          alert(data?.error || "첨부파일 업로드 중 오류가 발생했습니다.")
          continue
        }

        setAttachments((prev) => [...prev, data.attachment])
      } catch (err) {
        console.error("[NoticeEdit] 첨부 업로드 요청 실패", err)
        alert(
          "첨부파일 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        )
      }
    }

    e.target.value = ""
  }

  // 이미지 업로드 (본문 상단용)
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (!files || files.length === 0) return

    for (const file of Array.from(files)) {
      const formData = new FormData()
      formData.append("file", file)

      try {
        const res = await fetch("/api/notices/upload-image", {
          method: "POST",
          body: formData,
        })

        const data: any = await res.json().catch(() => null)

        if (!res.ok || !data?.ok || !data.image) {
          console.error("[NoticeEdit] 이미지 업로드 실패", res.status, data)
          alert(data?.error || "이미지 업로드 중 오류가 발생했습니다.")
          continue
        }

        setImages((prev) => [...prev, data.image as NoticeImage])
      } catch (err) {
        console.error("[NoticeEdit] 이미지 업로드 요청 실패", err)
        alert(
          "이미지 업로드 중 오류가 발생했습니다. 잠시 후 다시 시도해 주세요.",
        )
      }
    }

    e.target.value = ""
  }

  const handleRemoveAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  // 저장
  const handleSave = async () => {
    if (!blobKey) {
      alert("유효하지 않은 공지입니다.")
      return
    }
    if (!title.trim()) {
      alert("제목을 입력해 주세요.")
      return
    }
    if (!content.trim()) {
      alert("내용을 입력해 주세요.")
      return
    }

    const createdAtISO = toCreatedAtISO(createdAtInput)

    try {
      setSaving(true)

      const payload: Partial<NoticeType> = {
        title: title.trim(),
        content,
        category: category || "공지",
        attachments,
        images,
      }

      // createdAtInput이 유효한 yyyy-MM-dd 였을 때만 덮어쓰기
      if (createdAtISO) {
        payload.createdAt = createdAtISO
      }

      const res = await fetch(`/api/notices/${blobKey}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })

      const data: any = await res.json().catch(() => null)

      if (!res.ok || !data?.ok) {
        console.error("[NoticeEdit] PUT 실패", res.status, data)
        alert(data?.error || "공지 저장 중 오류가 발생했습니다.")
        return
      }

      const encodedKey = encodeURIComponent(blobKey)
      router.push(`/notice/view?key=${encodedKey}`)
    } catch (e) {
      console.error("[NoticeEdit] 저장 요청 에러", e)
      alert("공지 저장 중 오류가 발생했습니다.")
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <SkipLink />
      <Header />

      <SectionHero sectionKey="community" title="공지사항 수정" />

      <BreadcrumbBar
        topLabel="커뮤니티"
        topHref="/notice"
        currentLabel="공지사항 수정"
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
              공지 정보를 불러오는 중입니다...
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

          {!loading && !error && (
            <article className="bg-white border border-neutral-200 rounded-2xl p-6 md:p-8 shadow-sm space-y-6">
              {/* 제목 */}
              <div>
                <label className="block mb-1 text-xs text-neutral-600">
                  제목
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40"
                  placeholder="공지 제목을 입력해 주세요."
                />
              </div>

              {/* 카테고리 */}
              <div>
                <label className="block mb-1 text-xs text-neutral-600">
                  카테고리
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-40 px-3 py-2 pr-8 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40 bg-white appearance-none bg-[right_10px_center] bg-no-repeat bg-[length:10px_6px]"
                  style={{
                    backgroundImage:
                      "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath fill='%23666' d='M1 0l4 4 4-4 1 1-5 5-5-5z'/%3E%3C/svg%3E\")",
                  }}
                >
                  <option value="공지">공지</option>
                  <option value="채용">채용</option>
                  <option value="긴급">긴급</option>
                </select>
              </div>

              {/* 등록일 (선택) */}
              <div>
                <label className="block mb-1 text-xs text-neutral-600">
                  등록일 (선택)
                </label>
                <input
                  type="date"
                  value={createdAtInput}
                  onChange={(e) => setCreatedAtInput(e.target.value)}
                  className="w-40 px-3 py-2 rounded-lg border border-neutral-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40 bg-white"
                />
                <p className="mt-1 text-[10px] text-neutral-400">
                  수정하지 않으면 기존 등록일이 유지됩니다.
                </p>
              </div>

              {/* 본문 상단 이미지 */}
              <div>
                <label className="block mb-1 text-xs text-neutral-600">
                  본문 상단 이미지
                </label>
                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openImagePicker}
                    className="px-4 py-1.5 rounded-full border border-neutral-300 text-[11px] text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition"
                  >
                    이미지 추가하기
                  </button>
                  {images.length === 0 && (
                    <span className="text-[11px] text-neutral-400">
                      등록된 이미지 없음
                    </span>
                  )}
                </div>
                <input
                  ref={imageInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageChange}
                  className="hidden"
                />
                {images.length > 0 && (
                  <ul className="mt-2 space-y-1 text-[11px] text-neutral-700">
                    {images.map((img, index) => (
                      <li
                        key={`${img.url}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <span className="max-w-xs truncate">
                          {img.alt || img.url}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(index)}
                          className="px-2 py-0.5 rounded-full border border-neutral-300 text-[10px] text-neutral-500 hover:bg-neutral-100"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 내용 */}
              <div>
                <label className="block mb-1 text-xs text-neutral-600">
                  내용
                </label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full min-h-[220px] px-3 py-2 rounded-lg border border-neutral-300 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]/40"
                  placeholder="공지 내용을 입력해 주세요."
                />
              </div>

              {/* 첨부파일 */}
              <div>
                <label className="block mb-1 text-xs text-neutral-600">
                  첨부파일
                </label>

                <div className="flex flex-wrap items-center gap-3">
                  <button
                    type="button"
                    onClick={openFilePicker}
                    className="px-4 py-1.5 rounded-full border border-neutral-300 text-[11px] text-neutral-700 bg-neutral-50 hover:bg-neutral-100 transition"
                  >
                    첨부파일 추가하기
                  </button>
                  {attachments.length === 0 && (
                    <span className="text-[11px] text-neutral-400">
                      선택된 파일 없음
                    </span>
                  )}
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  onChange={handleFileChange}
                  className="hidden"
                />

                {attachments.length > 0 && (
                  <ul className="mt-2 space-y-1 text-[11px] text-neutral-700">
                    {attachments.map((file, index) => (
                      <li
                        key={`${file.url}-${index}`}
                        className="flex items-center gap-2"
                      >
                        <a
                          href={file.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline text-[#1F3AA7] max-w-xs truncate"
                        >
                          {file.name}
                        </a>
                        <button
                          type="button"
                          onClick={() => handleRemoveAttachment(index)}
                          className="px-2 py-0.5 rounded-full border border-neutral-300 text-[10px] text-neutral-500 hover:bg-neutral-100"
                        >
                          삭제
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* 버튼들 */}
              <div className="pt-4 flex items-center justify-between gap-4 text-xs">
                <Link
                  href={
                    blobKey
                      ? `/notice/view?key=${encodeURIComponent(blobKey)}`
                      : "/notice"
                  }
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
          )}
        </section>
      </main>

      <Footer />
    </>
  )
}
