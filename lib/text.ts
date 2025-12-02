// lib/text.ts
/** Remove zero-width chars and normalize to NFC to prevent mojibake. */
export function cleanLabel(s: string) {
  if (!s) return s
  return s.replace(/[\u200B\u200C\u200D\uFEFF]/g, "").normalize("NFC")
}
