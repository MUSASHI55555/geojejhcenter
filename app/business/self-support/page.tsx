import type React from "react"
// app/business/self-support/page.tsx
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import { Handshake, Users, ClipboardCheck, Briefcase } from "lucide-react"

export const metadata = {
  title: "자활사업 - 거제지역자활센터",
  description: "맞춤형 자활 지원 프로그램",
}

// 슬래시 코너 제목
function SlashCornerTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-2xl md:text-3xl font-bold text-ink-900 mb-6 text-center">
      <span className="relative inline-block px-3 py-1">
        <span className="pointer-events-none absolute -left-1 -top-1 w-2 h-[2px] bg-primary-600 rotate-45 rounded" />
        <span className="pointer-events-none absolute -right-1 -top-1 w-2 h-[2px] bg-primary-600 -rotate-45 rounded" />
        <span className="pointer-events-none absolute -left-1 -bottom-1 w-2 h-[2px] bg-primary-600 -rotate-45 rounded" />
        <span className="pointer-events-none absolute -right-1 -bottom-1 w-2 h-[2px] bg-primary-600 rotate-45 rounded" />
        {children}
      </span>
    </h2>
  )
}

function Highlight({ children }: { children: React.ReactNode }) {
  return (
    <span className="relative inline-block">
      <span className="absolute inset-x-0 bottom-[4px] h-3 bg-primary-900/20 rounded -z-10" />
      {children}
    </span>
  )
}

type StepCardProps = {
  no: "01" | "02" | "03" | "04"
  icon: React.ReactNode
  title: string
  desc: string
}
function StepCard({ no, icon, title, desc }: StepCardProps) {
  const zero = no.charAt(0)
  const rest = no.charAt(1) + "."
  return (
    <div className="relative bg-white border border-border rounded-xl p-6 text-center overflow-hidden">
      {/* 흐린 큰 번호 */}
      <div className="pointer-events-none select-none absolute left-1 top-1 opacity-10 leading-none">
        <span className="text-sky-400 text-4xl md:text-5xl font-extrabold align-top">{zero}</span>
        <span className="text-primary-900 text-4xl md:text-5xl font-extrabold align-top">{rest}</span>
      </div>

      <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-primary-50">{icon}</div>
      <div className="inline-flex items-center rounded-full bg-primary-600 px-4 py-1.5 text-sm font-semibold text-white">
        {title}
      </div>
      <p className="mt-3 text-ink-800">{desc}</p>
    </div>
  )
}

export default function SelfSupportPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <SectionHero sectionKey="business" title="자활사업" />
      <BreadcrumbBar
        topLabel="사업안내"
        topHref="/business/self-support"
        currentLabel="자활사업"
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
        <div className="container mx-auto px-4 py-14 md:py-16">
          <div className="max-w-4xl mx-auto">
            {/* 인트로 */}
            <div className="text-center">
              <p className="text-2xl md:text-[28px] leading-relaxed text-ink-900 font-semibold">
                ‘자활’(自活)은 자기 스스로의 힘으로 살아간다는 말로,
              </p>
              <p className="text-2xl md:text-[28px] leading-relaxed text-ink-900 font-semibold mt-1">
                <span className="text-primary-600 font-extrabold">어려움에 처해 있는 사람에게 근본적인 변화</span>를
                주는 것을 말합니다.
              </p>
            </div>

            <hr className="my-10 border-border" />

            {/* 자활사업이란? */}
            <section aria-labelledby="what-is-selfsupport" className="text-center">
              <h2 id="what-is-selfsupport" className="text-2xl md:text-3xl font-bold text-ink-900 mb-6">
                <span className="underline decoration-wavy decoration-primary-600 decoration-2 underline-offset-[6px]">
                  자활사업
                </span>
                이란?
              </h2>

              <ul className="mx-auto max-w-3xl space-y-4 text-ink-800 text-left">
                <li className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>
                    근로능력자의 기초생활을 보장하는 「국민기초생활보장제도」를 도입하면서 근로역량 배양 및 일자리
                    제공을
                    <span className="block">통한 탈빈곤 및 빈곤예방 지원</span>
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>
                    자활사업을 통해 근로능력 있는 저소득층이 스스로 자활할 수 있도록 자활능력 배양, 기능습득 지원 및
                    근로기회 제공
                  </span>
                </li>
              </ul>
            </section>

            {/* 참여 자격 */}
            <section aria-labelledby="eligibility" className="mt-14 text-center">
              <h2 id="eligibility" className="text-2xl md:text-3xl font-bold text-ink-900 mb-6">
                자활사업{" "}
                <span className="underline decoration-wavy decoration-primary-600 decoration-2 underline-offset-[6px]">
                  참여 자격
                </span>
              </h2>

              <ul className="mx-auto max-w-3xl space-y-3 text-ink-800 text-left">
                <li className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>만 18세 이상 64세 이하의 조건부수급자</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>만 18세 이상의 일반수급자(생계, 의료, 주거, 교육급여 수급자)</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>자활특례자, 차상위자, 급여특례가구</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>만 18세 이상 39세 이하의 수급자·차상위자 청년</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="mt-2 inline-block h-2 w-2 rounded-full bg-primary-500 flex-shrink-0" />
                  <span>만 18세 이상의 시설 수급자</span>
                </li>
              </ul>
            </section>

            {/* 구분선 */}
            <hr className="my-10 border-border" />

            {/* 참여 방법 */}
            <section aria-labelledby="howto" className="mt-6">
              <SlashCornerTitle>참여방법</SlashCornerTitle>

              {/* 수평 3컬럼: [방법A] [또는] [방법B] */}
              <div
                aria-label="참여 방법 선택"
                className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-6 md:gap-8 items-stretch"
              >
                {/* 방법 A – 세로 중앙 정렬 */}
                <div className="h-full rounded-xl border border-border bg-white p-6">
                  <div className="flex h-full items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary-500 mr-3 flex-shrink-0" />
                    <div className="flex flex-col justify-center">
                      <div className="font-semibold text-ink-900">가까운 읍·면·동 행정복지센터 방문</div>
                      <div className="text-sm text-ink-700 mt-1">만 18세 이상 64세 이하의 조건부수급자</div>
                    </div>
                  </div>
                </div>

                {/* '또는' */}
                <div className="self-center text-center text-ink-700">
                  <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm font-semibold">
                    또는
                  </span>
                </div>

                {/* 방법 B – 세로 중앙 정렬 + 문장 분리 */}
                <div className="h-full rounded-xl border border-border bg-white p-6">
                  <div className="flex h-full items-center">
                    <span className="inline-block h-2 w-2 rounded-full bg-primary-500 mr-3 flex-shrink-0" />
                    <div className="flex flex-col justify-center">
                      <div className="font-semibold text-ink-900">가까운 지역자활센터 방문</div>
                      <div className="text-sm text-ink-700 mt-1">
                        간이상담과 자활사업안내를 받은 후 본인 동의하에
                        <span className="block mt-1">지역자활센터가 지자체에 대리 신청</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* 흐름도 제목 */}
              <div className="text-center mt-10">
                <h3 className="text-xl md:text-2xl font-bold text-ink-900">
                  <Highlight>자활사업 참여 흐름도</Highlight>
                </h3>
              </div>

              {/* 단계 카드 2×2 */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                <StepCard
                  no="01"
                  icon={<Handshake className="h-10 w-10 text-primary-600" aria-hidden="true" />}
                  title="참여 결정"
                  desc="지역자활센터 등 자활근로사업 등록"
                />
                <StepCard
                  no="02"
                  icon={<Users className="h-10 w-10 text-primary-600" aria-hidden="true" />}
                  title="게이트웨이"
                  desc="초기 상담·자활사업 안내·실습·자활 계획 수립(~3개월)"
                />
                <StepCard
                  no="03"
                  icon={<ClipboardCheck className="h-10 w-10 text-primary-600" aria-hidden="true" />}
                  title="자활근로"
                  desc="사업단 참여(~60개월)"
                />
                <StepCard
                  no="04"
                  icon={<Briefcase className="h-10 w-10 text-primary-600" aria-hidden="true" />}
                  title="취·창업"
                  desc="자활기업 창업 또는 취업 사후관리"
                />
              </div>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}
