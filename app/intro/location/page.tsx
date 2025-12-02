import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import Image from "next/image"

export const metadata = {
  title: "오시는 길 - 거제지역자활센터",
  description: "거제지역자활센터 위치 안내",
}

export default function LocationPage() {
  return (
    <>
      <SkipLink />
      <Header />

      {/* 상단 라벨: 기관소개 / 메인 타이틀: 오시는 길 */}
      <SectionHero sectionKey="about" title="오시는 길" />

      <BreadcrumbBar
        topLabel="기관소개"
        topHref="/intro"
        currentLabel="오시는 길"
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
          <div className="max-w-6xl mx-auto">
            <section aria-label="거제지역자활센터 위치 안내" className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* 본관 위치 카드 */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                  <div className="p-6 text-center space-y-3">
                    <div className="relative inline-block mx-auto">
                      <span
                        className="absolute -left-3 -top-2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: "#1F3AA7" }}
                        aria-hidden="true"
                      />
                      <h2 className="text-xl md:text-2xl font-bold text-ink-900">센터 위치 안내</h2>
                    </div>
                    <p className="text-sm text-slate-600">거제지역자활센터 본관 주변 약도입니다.</p>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">
                      주소: 경남 거제시 사등면 두동로 1길 109
                    </p>
                  </div>
                  <div className="px-4 pb-4">
                    <Image
                      src="/gil1.gif"
                      alt="거제지역자활센터 본관 오시는 길 안내"
                      width={1200}
                      height={800}
                      className="w-full h-auto object-contain rounded-lg"
                      priority
                    />
                  </div>
                </div>

                {/* 연초작업장 위치 카드 */}
                <div className="bg-white rounded-2xl border border-neutral-200 shadow-sm overflow-hidden">
                  <div className="p-6 text-center space-y-3">
                    <div className="relative inline-block mx-auto">
                      <span
                        className="absolute -left-3 -top-2 w-2 h-2 rounded-full"
                        style={{ backgroundColor: "#1F3AA7" }}
                        aria-hidden="true"
                      />
                      <h2 className="text-xl md:text-2xl font-bold text-ink-900">연초작업장 위치 안내</h2>
                    </div>
                    <p className="text-sm text-slate-600">거제지역자활센터 연초작업장 주변 약도입니다.</p>
                    <p className="text-xs md:text-sm text-slate-500 font-medium">
                      주소: 경상남도 거제시 연초면 연하해안로 98
                    </p>
                  </div>
                  <div className="px-4 pb-4">
                    <Image
                      src="/jjj3.png"
                      alt="거제지역자활센터 연초작업장 오시는 길 약도"
                      width={1200}
                      height={800}
                      className="w-full h-auto object-contain rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
