"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

type TabId = "gateway" | "case" | "asset"

const tabs: { id: TabId; label: string }[] = [
  { id: "gateway", label: "게이트웨이" },
  { id: "case", label: "사례관리" },
  { id: "asset", label: "자산형성" },
]

export function CaseTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("gateway")

  const handleKeyDown = (e: React.KeyboardEvent, tabId: TabId) => {
    const currentIndex = tabs.findIndex((t) => t.id === tabId)
    if (e.key === "ArrowRight") {
      e.preventDefault()
      const nextIndex = (currentIndex + 1) % tabs.length
      setActiveTab(tabs[nextIndex].id)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length
      setActiveTab(tabs[prevIndex].id)
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setActiveTab(tabId)
    }
  }

  return (
    <div>
      <div role="tablist" className="flex border-b border-border mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`panel-${tab.id}`}
            id={`tab-${tab.id}`}
            tabIndex={activeTab === tab.id ? 0 : -1}
            onClick={() => setActiveTab(tab.id)}
            onKeyDown={(e) => handleKeyDown(e, tab.id)}
            className={`px-6 py-3 font-semibold transition-colors min-h-[44px] ${
              activeTab === tab.id
                ? "border-b-2 border-primary-600 text-primary-600"
                : "text-ink-700 hover:text-primary-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div role="tabpanel" id={`panel-${activeTab}`} aria-labelledby={`tab-${activeTab}`} tabIndex={0}>
        {activeTab === "gateway" && <GatewayContent />}
        {activeTab === "case" && <CaseContent />}
        {activeTab === "asset" && <AssetContent />}
      </div>
    </div>
  )
}

/** ─────────────────────────────────────────────────────────
 *  게이트웨이
 *  ───────────────────────────────────────────────────────── */
function GatewayContent() {
  return (
    <div
      className="space-y-14"
      style={{ ["--brand-navy" as any]: "#0B1320", ["--brand-blue" as any]: "#1F3AA7" }}
      aria-label="게이트웨이(참여전 진입과정)"
    >
      <section
        className="relative max-w-4xl overflow-hidden rounded-2xl bg-white/60 px-6 py-8 ring-1 ring-primary-200/60 backdrop-blur"
        aria-label="게이트웨이 소개"
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.10]" aria-hidden={true}>
          <defs>
            <pattern id="gw-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className="fill-primary-700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#gw-dot-grid)" />
        </svg>

        <h2 className="relative z-[1] text-2xl md:text-3xl font-bold text-left">
          <span className="bg-gradient-to-r from-sky-600 via-primary-700 to-sky-600 bg-clip-text text-transparent">
            게이트웨이(참여전 진입과정)
          </span>
        </h2>

        <p className="relative z-[1] mt-3 text-[17px] leading-relaxed text-ink-800 md:text-xl text-left">
          자활사업 참여자의 <b>욕구, 적성, 능력, 여건</b>에 따라 개인별 맞춤형 자립계획 및 경로를 수립하고,
          <br className="hidden md:block" />
          적절한 자활프로그램 연계로 효과적인 자립을 지원하는 <b>경로설정 프로그램</b>입니다.
        </p>

        <div
          aria-hidden={true}
          className="relative z-[1] mt-4 h-[6px] w-24 rounded-full bg-gradient-to-r from-sky-300/70 via-primary-500/70 to-sky-300/70"
        />
      </section>

      <GatewayDetails />
    </div>
  )
}

function GatewayDetails() {
  return (
    <section aria-labelledby="gw-left-right-grid">
      <h3 id="gw-left-right-grid" className="sr-only">
        게이트웨이 상세
      </h3>

      <div className="md:grid md:grid-cols-2 md:grid-rows-2 md:gap-4">
        <div className="mb-6 md:mb-0">
          <h4 className="text-xl md:text-2xl font-semibold mb-3">사업대상자 · 기간</h4>
          <div className="max-w-prose">
            <div>
              <p className="font-semibold text-[color:var(--brand-navy)] mb-1">사업대상자</p>
              <ul className="text-sm text-[color:var(--brand-navy)]/70 space-y-1 list-disc pl-5">
                <li>자활사업 신규참여자</li>
                <li>기존 자활사업 참여자</li>
              </ul>
            </div>
            <div className="mt-3">
              <p className="font-semibold text-[color:var(--brand-navy)] mb-1">기간</p>
              <p className="text-sm text-[color:var(--brand-navy)]/70">
                게이트웨이 과정은 <b>2개월</b>을 기본으로 하며, <b>1개월</b>에 한해 연장 가능합니다.
              </p>
            </div>
          </div>
        </div>

        <GatewaySteps />

        <div className="mt-6 md:mt-0">
          <h4 className="text-xl md:text-2xl font-semibold mb-3">사업내용</h4>
          <ul className="max-w-prose text-sm text-[color:var(--brand-navy)]/80 space-y-1 list-disc pl-5">
            <li>개인별 자립지원계획 수립을 위한 상담</li>
            <li>개인별 자립경로에 따른 교육 및 실습 지원</li>
            <li>취업·창업·자활사업 지원 등 자립경로 설정</li>
            <li>자립 방해요소 해결을 위한 지원체계 구축</li>
          </ul>
        </div>
      </div>
    </section>
  )
}

function GatewaySteps() {
  return (
    <div className="md:col-start-2 md:row-span-2 md:self-stretch mb-6 md:mb-0">
      <h4 className="text-xl md:text-2xl font-semibold mb-6">단계</h4>
      <div className="relative">
        <div
          className="absolute left-[30px] w-0.5 bg-gradient-to-b from-[color:var(--brand-blue)]/20 via-[color:var(--brand-blue)]/40 to-[color:var(--brand-blue)]/20"
          style={{ top: "60px", bottom: "calc(100% - 60px - 16rem)" }}
          aria-hidden={true}
        />
        <ol className="space-y-5" role="list">
          {[
            {
              n: "01",
              title: "상담",
              items: ["초기상담(참여여부 결정)", "심층상담(정보수집, 근로장애요소 파악)"],
            },
            {
              n: "02",
              title: "계획수립 및 실행",
              items: ["IAP·ISP 계획 수립", "교육훈련 계획 실행"],
            },
            {
              n: "03",
              title: "연계",
              items: ["자활근로 참여 및 취업·창업 지원"],
            },
          ].map((s) => (
            <li key={s.n} className="relative">
              <div className="flex items-start gap-4">
                <div className="relative z-10 flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[color:var(--brand-blue)] to-[color:var(--brand-blue)]/80 shadow-lg shadow-[color:var(--brand-blue)]/25 ring-4 ring-white">
                  <span className="text-xl font-bold text-white">{s.n}</span>
                </div>
                <div className="flex-1 rounded-xl bg-white p-5 shadow-sm ring-1 ring-black/5 transition-all duration-300">
                  <h5 className="mb-3 text-lg font-bold text-[color:var(--brand-navy)]">{s.title}</h5>
                  <ul className="space-y-2 text-sm text-[color:var(--brand-navy)]/70">
                    {s.items.map((it) => (
                      <li key={it} className="flex items-start gap-2">
                        <span className="mt-1.5 block h-1.5 w-1.5 shrink-0 rounded-full bg-[color:var(--brand-blue)]/60" />
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  )
}

/** ─────────────────────────────────────────────────────────
 *  사례관리
 *  ───────────────────────────────────────────────────────── */
function CaseContent() {
  const Flow = CaseFlowDesktop
  return (
    <div
      className="space-y-12"
      style={{ ["--brand-navy" as any]: "#0B1320", ["--brand-blue" as any]: "#1F3AA7" }}
      aria-label="사례관리"
    >
      <section
        aria-labelledby="case-intro"
        className="relative max-w-5xl overflow-hidden rounded-2xl bg-white/60 px-6 py-7 ring-1 ring-primary-200/60 backdrop-blur"
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden={true}>
          <defs>
            <pattern id="case-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className="fill-primary-700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#case-dot-grid)" />
        </svg>

        <h2
          id="case-intro"
          className="relative z-[1] text-2xl md:text-3xl font-bold text-[color:var(--brand-navy)] mb-3"
        >
          <span className="bg-gradient-to-r from-sky-600 via-[color:var(--brand-blue)] to-sky-600 bg-clip-text text-transparent">
            사례관리
          </span>
        </h2>

        <p className="relative z-[1] text-base md:text-lg leading-relaxed text-ink-800 max-w-4xl">
          개인별 자활 지원 계획을 바탕으로 상담과 근로 기회를 제공하고,
          <br className="hidden md:block" />
          근로 의욕과 자존감을 모니터링하며 자립에 필요한 각종 서비스를 연계 지원하는 자활 프로그램입니다.
        </p>

        <div
          aria-hidden={true}
          className="relative z-[1] mt-4 h-[6px] w-28 rounded-full bg-gradient-to-r from-sky-300/70 via-primary-500/70 to-sky-300/70"
        />
      </section>

      <section aria-labelledby="case-flow" className="relative">
        <h3 id="case-flow" className="text-xl md:text-2xl font-semibold text-[color:var(--brand-navy)] mb-6">
          자활사례관리 순서도
        </h3>

        <div className="hidden xl:block">
          <Flow />
        </div>

        <div className="xl:hidden space-y-4" />
      </section>
    </div>
  )
}

/** Case flow desktop (기존 유지) */
function CaseFlowDesktop() {
  const sajeongRef = useRef<HTMLDivElement>(null)
  const iapRef = useRef<HTMLDivElement>(null)
  const greenBoxRef = useRef<HTMLDivElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const blueBarRef = useRef<HTMLDivElement>(null)
  const successNodeRef = useRef<HTMLDivElement>(null)
  const failureNodeRef = useRef<HTMLDivElement>(null)

  const [connectorPath, setConnectorPath] = useState<string>("")
  const [iapConnectorPath, setIapConnectorPath] = useState<string>("")
  const [blueBarWidth, setBlueBarWidth] = useState<number>(0)
  const [darkBarWidth, setDarkBarWidth] = useState<number>(0)

  useEffect(() => {
    const calculate = () => {
      if (!containerRef.current || !greenBoxRef.current) return

      const container = containerRef.current.getBoundingClientRect()
      const greenBox = greenBoxRef.current.getBoundingClientRect()

      if (sajeongRef.current) {
        const s = sajeongRef.current.getBoundingClientRect()
        const startX = s.left + s.width / 2 - container.left
        const startY = s.bottom - container.top + 6
        const endX = greenBox.left - container.left
        const endY = greenBox.top + greenBox.height / 2 - container.top
        const c1x = startX + (endX - startX) * 0.4
        const c2x = startX + (endX - startX) * 0.6
        setConnectorPath(`M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}`)
      }

      if (iapRef.current) {
        const i = iapRef.current.getBoundingClientRect()
        const startX = i.left + i.width / 2 - container.left
        const startY = i.bottom - container.top + 6
        const endX = greenBox.left - container.left
        const endY = greenBox.top + greenBox.height / 2 - container.top
        const c1x = startX + (endX - startX) * 0.4
        const c2x = startX + (endX - startX) * 0.6
        setIapConnectorPath(`M ${startX} ${startY} C ${c1x} ${startY}, ${c2x} ${endY}, ${endX} ${endY}`)
      }

      if (iapRef.current && blueBarRef.current && successNodeRef.current && failureNodeRef.current) {
        const i = iapRef.current.getBoundingClientRect()
        const blue = blueBarRef.current.getBoundingClientRect()
        const suc = successNodeRef.current.getBoundingClientRect()
        const fail = failureNodeRef.current.getBoundingClientRect()

        const iapRight = i.left + i.width - container.left
        const blueStart = blue.left - container.left
        setBlueBarWidth(iapRight - blueStart)

        const flowRight = Math.max(suc.right, fail.right) - container.left + 24
        setDarkBarWidth(Math.min(flowRight - blueStart, container.width))
      }
    }

    calculate()

    const ro = new ResizeObserver(calculate)
    if (containerRef.current) ro.observe(containerRef.current)
    if (sajeongRef.current) ro.observe(sajeongRef.current)
    if (iapRef.current) ro.observe(iapRef.current)
    if (greenBoxRef.current) ro.observe(greenBoxRef.current)

    window.addEventListener("resize", calculate)
    return () => {
      ro.disconnect()
      window.removeEventListener("resize", calculate)
    }
  }, [])

  return (
    <div ref={containerRef} className="relative pb-16">
      {/* 상단 배지 */}
      <div className="flex items-start gap-3 mb-8">
        <div className="group relative inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-blue)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--brand-blue)]">
          <span className="h-2 w-2 rounded-full bg-[color:var(--brand-blue)]" aria-hidden={true} />
          GateWay(2+1개월)
          <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-[color:var(--brand-blue)]/20 text-xs">
            ?
          </span>
        </div>
        <div className="inline-flex items-center gap-2 rounded-full bg-[color:var(--brand-navy)]/10 px-4 py-2 text-sm font-semibold text-[color:var(--brand-navy)]">
          <span className="h-2 w-2 rounded-full bg-[color:var(--brand-navy)]" aria-hidden={true} />
          자활사례관리
        </div>
      </div>

      {/* 커넥터 */}
      {(connectorPath || iapConnectorPath) && (
        <svg className="pointer-events-none absolute inset-0 h-full w-full" style={{ zIndex: 1 }} aria-hidden={true}>
          <defs>
            <marker
              id="connector-arrow"
              markerWidth="8"
              markerHeight="8"
              refX="7"
              refY="4"
              orient="auto"
              markerUnits="strokeWidth"
            >
              <path d="M 0 0 L 8 4 L 0 8 z" fill="rgb(31, 58, 167)" fillOpacity="0.5" />
            </marker>
            <style>{`
              @keyframes dash-flow {
                to { stroke-dashoffset: -20; }
              }
              .connector-animated {
                animation: dash-flow 1.5s linear infinite;
              }
            `}</style>
          </defs>
          {connectorPath && (
            <path
              d={connectorPath}
              fill="none"
              stroke="rgb(31, 58, 167)"
              strokeWidth="2"
              strokeOpacity="0.5"
              strokeDasharray="8 4"
              strokeLinecap="round"
              markerEnd="url(#connector-arrow)"
              className="connector-animated"
            />
          )}
          {iapConnectorPath && (
            <path
              d={iapConnectorPath}
              fill="none"
              stroke="rgb(31, 58, 167)"
              strokeWidth="2"
              strokeOpacity="0.5"
              strokeDasharray="8 4"
              strokeLinecap="round"
              markerEnd="url(#connector-arrow)"
              className="connector-animated"
            />
          )}
        </svg>
      )}

      <FlowNodes
        refs={{ sajeongRef, iapRef, greenBoxRef, successNodeRef, failureNodeRef }}
        bars={{ blueBarRef, blueBarWidth, darkBarWidth }}
      />
    </div>
  )
}

function FlowNodes({
  refs,
  bars,
}: {
  refs: {
    sajeongRef: React.RefObject<HTMLDivElement>
    iapRef: React.RefObject<HTMLDivElement>
    greenBoxRef: React.RefObject<HTMLDivElement>
    successNodeRef: React.RefObject<HTMLDivElement>
    failureNodeRef: React.RefObject<HTMLDivElement>
  }
  bars: {
    blueBarRef: React.RefObject<HTMLDivElement>
    blueBarWidth: number
    darkBarWidth: number
  }
}) {
  const { sajeongRef, iapRef, greenBoxRef, successNodeRef, failureNodeRef } = refs
  const { blueBarRef, blueBarWidth, darkBarWidth } = bars

  return (
    <>
      <div className="relative flex items-start gap-2" style={{ zIndex: 2 }}>
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="rounded-xl bg-white px-4 py-3 shadow-md ring-1 ring-[color:var(--brand-blue)]/30 w-[130px]">
            <p className="text-sm font-semibold text-[color:var(--brand-navy)] text-center leading-snug">
              신규참여자
              <br />
              의뢰·배치
            </p>
          </div>
        </div>
        <Arrow />
        <div className="flex flex-col items-center gap-3 flex-shrink-0">
          <div className="rounded-xl bg-white px-4 py-3 shadow-md ring-1 ring-[color:var(--brand-blue)]/30 w-[150px]">
            <p className="text-sm font-semibold text-[color:var(--brand-navy)] text-center leading-snug">
              초기상담 및
              <br />
              진단·평가·기초교육
            </p>
          </div>
          <div
            ref={sajeongRef}
            className="rounded-xl bg-white px-4 py-3 shadow-md ring-1 ring-[color:var(--brand-blue)]/30 w-[150px]"
          >
            <p className="text-sm font-semibold text-[color:var(--brand-navy)] text-center">사정</p>
          </div>
        </div>
        <Arrow />
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div
            ref={iapRef}
            className="rounded-xl bg-white px-4 py-3 shadow-md ring-1 ring-[color:var(--brand-blue)]/30 w-[130px]"
          >
            <p className="text-sm font-semibold text-[color:var(--brand-navy)] text-center leading-snug">
              IAP·ISP 수립,
              <br />
              교육훈련
            </p>
          </div>
        </div>
        <Arrow />
        <div className="flex flex-col items-center gap-2 flex-shrink-0">
          <div className="rounded-xl bg-gradient-to-br from-[color:var(--brand-navy)] to-[color:var(--brand-navy)]/90 px-4 py-4 shadow-lg w-[200px]">
            <p className="text-sm font-bold text-white text-center mb-3">자활프로그램 제공</p>
            <div className="space-y-2 mb-3">
              {["자활근로(리더/참여)", "취업 연계 취업 지원", "개인 창업 지원", "직업훈련 지원"].map((t) => (
                <div key={t} className="rounded-lg bg-white/95 px-3 py-2">
                  <p className="text-xs font-medium text-[color:var(--brand-navy)]">{t}</p>
                </div>
              ))}
            </div>
            <div ref={greenBoxRef} className="rounded-lg bg-emerald-500/90 px-3 py-2">
              <p className="text-xs font-medium text-white leading-snug">
                타 자활프로그램 참여 의뢰, 지역사회 복지서비스 연계
              </p>
            </div>
          </div>
        </div>
        <Arrow />
        <div className="flex flex-col items-start gap-4 flex-shrink-0">
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-emerald-50 px-4 py-3 shadow-md ring-1 ring-emerald-200 w-[120px]">
              <p className="text-sm font-bold text-emerald-800 text-center">자활 성공</p>
            </div>
            <Arrow colorClass="text-emerald-600" />
            <div
              ref={successNodeRef}
              className="rounded-xl bg-emerald-100 px-4 py-3 shadow-md ring-1 ring-emerald-300 w-[100px]"
            >
              <p className="text-sm font-semibold text-emerald-900 text-center">사후 관리</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="rounded-xl bg-amber-50 px-4 py-3 shadow-md ring-1 ring-amber-200 w-[120px]">
              <p className="text-sm font-bold text-amber-800 text-center leading-snug">
                자활 실패
                <span className="block text-xs font-normal text-amber-700 mt-1">(실패 원인분석 등 평가)</span>
              </p>
            </div>
            <Arrow colorClass="text-amber-600" />
            <div
              ref={failureNodeRef}
              className="rounded-xl bg-amber-100 px-4 py-3 shadow-md ring-1 ring-amber-300 w-[180px]"
            >
              <p className="text-xs font-semibold text-amber-900 text-center leading-snug">
                상담 및 IAP·ISP 재수립 후
                <br />
                적절 프로그램 제공
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 진행바 */}
      <div className="absolute bottom-0 left-0 right-0 space-y-2">
        <div className="flex items-center gap-2">
          <div
            ref={blueBarRef}
            className="h-3 rounded-full bg-[color:var(--brand-blue)]/30 transition-all duration-300"
            style={{ width: blueBarWidth > 0 ? `${blueBarWidth}px` : "35%" }}
          >
            <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--brand-blue)] to-[color:var(--brand-blue)]/70" />
          </div>
          <span className="text-xs font-medium text-[color:var(--brand-blue)]">GateWay</span>
        </div>
        <div className="flex items-center gap-2">
          <div
            className="h-4 rounded-full bg-[color:var(--brand-navy)]/20 transition-all duration-300"
            style={{ width: darkBarWidth > 0 ? `${darkBarWidth}px` : "100%" }}
          >
            <div className="h-full rounded-full bg-gradient-to-r from-[color:var(--brand-navy)] via-[color:var(--brand-navy)]/80 to-[color:var(--brand-navy)]/60" />
          </div>
          <span className="text-xs font-semibold text-[color:var(--brand-navy)] whitespace-nowrap">자활사례관리</span>
        </div>
      </div>
    </>
  )
}

function Arrow({ colorClass = "text-[color:var(--brand-blue)]" }: { colorClass?: string }) {
  return (
    <div className="flex items-center pt-6 flex-shrink-0">
      <svg className={`h-5 w-5 ${colorClass}`} fill="none" viewBox="0 0 24 24" aria-hidden={true}>
        <path
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M13 7l5 5m0 0l-5 5m5-5H6"
        />
      </svg>
    </div>
  )
}

/** ─────────────────────────────────────────────────────────
 *  자산형성 — 인트로 3줄 + 라벨 통일 + 3년 적립액 문구 정렬 + 연락처 수정
 *  ───────────────────────────────────────────────────────── */
function AssetContent() {
  return (
    <div
      className="space-y-12"
      aria-label="자산형성"
      style={{ ["--brand-navy" as any]: "#0B1320", ["--brand-blue" as any]: "#1F3AA7" }}
    >
      {/* 인트로 */}
      <section
        className="relative max-w-5xl overflow-hidden rounded-2xl bg-white/60 px-8 py-8 ring-1 ring-primary-200/60 backdrop-blur"
        aria-labelledby="asset-intro-title"
      >
        <svg className="pointer-events-none absolute inset-0 h-full w-full opacity-[0.06]" aria-hidden={true}>
          <defs>
            <pattern id="asset-dot-grid" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="1" className="fill-primary-700" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#asset-dot-grid)" />
        </svg>

        <h2
          id="asset-intro-title"
          className="relative z-[1] text-2xl md:text-3xl font-bold text-[color:var(--brand-navy)] mb-4"
        >
          <span className="bg-gradient-to-r from-sky-600 via-[color:var(--brand-blue)] to-sky-600 bg-clip-text text-transparent">
            자산형성
          </span>
        </h2>

        <div className="relative z-[1] space-y-1 text-base md:text-lg leading-relaxed text-ink-800 max-w-4xl">
          <p>일하는 수급가구 및 비수급 근로빈곤층의 자활을 위한 자금으로서 목돈을 마련할 수 있도록 돕는 제도입니다.</p>
          <p>
            자산형성지원사업은 공통적으로 본인이 매월 일정하게 저축한 금액에 정부와 지자체가 지원금을 추가로 지원하여
          </p>
          <p>자립을 위한 목돈을 마련할 수 있도록 지원해줍니다.</p>
        </div>

        <div
          aria-hidden={true}
          className="relative z-[1] mt-6 h-[6px] w-28 rounded-full bg-gradient-to-r from-sky-300/70 via-primary-500/70 to-sky-300/70"
        />
      </section>

      {/* 자산형성 프로그램 상세 */}
      <section aria-labelledby="asset-programs" className="space-y-6">
        <h3 id="asset-programs" className="text-xl md:text-2xl font-bold text-[color:var(--brand-navy)]">
          자산형성 프로그램 상세
        </h3>

        <div className="grid md:grid-cols-2 gap-8">
          {[
            {
              // 1. 희망저축계좌Ⅰ
              name: "희망저축계좌Ⅰ",
              target: "일하는 생계·의료 수급가구",
              deposit: "월 10만원 이상 자율저축 (최대 50만원)",
              matching: "월 30만원",
              total: "1,440만원 + 이자\n* 본인저축 360만원 포함",
              bonus: "탈수급 장려금 / 내일키움장려금 / 내일키움수익금",
              condition:
                "전액지급: 3년 이내 생계·의료 탈수급 시\n일부지급: 만기 후 탈수급 실패 시 만기성공금(근로소득장려금 누적액의 5%) 지급",
            },
            {
              // 2. 희망저축계좌Ⅱ
              name: "희망저축계좌Ⅱ",
              target: "일하는 주거·교육 수급가구 및 기타 차상위 계층 가구",
              deposit: "월 10만원 이상 자율저축 (최대 50만원)",
              matching: "월 10만원",
              total: "720만원 + 이자 ('25년 이전 가입자)\n* 본인저축 360만원 포함",
              bonus: "내일키움장려금 / 내일키움수익금",
              condition: "자립역량교육(10시간) 이수 및 자금사용계획서 제출 시 지급",
              note: "'25년 가입자부터 1차년도 10만원, 2차년도 20만원, 3차년도 30만원 지원으로 총 1,080만원 지원",
            },
            {
              // 3. 청년내일저축계좌 (차상위 이하)
              name: "청년내일저축계좌 (차상위 이하)",
              target: "일하는 생계·의료·주거·교육급여 수급가구 및 기타 차상위 가구 청년 (만 15~39세)",
              deposit: "월 10만원 이상 자율저축 (최대 50만원)",
              matching: "월 30만원",
              total: "1,440만원 + 이자\n* 본인저축 360만원 포함",
              bonus: "근로소득공제금 / 탈수급 장려금 / 내일키움장려금",
              condition: "자립역량교육(10시간) 이수 및 자금사용계획서 제출 등 요건 충족 시 지급",
            },
            {
              // 4. 청년내일저축계좌 (차상위 초과)
              name: "청년내일저축계좌 (차상위 초과)",
              target: "일하는 기준중위소득 50% 초과 ~ 100% 이하 가구 청년 (만 19~34세)",
              deposit: "월 10만원 이상 자율저축 (최대 50만원)",
              matching: "월 10만원",
              total: "720만원 + 이자\n* 본인저축 360만원 포함",
              bonus: "근로소득공제금 / 탈수급 장려금 / 내일키움장려금",
              condition: "자립역량교육(10시간) 이수 및 자금사용계획서 제출 등 요건 충족 시 지급",
            },
          ].map((program, idx) => (
            <div
              key={idx}
              className="rounded-xl bg-white p-8 ring-1 ring-black/10 hover:ring-[color:var(--brand-blue)]/30 hover:shadow-lg transition-all min-h-[560px]"
            >
              <h4 className="text-xl font-bold text-[color:var(--brand-navy)] mb-5 pb-4 border-b-2 border-black/10">
                {program.name}
              </h4>
              <dl className="space-y-5 text-base whitespace-pre-line leading-relaxed">
                <div>
                  <dt className="font-bold text-[color:var(--brand-navy)] mb-2 text-base">가입 대상</dt>
                  <dd className="text-ink-800 leading-[1.8]">{program.target}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[color:var(--brand-navy)] mb-2 text-base">월 본인 저축액</dt>
                  <dd className="text-ink-800 leading-[1.8]">{program.deposit}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[color:var(--brand-navy)] mb-2 text-base">정부 지원액</dt>
                  <dd className="text-ink-800 leading-[1.8]">{program.matching}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[color:var(--brand-navy)] mb-2 text-base">
                    3년 적립액(10만원 저축 시)
                  </dt>
                  <dd className="text-ink-900 font-semibold leading-[1.8]">{program.total}</dd>
                </div>
                <div>
                  <dt className="font-bold text-[color:var(--brand-navy)] mb-2 text-base">추가지원금(정책대상별)</dt>
                  <dd className="text-ink-800 leading-[1.8]">{program.bonus}</dd>
                </div>
                <div className="pt-4 border-t-2 border-black/10">
                  <dt className="font-bold text-[color:var(--brand-navy)] mb-2 text-base">지급 조건</dt>
                  <dd className="text-ink-800 leading-[1.9]">{program.condition}</dd>
                </div>
                {"note" in program && program.note && (
                  <div className="pt-3">
                    <dd className="text-sm text-ink-700 leading-[1.8] bg-amber-50/50 p-3 rounded-lg">
                      ※ {program.note}
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          ))}
        </div>
      </section>

      {/* 추가 안내 */}
      <section aria-labelledby="asset-footer" className="rounded-xl bg-sky-50/50 p-6 ring-1 ring-sky-200/50">
        <h4 id="asset-footer" className="sr-only">
          추가 안내사항
        </h4>
        <div className="flex items-start gap-3">
          <svg
            className="h-6 w-6 text-sky-600 flex-shrink-0 mt-0.5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden={true}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M12 2a10 10 0 100 20 10 10 0 000-20z"
            />
          </svg>
          <div className="space-y-2">
            <p className="text-sm font-medium text-ink-900">
              자산형성 프로그램에 대한 자세한 상담이 필요하신 경우, 거제지역자활센터로 문의해 주세요.
            </p>
            <p className="text-sm text-ink-700">
              전화: <span className="font-semibold">055-688-5890</span> | 방문 상담 가능
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
