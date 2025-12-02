import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import Image from "next/image"

export const metadata = {
  title: "조직도 - 거제지역자활센터",
  description: "거제지역자활센터 조직도",
}

export default function OrganizationPage() {
  return (
    <>
      <SkipLink />
      <Header />

      {/* 상단: 기관소개 라벨 + 조식도 타이틀 */}
      <SectionHero sectionKey="about" title="조직도" />

      <BreadcrumbBar
        topLabel="기관소개"
        topHref="/intro"
        currentLabel="조직도"
        siblingsOfTop={[{ label: "기관소개", href: "/intro" }]}
        siblingsOfCurrent={[
          { label: "인사말", href: "/intro/greeting" },
          { label: "모법인소개", href: "/intro/mother-foundation" },
          { label: "연혁", href: "/intro/history" },
          { label: "조직도", href: "/intro/organization" },
          { label: "오시는 길", href: "/intro/location" },
        ]}
      />

      <main id="main-content" className="min-h-screen bg-neutral-50">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <section aria-label="자활 조직도" className="px-2 md:px-4">
              <div className="flex flex-col items-center gap-3 mb-6">
                <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary-50 text-primary-700 text-xs font-semibold tracking-wide">
                  조직 구조 안내
                </span>
                <h2 className="text-2xl md:text-3xl font-bold text-ink-900">자활 조직도</h2>
                <div className="h-1 w-10 rounded-full bg-primary-200" aria-hidden="true" />
              </div>

              <div className="relative w-full rounded-2xl overflow-hidden border border-neutral-100 shadow-sm bg-neutral-900/2">
                <Image
                  src="/jjj2.png"
                  alt="거제지역자활센터 자활 조직도"
                  width={1600}
                  height={900}
                  className="w-full h-auto object-contain bg-white"
                  priority
                />
              </div>

              <p className="mt-4 text-xs md:text-sm text-center text-ink-500">
                ※ 조직도는 센터 운영 상황에 따라 변경될 수 있습니다.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
