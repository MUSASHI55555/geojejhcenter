// app/notice/layout.tsx
import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "공지사항 - 거제지역자활센터",
  description: "거제지역자활센터 공지사항",
  alternates: {
    canonical: "/notice",
  },
  openGraph: {
    title: "공지사항 - 거제지역자활센터",
    description: "거제지역자활센터 공지사항",
    url: "/notice",
    type: "website",
  },
}

export default function NoticeLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
