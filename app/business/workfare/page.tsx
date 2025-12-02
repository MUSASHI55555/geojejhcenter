// app/business/workfare/page.tsx
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import { WorkfareTabs } from "@/components/workfare-tabs"

export const metadata = {
  title: "자활근로사업 - 거제지역자활센터",
  description: "현장 근로 기회를 통한 자립 역량 강화",
}

export default function WorkfarePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <SectionHero sectionKey="business" title="자활근로사업" />
      <BreadcrumbBar
        topLabel="사업안내"
        topHref="/business/self-support"
        currentLabel="자활근로사업"
        siblingsOfTop={[{ label: "사업안내", href: "/business/self-support" }]}
        siblingsOfCurrent={[
          { label: "자활사업", href: "/business/self-support" },
          { label: "자활근로사업", href: "/business/workfare" },
          { label: "자활기업", href: "/business/social-enterprise" },
          { label: "자활사례관리", href: "/business/case-management" },
          { label: "사회서비스사업", href: "/business/care" },
        ]}
      />

      <main id="main-content" className="min-h-screen">
        <div className="container mx-auto px-4 py-16">
          {/* 인트로 카피 — 자활기업 스타일 카드 (가운데 정렬) */}
          <div className="mb-12">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white/60 px-6 py-8 ring-1 ring-primary-200/60 backdrop-blur">
              {/* 점자 패턴 배경 */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.10]" aria-hidden="true">
                <defs>
                  <pattern id="dot-grid-workfare" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" className="fill-primary-700" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dot-grid-workfare)" />
              </svg>

              {/* 본문 텍스트 (가운데 정렬) */}
              <p className="relative z-[1] text-center text-[17px] leading-relaxed text-ink-900 md:text-xl">
                <span className="bg-gradient-to-r from-sky-600 via-primary-700 to-sky-600 bg-clip-text font-semibold text-transparent">
                  자활근로사업은 현장 근로 기회를 통해 참여자의 자립 역량을 키우고,
                </span>
                <br className="hidden md:block" />
                경제적 자립을 준비하는 프로그램입니다.
              </p>

              {/* 가운데 언더라인 */}
              <div
                aria-hidden="true"
                className="relative z-[1] mt-4 h-[6px] w-40 rounded-full bg-gradient-to-r from-sky-300/70 via-primary-500/70 to-sky-300/70 mx-auto"
              />
            </div>
          </div>

          {/* 탭: 시장진입형 / 사회서비스형 / 인턴&도우미형 */}
          <WorkfareTabs />
        </div>
      </main>

      <Footer />
    </>
  )
}
