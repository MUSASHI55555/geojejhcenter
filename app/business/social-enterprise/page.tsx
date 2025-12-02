// app/business/social-enterprise/page.tsx
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import { EnterpriseGrid } from "@/components/enterprise-grid" // 카드 그리드 사용

export const metadata = {
  title: "자활기업 - 거제지역자활센터",
  description: "지역 사회에 일자리와 수익을 창출하는 사회적 기업",
}

export default function SocialEnterprisePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <SectionHero sectionKey="business" title="자활기업" />
      <BreadcrumbBar
        topLabel="사업안내"
        topHref="/business/self-support"
        currentLabel="자활기업"
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
          {/* 인트로 카피 — 옵션 C: 그라디언트 텍스트 + 점자 패턴 배경 + 센터 언더라인 */}
          <div className="mb-12">
            <div className="relative mx-auto max-w-4xl overflow-hidden rounded-2xl bg-white/60 px-6 py-8 ring-1 ring-primary-200/60 backdrop-blur">
              {/* 점자 패턴 배경 */}
              <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.10]" aria-hidden="true">
                <defs>
                  <pattern id="dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
                    <circle cx="1" cy="1" r="1" className="fill-primary-700" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dot-grid)" />
              </svg>

              {/* 본문 텍스트 */}
              <p className="relative z-[1] text-center text-[17px] leading-relaxed text-ink-800 md:text-xl">
                <span className="bg-gradient-to-r from-sky-600 via-primary-700 to-sky-600 bg-clip-text font-semibold text-transparent">
                  자활기업은 지역 사회에 일자리와 수익을 창출하는 사회적 기업입니다.
                </span>
                <br className="hidden md:block" />
                자활 참여자들이 협력하여 운영하며, 지속 가능한 경제 활동을 통해 자립을 실현합니다.
              </p>

              {/* 센터 언더라인 */}
              <div
                aria-hidden="true"
                className="relative z-[1] mx-auto mt-4 h-[6px] w-40 rounded-full bg-gradient-to-r from-sky-300/70 via-primary-500/70 to-sky-300/70"
              />
            </div>
          </div>

          {/* 비주얼 카드 그리드 */}
          <EnterpriseGrid />
        </div>
      </main>
      <Footer />
    </>
  )
}
