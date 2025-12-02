import { cleanLabel } from "@/lib/text"

export const mainMenu = [
  {
    label: "기관소개",
    href: "/about",
    children: [
      { label: "인사말", href: "/about" },
      { label: "모법인소개", href: "/intro/mother-foundation" },
      { label: "연혁", href: "/about/history" },
      { label: "조직도", href: "/about/organization" },
      { label: "오시는 길", href: "/about/location" },
    ],
  },
  {
    label: "사업안내",
    href: "/business/self-support",
    children: [
      { label: "자활사업", href: "/business/self-support" },
      { label: "자활근로사업", href: "/business/workfare" },
      { label: "자활기업", href: "/business/social-enterprise" },
      { label: "자활사례관리", href: "/business/case-management" },
      { label: "사회서비스사업", href: "/business/care" },
    ],
  },
  {
    label: "커뮤니티",
    href: "/notice",
    children: [
      { label: "공지사항", href: "/notice" },
      { label: "갤러리", href: "/gallery" },
      { label: "후원안내", href: "/donation" },
    ],
  },
  {
    label: "웹진보기",
    href: "/webzine",
    children: [{ label: "웹진", href: "/webzine" }],
  },
]

export const mainMenuClean = mainMenu.map((m) => ({
  ...m,
  label: cleanLabel(m.label),
  children: m.children?.map((c) => ({ ...c, label: cleanLabel(c.label) })) ?? [],
}))
