// app/notice/new/form.tsx
"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"

const CATEGORY_OPTIONS = [
  { value: "공지", label: "[공지]" },
  { value: "채용공고", label: "[채용공고]" },
  { value: "긴급공고", label: "[긴급공고]" },
]

export function NewNoticeForm() {
  const router = useRouter()
  const [category, setCategory] = useState("공지")
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const res = await fetch("/api/notices/new", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title,
          content,
          category,
        }),
      })

      if (!res.ok) {
        const msg = await safeText(res)
        throw new Error(msg || "공지 등록에 실패했습니다.")
      }

      // 성공 시 공지 목록으로 이동 + 새로고침
      router.push("/notice")
      router.refresh()
    } catch (err: any) {
      setError(err?.message || "공지 등록 중 오류가 발생했습니다.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* 분류 선택 */}
      <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-slate-800">분류</label>
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-48 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]"
        >
          {CATEGORY_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <p className="text-[10px] text-slate-500">
          [공지], [채용공고], [긴급공고] 중 하나를 선택하세요. 홈/목록에서 파란 라벨로 표시됩니다.
        </p>
      </div>

      {/* 제목 */}
      <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-slate-800">제목</label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F3AA7]"
          placeholder="공지 제목을 입력하세요."
        />
      </div>

      {/* 내용 */}
      <div className="space-y-1.5">
        <label className="block text-[12px] font-medium text-slate-800">내용</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
          rows={14}
          className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm text-slate-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#1F3AA7] font-[system-ui]"
          placeholder="공지 내용을 입력하세요."
        />
      </div>

      {error && <p className="text-[10px] text-red-600 whitespace-pre-line">{error}</p>}

      <div className="flex items-center justify-end gap-2 pt-2">
        <button
          type="button"
          onClick={() => {
            setCategory("공지")
            setTitle("")
            setContent("")
            setError(null)
          }}
          className="px-3 py-1.5 rounded-md border border-slate-300 text-[11px] text-slate-700 hover:bg-slate-50"
          disabled={submitting}
        >
          초기화
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-1.5 rounded-md bg-[#1F3AA7] text-[12px] font-semibold text-white shadow-sm hover:bg-[#152a7c] disabled:opacity-60"
        >
          {submitting ? "등록 중…" : "공지 등록"}
        </button>
      </div>
    </form>
  )
}

async function safeText(res: Response): Promise<string> {
  try {
    return await res.text()
  } catch {
    return ""
  }
}

export default NewNoticeForm
