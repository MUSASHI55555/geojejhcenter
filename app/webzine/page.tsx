import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import { BookOpen } from "lucide-react"

export const metadata = {
  title: "웹진 - 거제지역자활센터",
  description: "거제지역자활센터 웹진",
}

export default function WebzinePage() {
  return (
    <>
      <SkipLink />
      <Header />

      {/* 상단 라벨: 웹진보기, 제목: 웹진 (부가 설명 제거) */}
      <SectionHero sectionKey="webzine" title="웹진" />

      <BreadcrumbBar
        topLabel="웹진보기"
        topHref="/webzine"
        currentLabel="웹진"
        siblingsOfTop={[{ label: "웹진보기", href: "/webzine" }]}
        siblingsOfCurrent={[{ label: "웹진", href: "/webzine" }]}
      />

      <main id="main-content" className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <BookOpen className="w-10 h-10 text-primary-600" aria-hidden="true" />
            </div>
            <h2 className="text-2xl font-bold text-ink-900">웹진 준비 중</h2>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
