// app/donation/page.tsx

import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "후원 안내 - 거제지역자활센터",
  description: "거제지역자활센터 후원 안내",
}

const BRAND_BLUE = "#1F3AA7"

export default function DonationPage() {
  return (
    <>
      <SkipLink />
      <Header />

      <SectionHero
        sectionKey="community"
        title="후원안내"
        subtitle="당신의 작은 나눔이 지역을 바꿉니다"
      />

      <BreadcrumbBar
        topLabel="커뮤니티"
        topHref="/notice"
        currentLabel="후원안내"
        siblingsOfTop={[{ label: "커뮤니티", href: "/notice" }]}
        siblingsOfCurrent={[
          { label: "공지사항", href: "/notice" },
          { label: "갤러리", href: "/gallery" },
          { label: "후원안내", href: "/donation" },
        ]}
      />

      <main id="main-content" className="min-h-screen bg-[#F7F7F9]">
        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            {/* 상단 타이틀: 좌측 정렬 + 좌상단 네이비 점 */}
            <div className="mb-3">
              <h1 className="relative inline-block text-2xl font-bold text-[#222] leading-tight">
                <span
                  aria-hidden="true"
                  className="absolute -top-2 -left-3 w-2 h-2 rounded-full"
                  style={{ backgroundColor: BRAND_BLUE }}
                />
                후원안내
              </h1>
            </div>

            {/* 희미한 그라데이션 구분선 (얇은 회색톤, 좌→우) */}
            <div
              className="mb-8 h-px w-full"
              style={{
                background:
                  "linear-gradient(to right," +
                  "rgba(148,163,183,0.45) 0%," +   // #94A3B8 - 진한 회색 파트
                  "rgba(148,163,183,0.20) 35%," +
                  "rgba(148,163,183,0.08) 70%," +
                  "transparent 100%)",
              }}
            />

            <section
              aria-label="후원 안내"
              className="bg-white border border-neutral-200 rounded-2xl shadow-sm overflow-hidden"
            >
              {/* 상단 이미지 블록 */}
              <div className="relative h-[320px] md:h-[400px]">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('/dona.jpg')" }}
                  aria-hidden="true"
                />
                <div
                  className="absolute inset-0"
                  aria-hidden="true"
                  style={{
                    background:
                      "linear-gradient(to bottom," +
                      "rgba(0,0,0,0.50) 0%," +
                      "rgba(0,0,0,0.38) 26%," +
                      "rgba(0,0,0,0.24) 50%," +
                      "rgba(0,0,0,0.12) 74%," +
                      "rgba(255,255,255,1) 100%)",
                  }}
                />
                <div className="relative h-full px-8 md:px-10 flex flex-col justify-center">
                  <p className="text-sm md:text-base font-medium text-white/92">
                    거제지역의 자립을 함께 만드는 동행
                  </p>
                  <h2 className="mt-2 text-2xl md:text-3xl font-bold text-white leading-snug">
                    당신의 작은 나눔이
                    <br className="hidden md:block" />
                    지역의 내일을 바꿉니다.
                  </h2>
                  <p className="mt-4 max-w-2xl text-xs md:text-sm text-white/96 leading-relaxed">
                    정기후원과 일시후원은 저소득 주민의 자립 준비와 생활 안정, 상담 및
                    지원 프로그램에 투명하게 사용됩니다.
                  </p>
                </div>
              </div>

              {/* 하단 정보 영역 */}
              <div className="px-8 pb-9 pt-7 md:pt-8 flex flex-col md:flex-row md:items-start md:justify-between gap-10">
                {/* 후원계좌 */}
                <div className="flex-1 min-w-[260px]">
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">
                    후원계좌
                  </h3>
                  <div className="flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src="/sh.png"
                      alt="Sh 수협은행"
                      className="h-7 md:h-8 w-auto object-contain"
                    />
                    <div className="flex flex-col">
                      <div className="text-base md:text-lg font-semibold text-neutral-900 tracking-wide">
                        981-61-005434
                      </div>
                      <div className="text-xs md:text-sm text-neutral-600 mt-0.5">
                        (예금주: 거제지역자활센터)
                      </div>
                    </div>
                  </div>
                </div>

                {/* 후원문의 */}
                <div className="flex-1 min-w-[220px]">
                  <h3 className="text-xl md:text-2xl font-bold text-neutral-900 mb-4">
                    후원문의
                  </h3>
                  <dl className="space-y-2 text-sm md:text-base text-neutral-800">
                    <div className="flex gap-3">
                      <dt className="w-[70px] font-semibold text-neutral-900">
                        T)
                      </dt>
                      <dd>055-688-5890~1</dd>
                    </div>
                    <div className="flex gap-3">
                      <dt className="w-[70px] font-semibold text-neutral-900">
                        E-mail)
                      </dt>
                      <dd className="break-all">kojejh@hanmail.net</dd>
                    </div>
                  </dl>
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
