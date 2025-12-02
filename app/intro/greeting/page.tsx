import Image from "next/image"
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "인사말 - 거제지역자활센터",
  description: "거제지역자활센터 인사말",
}

export default function GreetingPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <SectionHero sectionKey="about" title="인사말" />
      <BreadcrumbBar
        topLabel="기관소개"
        topHref="/intro"
        currentLabel="인사말"
        siblingsOfTop={[{ label: "기관소개", href: "/intro" }]}
        siblingsOfCurrent={[
          { label: "인사말", href: "/intro/greeting" },
          { label: "모법인소개", href: "/intro/mother-foundation" },
          { label: "연혁", href: "/intro/history" },
          { label: "조직도", href: "/intro/organization" },
          { label: "오시는 길", href: "/intro/location" },
        ]}
      />
      <main id="main-content" className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-10 md:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            {/* 카드 바깥 인사말 타이틀 */}
            <div className="mb-4 md:mb-6 flex justify-center">
              <div className="relative inline-block text-center">
                <div
                  className="absolute -left-3 -top-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#1F3AA7" }}
                  aria-hidden="true"
                />
                <h2 className="text-[24px] md:text-[40px] font-semibold tracking-tight text-slate-900 leading-tight">
                  인사말
                </h2>
              </div>
            </div>

            <div className="relative">
              <div className="relative bg-white/98 backdrop-blur-sm border border-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.09)] rounded-2xl md:rounded-3xl px-5 py-8 sm:px-6 sm:py-9 md:px-16 md:py-16 lg:px-20 lg:py-20 overflow-hidden">
                {/* 워터컬러 데코 */}
                <div className="pointer-events-none absolute -top-16 -left-8 w-28 sm:w-32 md:w-40 opacity-[0.14] md:opacity-[0.16] z-0">
                  <Image src="/invite.png" alt="" width={600} height={900} className="w-full h-auto" priority />
                </div>
                <div className="pointer-events-none absolute -bottom-20 -right-4 w-32 sm:w-40 md:w-48 opacity-[0.14] md:opacity-[0.18] rotate-3 md:rotate-6 z-0">
                  <Image src="/invite.png" alt="" width={600} height={900} className="w-full h-auto" priority />
                </div>

                {/* 좌우 세로 그라데이션 라인 */}
                <div className="pointer-events-none absolute inset-0 z-10">
                  <div className="absolute left-[25px] top-[41px] bottom-[21px] w-[2px] bg-gradient-to-b from-transparent via-sky-400/40 to-transparent" />
                  <div className="absolute right-[25px] top-[41px] bottom-[21px] w-[2px] bg-gradient-to-b from-transparent via-sky-400/40 to-transparent" />
                </div>

                {/* 상단 하이라이트 라인 */}
                <div
                  className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-sky-500/60 to-transparent z-10"
                  aria-hidden="true"
                />

                {/* 시 */}
                <div className="relative max-w-2xl mx-auto text-center space-y-4 md:space-y-6 z-20">
                  <div className="text-slate-800 italic leading-[1.7] md:leading-[1.8] space-y-1 text-[15px] sm:text-[16px] md:text-[18px] tracking-wide font-light">
                    <p>사람이 온다는 것은</p>
                    <p>실은 어마어마한 일이다.</p>
                    <p>그는</p>
                    <p>그의 과거와</p>
                    <p>현재와</p>
                    <p>그리고</p>
                    <p>그의 미래와 함께 오기 때문이다.</p>
                    <p>한 사람의 일생이 오기 때문이다.</p>
                    <p>부서지기 쉬운</p>
                    <p>그래서 부서지기도 했을</p>
                    <p>마음이 오는 것이다.</p>
                  </div>
                  <p className="text-[11px] sm:text-[12px] md:text-[15px] text-slate-500 text-right tracking-wider font-medium relative -left-[15px] md:left-0">
                    - 정현종 「방문객」 中 -
                  </p>
                </div>

                {/* 구분선 */}
                <div
                  className="relative my-8 md:my-12 lg:my-16 flex items-center justify-center gap-3 z-20"
                  aria-hidden="true"
                >
                  <div className="h-px w-10 md:w-16 bg-gradient-to-r from-transparent to-sky-300/60" />
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-500/70" />
                  <div className="h-px w-10 md:w-16 bg-gradient-to-l from-transparent to-sky-300/60" />
                </div>

                {/* 인사말 본문 */}
                <div className="relative max-w-2xl mx-auto text-[16px] sm:text-[17px] md:text-[21px] leading-[1.8] text-center space-y-1 text-slate-800 font-normal tracking-tight z-20">
                  <p>부서지기 쉬운,</p>
                  <p>그래서 부서지기도 했을 마음들이 모여</p>
                  <p>
                    <span className="text-[19px] sm:text-[20px] md:text-[25px] font-semibold text-[#0F172A]">과거</span>
                    를 있는 그대로 존중하고,
                  </p>
                  <p>
                    <span
                      className="text-[19px] sm:text-[20px] md:text-[25px] font-semibold"
                      style={{ color: "#1F3AA7" }}
                    >
                      현재
                    </span>
                    를 의미 있게 살아가며,
                  </p>
                  <p>
                    <span
                      className="text-[19px] sm:text-[20px] md:text-[25px] font-semibold"
                      style={{ color: "#38BDF8" }}
                    >
                      미래
                    </span>
                    를 즐겁게 만들어 가는
                  </p>
                  <p>거제지역자활센터입니다.</p>

                  <p className="mt-5 md:mt-6">실로 어마어마한 자활의 여정에</p>
                  <p>함께 해주시는 여러분을</p>
                  <p>진심으로 환영합니다.</p>

                  <p className="mt-5 md:mt-6 font-medium">감사합니다.</p>
                </div>

                {/* 서명 영역 */}
                <div className="relative mt-10 md:mt-16 lg:mt-20 max-w-2xl mx-auto flex justify-center z-20">
                  <div className="relative inline-flex items-end gap-3">
                    <span className="absolute top-1/2 -translate-y-1/2 -translate-y-[32px] md:-translate-y-[40px] translate-x-[32px] md:translate-x-[80px] z-30 text-[12px] sm:text-[13px] md:text-[15px] text-slate-600 font-medium tracking-wide">
                      거제지역자활센터장
                    </span>
                    <Image
                      src="/signa1.png"
                      alt="거제지역자활센터장 자필 서명"
                      width={1440}
                      height={540}
                      className="block w-[220px] sm:w-[260px] md:w-[360px] lg:w-[450px] h-auto translate-x-[40px] sm:translate-x-[48px] md:translate-x-[65px] -translate-y-[25px] md:-translate-y-[30px]"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
