import Image from "next/image"
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "모법인소개 - 거제지역자활센터",
  description: "사단법인 곰솔 모법인소개 - 거제지역자활센터",
}

export default function MotherFoundationPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <SectionHero sectionKey="about" title="모법인소개" />
      <BreadcrumbBar
        topLabel="기관소개"
        topHref="/intro"
        currentLabel="모법인소개"
        siblingsOfTop={[{ label: "기관소개", href: "/intro" }]}
        siblingsOfCurrent={[
          { label: "인사말", href: "/intro/greeting" },
          { label: "모법인소개", href: "/intro/mother-foundation" },
          { label: "연혁", href: "/intro/history" },
          { label: "조직도", href: "/intro/organization" },
          { label: "오시는 길", href: "/intro/location" },
        ]}
      />
      <main className="min-h-screen bg-gradient-to-b from-slate-50 via-slate-50 to-slate-100">
        <div className="container mx-auto px-4 py-10 md:py-16 lg:py-24">
          <div className="max-w-4xl mx-auto">
            {/* 카드 바깥 타이틀 */}
            <div className="mb-4 md:mb-6 flex justify-center">
              <div className="relative inline-block text-center">
                <div
                  className="absolute -left-3 -top-2 w-2 h-2 rounded-full"
                  style={{ backgroundColor: "#1FB86A" }}
                  aria-hidden="true"
                />
                <h2 className="text-[24px] md:text-[40px] font-semibold tracking-tight text-slate-900 leading-tight">
                  사단법인 곰솔
                </h2>
              </div>
            </div>

            <div className="relative">
              {/* 카드 본체 */}
              <div className="relative z-10 bg-white/98 backdrop-blur-sm border border-slate-200 shadow-[0_12px_32px_rgba(15,23,42,0.09)] rounded-2xl md:rounded-3xl px-5 py-8 sm:px-6 sm:py-9 md:px-16 md:py-16 lg:px-20 lg:py-20 overflow-hidden">
                {/* dropp.png: 카드 내부에서 2배 크기, 둥근 모서리 밖만 overflow-hidden으로 클리핑 (우측 10px 추가 이동) */}
                <div className="pointer-events-none absolute top-0 -left-10 w-48 sm:w-56 md:w-64 opacity-80 z-20">
                  <Image
                    src="/dropp.png"
                    alt=""
                    width={320}
                    height={320}
                    className="w-full h-auto translate-x-[40px]"
                    priority
                  />
                </div>

                {/* soll.png: 좌측, 하단 각 10px 이동 */}
                <div className="pointer-events-none absolute bottom-0 left-4 w-24 sm:w-28 md:w-32 opacity-80 z-0">
                  <Image
                    src="/soll.png"
                    alt=""
                    width={160}
                    height={120}
                    className="w-full h-auto -translate-x-[10px] translate-y-[10px]"
                    priority
                  />
                </div>

                {/* sonamu.png: 1px 위로 이동 */}
                <div className="pointer-events-none absolute bottom-0 right-4 w-40 sm:w-48 md:w-56 opacity-80 z-0">
                  <Image
                    src="/sonamu.png"
                    alt=""
                    width={320}
                    height={200}
                    className="w-full h-auto -translate-y-[1px]"
                    priority
                  />
                </div>

                {/* 좌우 세로 라인 - 블랙 톤 */}
                <div className="pointer-events-none absolute inset-0 z-10">
                  <div className="absolute left-[25px] top-[41px] bottom-[21px] w-[2px] bg-gradient-to-b from-transparent via-black/35 to-transparent" />
                  <div className="absolute right-[25px] top-[41px] bottom-[21px] w-[2px] bg-gradient-to-b from-transparent via-black/35 to-transparent" />
                </div>

                {/* 상단 라인 - 블랙 톤 */}
                <div
                  className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-16 md:w-24 h-0.5 bg-gradient-to-r from-transparent via-black/60 to-transparent z-10"
                  aria-hidden="true"
                />

                <div className="relative max-w-2xl mx-auto space-y-6 md:space-y-7 z-20">
                  {/* 섹션 1 */}
                  <section className="relative text-center space-y-3 mb-1">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                      설립 배경과 시작
                    </h3>
                    <div className="text-[15px] md:text-[17px] leading-[1.85] text-slate-700 space-y-2 text-center">
                      <p>
                        사단법인 곰솔은 지난 2000년, IMF구제금융 지원 시기 이후 어려움을 겪던 시기,
                      </p>
                      <p>
                        지역사회저소득 주민들의 <span className="font-semibold">일자리 창출</span>과{" "}
                        <span className="font-semibold">자립</span>을 지원하기 위해{" "}
                        <span className="font-semibold" style={{ color: "#1F3AA7" }}>
                          &#39;거제사회복지지원센터&#39;
                        </span>
                        로
                      </p>
                      <p>
                        첫 발걸음을 내딛었습니다. 가사간병 서비스, 재활용 헌옷 수거, 초등학교 청소사업 등
                      </p>
                      <p>
                        다양한 일자리사업을 통해 저소득층 주민 및 실업자들의 자립 기반을 마련해 왔습니다.
                      </p>
                    </div>
                  </section>

                  {/* 구분선 1 */}
                  <div className="relative -z-5 -mt-15 -mb-15 flex justify-center" aria-hidden="true">
                    <Image
                      src="/realline.png"
                      alt=""
                      width={260}
                      height={60}
                      className="w-40 md:w-56 lg:w-64 h-auto opacity-80"
                    />
                  </div>

                  {/* 섹션 2 */}
                  <section className="relative text-center space-y-3">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
                      성장과 발전
                    </h3>
                    <div className="text-[15px] md:text-[17px] leading-[1.9] text-slate-700 space-y-1.5 text-center">
                      <p>
                        <span className="font-semibold">2001년,</span>
                      </p>
                      <p>보건복지부로부터 경남거제자활후견기관으로 지정받아</p>
                      <p>본격적인 자활사업을 시작하였습니다.</p>

                      <p className="mt-3">
                        <span className="font-semibold">2008년,</span>
                      </p>
                      <p>거제돌봄지원센터를 설립하고</p>
                      <p>장기요양 및 방문목욕 서비스를 개시하여 복지서비스 영역을 확장하였습니다.</p>

                      <p className="mt-3">
                        그리고 2025년 5월 2일, 새로운 이름{" "}
                        <span className="font-semibold" style={{ color: "#1FB86A" }}>
                          &#39;사단법인 곰솔&#39;
                        </span>
                        로 거듭났습니다.
                      </p>

                      <p className="mt-3">
                        &#39;곰솔&#39;처럼 늘 푸르고 든든한 존재로,
                      </p>
                      <p>
                        지역사회 주민들의 곁을 지키는 든든한 파트너로 자리매김 하겠습니다.
                      </p>
                    </div>
                  </section>

                  {/* 구분선 2 */}
                  <div className="relative -z-5 -mt-15 -mb-15 flex justify-center" aria-hidden="true">
                    <Image
                      src="/realline.png"
                      alt=""
                      width={260}
                      height={60}
                      className="w-40 md:w-56 lg:w-64 h-auto opacity-80"
                    />
                  </div>

                  {/* 섹션 3: 법적 근거 및 사업 영역 */}
                  <section className="relative space-y-4">
                    <h3 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight text-center">
                      법령 근거 및 사업 영역
                    </h3>
                    <div className="text-[14px] md:text-[16px] leading-[1.8] text-slate-700 space-y-3">
                      <div className="bg-slate-50/90 border border-slate-200 rounded-lg p-4 md:p-5">
                        <p>「국민기초생활보장법」 제16조에 따라,</p>
                        <p>저소득층의 자립·자활을 지원하는 경남거제지역자활센터를 운영하고 있습니다.</p>
                      </div>

                      <div className="bg-slate-50/90 border border-slate-200 rounded-lg p-4 md:p-5">
                        <p>「노인장기요양보험법」 제31조에 근거하여, 거제돌봄지원센터를 통해</p>
                        <p>방문요양, 방문목욕 등 어르신을 위한 장기요양서비스를 제공하고 있습니다.</p>
                      </div>

                      <div className="bg-slate-50/90 border border-slate-200 rounded-lg p-4 md:p-5">
                        <p>「사회서비스 이용 및 이용권 관리에 관한 법률 시행규칙」 제16조에 따라,</p>
                        <p>취약계층을 위한 가사·간병 방문 지원서비스를 진행하고 있습니다.</p>
                      </div>

                      <div className="bg-slate-50/90 border border-slate-200 rounded-lg p-4 md:p-5">
                        <p>「의료급여법」 제5조에 따라, 저소득층의 건강한 삶을 위한</p>
                        <p>재가 의료급여 사업을 통해 건강관리 및 일상생활 지원을 실천하고 있습니다.</p>
                      </div>

                      <div className="bg-slate-50/90 border border-slate-200 rounded-lg p-4 md:p-5">
                        <p>법인의 설립 취지에 따라, 다양한 지역 밀착형 복지사업, 조사·연구,</p>
                        <p>정책 개발 및 민·관 협력 사업을 활발히 수행하고 있습니다.</p>
                      </div>
                    </div>
                  </section>

                  {/* 마무리 섹션 */}
                  <section className="relative text-center space-y-4 pt-2">
                    <div className="text-[16px] md:text-[18px] leading-[1.85] text-slate-800 space-y-2.5">
                      <p>
                        사단법인 곰솔은 장애인, 노인, 여성, 아동 등
                        <br className="hidden sm:inline" />
                        우리 사회의 취약계층 모두가
                      </p>
                      <p>
                        더 나은 삶의 질과 사회적 포용을 누릴 수 있도록
                        <br className="hidden sm:inline" />
                        최선을 다하겠습니다.
                      </p>
                      <p className="mt-4 md:mt-6 font-semibold text-[17px] md:text-[19px] text-slate-900">
                        지역사회의 따뜻한 지지와 격려가
                        <br className="hidden sm:inline" />
                        곰솔의 든든한 뿌리입니다.
                      </p>
                      <p className="mt-3 md:mt-4 text-[15px] md:text-[17px] text-slate-700">
                        감사합니다.
                      </p>
                    </div>

                    <div className="mt-6 md:mt-8 pt-4">
                      <div className="mx-auto w-24 md:w-32 border-t border-slate-200" />
                      <p className="mt-3 text-[16px] md:text-[18px] font-semibold text-slate-900 tracking-wide text-center">
                        사단법인 곰솔 이사회 일동
                      </p>
                    </div>
                  </section>
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
