export type NoticeCategory = "공지" | "채용" | "긴급" | string

/**
 * Normalize raw category values from database to standardized values.
 * Supports both new format ("공지", "채용", "긴급") and legacy format ("채용공고", "긴급공고").
 */
export function normalizeCategory(raw?: string): "공지" | "채용" | "긴급" {
  const v = (raw || "").trim()

  if (v === "채용공고") return "채용"
  if (v === "긴급공고") return "긴급"
  if (v === "채용") return "채용"
  if (v === "긴급") return "긴급"

  return "공지"
}

/**
 * Get display label for category badge.
 */
export function getCategoryLabel(raw?: string): "공지" | "채용" | "긴급" {
  return normalizeCategory(raw)
}

/**
 * Get Tailwind CSS classes for category badge with pastel colors.
 * - 공지 (default): pastel blue (brand tone)
 * - 채용: pastel green
 * - 긴급: pastel red
 */
export function getCategoryClass(raw?: string): string {
  const c = normalizeCategory(raw)

  if (c === "채용") {
    // pastel green
    return "inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] tracking-wide border-[#34c759] text-[#1b8f3a] bg-[#E9F9EE]"
  }

  if (c === "긴급") {
    // pastel red
    return "inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] tracking-wide border-[#ff4d4f] text-[#c53030] bg-[#FFF1F0]"
  }

  // default: 공지 (pastel blue)
  return "inline-flex items-center px-2.5 py-1 rounded-full border text-[10px] tracking-wide border-[#1F3AA7] text-[#1F3AA7] bg-[#EEF3FF]"
}
