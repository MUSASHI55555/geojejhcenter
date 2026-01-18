// app/gallery/layout.tsx
import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "갤러리 - 거제지역자활센터",
  description: "거제지역자활센터 갤러리",
  alternates: {
    canonical: "/gallery",
  },
  openGraph: {
    title: "갤러리 - 거제지역자활센터",
    description: "거제지역자활센터 갤러리",
    url: "/gallery",
    type: "website",
  },
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
