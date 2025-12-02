// app/intro/history/page.tsx

"use client"

import { useState } from "react"
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import { historyData, type TimelineSection } from "@/data/history"

export default function HistoryPage() {
  const [hoveredEvent, setHoveredEvent] = useState<string | null>(null)

  return (
    <>
      <SkipLink />
      <Header />

      <SectionHero sectionKey="about" title="연혁" />

      <BreadcrumbBar
        topLabel="기관소개"
        topHref="/intro"
        currentLabel="연혁"
        siblingsOfTop={[{ label: "기관소개", href: "/intro" }]}
        siblingsOfCurrent={[
          { label: "인사말", href: "/intro/greeting" },
          { label: "모법인소개", href: "/intro/mother-foundation" },
          { label: "연혁", href: "/intro/history" },
          { label: "조직도", href: "/intro/organization" },
          { label: "오시는 길", href: "/intro/location" },
        ]}
      />

      <main
        id="main-content"
        className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-slate-50"
      >
        <div className="container mx-auto px-4 py-12 md:py-16 lg:py-20">
          <div className="max-w-5xl mx-auto">
            {/* 상단 타이틀 */}
            <div className="mb-10 md:mb-14 flex justify-center">
              <div className="relative inline-block text-center">
                {/* 좌상단 네이비 점 (간격만 조금 더 타이트하게 조정) */}
                <div
                  className="absolute -left-2 -top-1.5 h-2 w-2 rounded-full bg-[#1F3AA7]"
                  aria-hidden="true"
                />
                <h2 className="text-[26px] md:text-[40px] font-bold tracking-tight text-slate-900 leading-tight">
                  연혁
                </h2>
              </div>
            </div>

            {/* 타임라인 섹션 */}
            <div className="space-y-16 md:space-y-24">
              {historyData.map((section, sectionIndex) => (
                <TimelineSectionComponent
                  key={section.id}
                  section={section}
                  sectionIndex={sectionIndex}
                  hoveredEvent={hoveredEvent}
                  setHoveredEvent={setHoveredEvent}
                />
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  )
}

function TimelineSectionComponent({
  section,
  sectionIndex,
  hoveredEvent,
  setHoveredEvent,
}: {
  section: TimelineSection
  sectionIndex: number
  hoveredEvent: string | null
  setHoveredEvent: (id: string | null) => void
}) {
  const colors = {
    navy: {
      accent: "#1F3AA7",
      border: "border-blue-200",
      badgeBg: "bg-blue-50",
      badgeText: "text-blue-700",
      cardRing: "ring-blue-100",
    },
    teal: {
      accent: "#1AA6B3",
      border: "border-teal-200",
      badgeBg: "bg-teal-50",
      badgeText: "text-teal-700",
      cardRing: "ring-teal-100",
    },
    green: {
      accent: "#1FB86A",
      border: "border-green-200",
      badgeBg: "bg-green-50",
      badgeText: "text-green-700",
      cardRing: "ring-green-100",
    },
  } as const

  const theme = colors[section.color]

  return (
    <section aria-labelledby={`section-${section.id}`} className="relative">
      {/* 섹션 헤더: 미니멀 pill + 언더라인 */}
      <div className="mb-6 md:mb-8 flex justify-center">
        <div className="flex flex-col items-center gap-2">
          <span
            className={`
              inline-flex items-center rounded-full border px-4 py-1.5
              text-xs md:text-sm font-semibold tracking-wide
              ${theme.border}
            `}
            style={{ color: theme.accent }}
            id={`section-${section.id}`}
          >
            {section.title}
          </span>
          <span
            aria-hidden="true"
            className="h-[2px] w-16 rounded-full bg-slate-200"
          />
        </div>
      </div>

      {/* 타임라인 */}
      <div className="relative">
        {/* 세로 라인: 희미한 그라데이션 제거, 단색으로 정돈 */}
        <div
          className="absolute left-8 md:left-12 top-0 bottom-0 w-px bg-slate-200/80"
          aria-hidden="true"
        />

        <ol
          className="space-y-8 md:space-y-10"
          aria-label={`${section.title} timeline`}
        >
          {section.events.map((event, eventIndex) => {
            const eventId = `${section.id}-${eventIndex}`
            const isHovered = hoveredEvent === eventId

            return (
              <li
                key={eventIndex}
                className="relative pl-20 md:pl-28"
                onMouseEnter={() => setHoveredEvent(eventId)}
                onMouseLeave={() => setHoveredEvent(null)}
              >
                {/* Date Badge – 연도/월을 강조하는 미니멀 태그 */}
                <div
                  className={`
                    absolute left-0 top-0 max-w-[4.5rem] md:max-w-none
                    rounded-md border px-2.5 py-1 text-[10px] md:text-xs
                    font-semibold leading-snug whitespace-pre-line
                    shadow-[0_2px_6px_rgba(15,23,42,0.04)]
                    transition-transform duration-200
                    ${theme.badgeBg} ${theme.badgeText} ${theme.border}
                    ${isHovered ? "scale-105" : "scale-100"}
                  `}
                >
                  {event.date}
                </div>

                {/* Event Card – 미니멀 카드 + subtle ring */}
                <div
                  className={`
                    group relative rounded-xl border bg-white/95
                    p-4 md:p-5 shadow-sm
                    transition-all duration-200
                    ${event.highlight ? theme.border : "border-slate-200"}
                    ${isHovered ? "shadow-md ring-1 " + theme.cardRing : ""}
                  `}
                >
                  <p className="text-sm md:text-base leading-relaxed text-slate-700">
                    {event.description}
                  </p>

                  {event.highlight && (
                    <div
                      className="absolute -top-1.5 -right-1.5 h-2.5 w-2.5 rounded-full shadow-[0_0_0_4px_rgba(255,255,255,0.8)]"
                      style={{ backgroundColor: theme.accent }}
                      aria-hidden="true"
                    />
                  )}
                </div>
              </li>
            )
          })}
        </ol>
      </div>

      {/* 섹션 구분선 (마지막 제외) */}
      {sectionIndex < historyData.length - 1 && (
        <div className="mt-14 md:mt-18 flex justify-center" aria-hidden="true">
          <div className="flex items-center gap-2 text-slate-200">
            <div className="h-px w-10 bg-slate-200" />
            <div className="h-1.5 w-1.5 rounded-full bg-slate-200" />
            <div className="h-px w-10 bg-slate-200" />
          </div>
        </div>
      )}
    </section>
  )
}
