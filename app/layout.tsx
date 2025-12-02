import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { BackToTopButton } from "@/components/back-to-top-button"

export const metadata: Metadata = {
  metadataBase: new URL("https://geojejh.or.kr"),
  title: "거제지역자활센터",
  description: "거제지역자활센터 - 꿈과 의미 있는 삶이 있어 즐거운 우리 거제 자활",
  openGraph: {
    title: "거제지역자활센터",
    description: "거제지역자활센터 - 꿈과 의미 있는 삶이 있어 즐거운 우리 거제 자활",
    url: "https://geojejh.or.kr",
    siteName: "거제지역자활센터",
    locale: "ko_KR",
    type: "website",
  },
  alternates: {
    canonical: "https://geojejh.or.kr",
  },
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard-dynamic-subset.min.css"
        />
      </head>
      <body className="font-sans bg-background text-foreground">
        {children}
        <BackToTopButton />
      </body>
    </html>
  )
}
