// components/workfare-tabs.tsx
"use client"

import type React from "react"
import { useState } from "react"
import Image from "next/image"
import {
  // 시장진입형 (별칭으로 안전하게 import)
  marketEntries as _marketEntries,
  marketSharedDescription as _marketSharedDescription,
  retailEntries as _retailEntries,
  retailSharedDescription as _retailSharedDescription,
  laundryEntry as _laundryEntry,
  // 인턴·도우미형 데이터
  internHelperEntry,
} from "@/data/workfare"
import { MapPin, Users, Phone, ExternalLink, Tag, Handshake } from "lucide-react"

type TabId = "market" | "service" | "intern"

const tabs: { id: TabId; label: string }[] = [
  { id: "market", label: "시장진입형" },
  { id: "service", label: "사회서비스형" },
  { id: "intern", label: "인턴&도우미형" },
]

// 시장진입형 + 로컬사업단 공통 이미지 오버라이드
const MARKET_IMAGE_OVERRIDES: Record<string, string[]> = {
  두동식당: ["/new1.png", "/dodong11.jpg"],
  희망도시락: ["/new2.png", "/h1.png"],
  햇살바른김거제점: ["/new3.png", "/slide5.jpg"],
  GS연초신우점: ["/new4.png", "/sinugs.jpg"],
  "로컬푸드직매장 & 스마트팜카페(거제로컬누리센터 중곡점)": ["/new5.png", "/smart1.jpg"],
  건강도시락: ["/new6.png", "/g1.jpg"],
}

export function WorkfareTabs() {
  const [activeTab, setActiveTab] = useState<TabId>("market")

  const handleKeyDown = (e: React.KeyboardEvent, tabId: TabId) => {
    const idx = tabs.findIndex((t) => t.id === tabId)
    if (e.key === "ArrowRight") {
      e.preventDefault()
      setActiveTab(tabs[(idx + 1) % tabs.length].id)
    } else if (e.key === "ArrowLeft") {
      e.preventDefault()
      setActiveTab(tabs[(idx - 1 + tabs.length) % tabs.length].id)
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      setActiveTab(tabId)
    }
  }

  return (
    <section aria-label="자활근로 유형 안내" className="mb-12">
      {/* 탭 영역: 중앙 정렬 + 아래 여백 확대 (데스크톱에서 약간 우측으로 이동) */}
      <div role="tablist" className="flex justify-center border-b border-border mb-20 md:translate-x-[15px]">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={activeTab === tab.id}
            aria-controls={`workfare-panel-${tab.id}`}
            id={`workfare-tab-${tab.id}`}
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

      <div
        role="tabpanel"
        id={`workfare-panel-${activeTab}`}
        aria-labelledby={`workfare-tab-${activeTab}`}
        tabIndex={0}
        className="space-y-10"
      >
        {activeTab === "market" && <MarketContent />}
        {activeTab === "service" && <ServiceContent />}
        {activeTab === "intern" && <InternContent />}
      </div>
    </section>
  )
}

/* ===================== 시장진입형 ===================== */

function MarketContent() {
  const market = Array.isArray(_marketEntries) ? _marketEntries : []
  const retail = Array.isArray(_retailEntries) ? _retailEntries : []
  const laundry =
    _laundryEntry && typeof _laundryEntry === "object"
      ? _laundryEntry
      : {
          name: "찾아가는빨래방",
          description: [] as string[],
          areas: [] as string[],
          phones: [] as string[],
          image: undefined as string | undefined,
        }

  const marketDesc = typeof _marketSharedDescription === "string" ? _marketSharedDescription : ""
  const retailDesc = typeof _retailSharedDescription === "string" ? _retailSharedDescription : ""

  return (
    <div className="space-y-10">
      {/* 섹션 1: 식품·도시락·가공 */}
      <section className="space-y-6">
        <header className="space-y-4 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-primary-100 bg-primary-50 px-5 py-2">
            <h3 className="text-base font-semibold text-primary-900">희망도시락사업단</h3>
          </div>
          {/* 가운데 큰 제목(희망도시락) 제거 */}
          {marketDesc ? <p className="text-sm md:text-base text-ink-700">{marketDesc}</p> : null}
        </header>

        {market.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center">등록된 항목이 없습니다.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {market.map((item) => {
              const overrideImages = MARKET_IMAGE_OVERRIDES[item.name]
              const images = overrideImages ?? (item.image ? [item.image] : [])

              return (
                <li
                  key={item.name}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  {images.length > 0 && (
                    <div className="relative w-full h-[500px]">
                      <MarketImageCarousel images={images} alt={item.name} />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5 space-y-3">
                    <h4 className="text-lg font-bold text-ink-900 text-center">{item.name}</h4>

                    {Array.isArray(item.activities) && item.activities.length > 0 ? (
                      <ul className="text-ink-700 text-sm space-y-1 text-center">
                        {item.activities.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    ) : null}

                    {/* 주소/전화: 카드 하단 고정 */}
                    {(item.address || item.phone) && (
                      <div className="mt-auto pt-3 text-sm text-ink-700 space-y-1">
                        {item.address ? (
                          <div className="grid grid-cols-[1.2rem_auto] gap-x-1 items-center justify-center">
                            <span aria-hidden className="text-center leading-6">
                              📍
                            </span>
                            <span className="truncate">{item.address}</span>
                          </div>
                        ) : null}
                        {item.phone ? (
                          <div className="grid grid-cols-[1.2rem_auto] gap-x-1 items-center justify-center">
                            <span aria-hidden className="text-center leading-6">
                              ☎
                            </span>
                            <a
                              href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`}
                              className="relative top-[2px] underline hover:text-primary-700 font-mono tabular-nums"
                            >
                              {item.phone}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <SectionDivider />

      {/* 섹션 2: 로컬사업단 */}
      <section className="space-y-6">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-primary-100 bg-primary-50 px-5 py-2">
            <h3 className="text-base font-semibold text-primary-900">로컬사업단</h3>
          </div>
          {retailDesc ? <p className="text-sm md:text-base text-ink-700">{retailDesc}</p> : null}
        </header>

        {retail.length === 0 ? (
          <p className="text-sm text-neutral-500 text-center">등록된 항목이 없습니다.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2">
            {retail.map((item) => {
              const overrideImages = MARKET_IMAGE_OVERRIDES[item.name]
              const fallbackImages = item.image ? [item.image] : []
              const images = overrideImages ?? fallbackImages

              return (
                <li
                  key={item.name}
                  className="flex h-full flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm"
                >
                  {images.length > 0 && (
                    <div className="relative w-full h-[500px]">
                      <MarketImageCarousel images={images} alt={item.name} />
                    </div>
                  )}

                  <div className="flex flex-1 flex-col p-5 space-y-3">
                    <h4 className="text-lg font-bold text-ink-900 text-center">{item.name}</h4>

                    {Array.isArray(item.activities) && item.activities.length > 0 ? (
                      <ul className="text-ink-700 text-sm space-y-1 text-center">
                        {item.activities.map((line, idx) => (
                          <li key={idx}>{line}</li>
                        ))}
                      </ul>
                    ) : null}

                    {(item.address || item.phone) && (
                      <div className="mt-auto pt-3 text-sm text-ink-700 space-y-1">
                        {item.address ? (
                          <div className="grid grid-cols-[1.2rem_auto] gap-x-1 items-center justify-center">
                            <span aria-hidden className="text-center leading-6">
                              📍
                            </span>
                            <span className="truncate">{item.address}</span>
                          </div>
                        ) : null}
                        {item.phone ? (
                          <div className="grid grid-cols-[1.2rem_auto] gap-x-1 items-center justify-center">
                            <span aria-hidden className="text-center leading-6">
                              ☎
                            </span>
                            <a
                              href={`tel:${item.phone.replace(/[^0-9+]/g, "")}`}
                              className="relative top-[2px] underline hover:text-primary-700 font-mono tabular-nums"
                            >
                              {item.phone}
                            </a>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </section>

      <SectionDivider />

      {/* 섹션 3: 찾아가는빨래방 */}
      <section className="space-y-6">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-primary-100 bg-primary-50 px-5 py-2">
            <h3 className="text-base font-semibold text-primary-900">{laundry.name ?? "찾아가는빨래방"}</h3>
          </div>
        </header>

        <div className="max-w-4xl mx-auto rounded-2xl border border-border bg-white shadow-sm overflow-hidden">
          {laundry.image ? (
            <div className="relative w-full h-[500px]">
              <Image
                src={laundry.image || "/placeholder.svg"}
                alt={laundry.name ?? "찾아가는빨래방"}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 768px"
              />
            </div>
          ) : null}

          <div className="flex flex-col p-8 space-y-5 text-center">
            <div className="space-y-2">
              {Array.isArray(laundry.description) && laundry.description.length > 0
                ? laundry.description.map((line, i) => (
                    <p key={i} className="text-ink-700">
                      {line}
                    </p>
                  ))
                : null}
            </div>

            {Array.isArray(laundry.areas) && laundry.areas.length > 0 ? (
              <div className="flex flex-wrap items-center justify-center gap-2">
                {laundry.areas.map((area) => (
                  <span key={area} className="px-3 py-1 rounded-full bg-primary-50 text-primary-700 text-sm">
                    {area}
                  </span>
                ))}
              </div>
            ) : null}

            {Array.isArray(laundry.phones) && laundry.phones.length > 0 ? (
              <div className="mt-auto flex flex-wrap items-center justify-center gap-4 text-sm">
                {laundry.phones.map((p) => (
                  <a key={p} href={`tel:${p.replace(/[^-0-9]/g, "")}`} className="underline hover:text-primary-700">
                    ☎ {p}
                  </a>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </section>
    </div>
  )
}

/* 시장진입형 전용 이미지 슬라이더 */
function MarketImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : []
  const [index, setIndex] = useState(0)

  if (safeImages.length === 0) return null

  const total = safeImages.length
  const current = safeImages[index % total]

  const go = (delta: number) => {
    setIndex((prev) => (prev + delta + total) % total)
  }

  return (
    <div className="relative h-full w-full">
      <Image
        src={current || "/placeholder.svg"}
        alt={alt}
        fill
        className="object-cover"
        sizes="(max-width: 640px) 100vw, 50vw"
      />
      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="이전 이미지"
            onClick={() => go(-1)}
            className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink-900 shadow hover:bg-white"
          >
            &lt;
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            onClick={() => go(1)}
            className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink-900 shadow hover:bg-white"
          >
            &gt;
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1">
            {safeImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                aria-hidden
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ===================== 사회서비스형 ===================== */

type ServiceBox = {
  id: string
  text: string
  images: string[]
  address: string
  phone: string
}

function ServiceContent() {
  // 섹션 1: 농축사업단 (3박스)
  const agriBoxes: ServiceBox[] = [
    {
      id: "agri-1",
      text: "GAP 및 로컬푸드 인증받은 안전한 먹거리를 생산하여 지역에 공급하고 어린이집 농산물 수확 체험학습장으로 활용합니다.",
      images: ["/bb1.jpg", "/bb2.png"],
      address: "사등면 두동로 1길 109",
      phone: "055-688-5890",
    },
    {
      id: "agri-2",
      text: "지역내 신선한 농산물을 소분 전처리하여 급식재료로 납품하여 아이들의 식습관 개선과 건강을 책임집니다.",
      // new7.png 추가
      images: ["/new7.png", "/bb3.png", "/bb4.png", "/bb5.png"],
      address: "거제시 농업기술센터 내",
      phone: "055-688-5890",
    },
    {
      id: "agri-3",
      text: "애완동물 간식 제조",
      images: ["/bb6.png", "/bb7.png"],
      address: "상동 11길 9",
      phone: "055-688-5890",
    },
  ]

  // 섹션 2: 비움사업단 (3박스)
  const bioumBoxes: ServiceBox[] = [
    {
      id: "bioum-1",
      text: "기부나눔마켓 「리본」\n제로웨이스트샵 「비움」",
      images: ["/cc1.png", "/cc2.png"],
      address: "옥포로 23길 5",
      phone: "055-687-5891",
    },
    {
      id: "bioum-2",
      text: "문서파쇄\n우드카빙",
      // new8.png 추가
      images: ["/new8.png", "/cc3.png", "/cc4.png", "/cc5.png"],
      address: "사등면 두동로1길 109",
      phone: "055-688-5890",
    },
    {
      id: "bioum-3",
      text: "플라스틱업사이클\n뜨개, 라탄, 미싱",
      // new9.png 추가
      images: ["/new9.png", "/cc6.png", "/cc7.png", "/cc8.png", "/cc1010.png", "/cc11.png"],
      address: "연초면 연하해안로 98",
      phone: "055-688-5890",
    },
  ]

  // 섹션 3: 블루클리닝
  // new10.png, new11.png 추가
  const blueCleaningImages = ["/new10.png", "/dd1.jpg", "/dd222.png", "/new11.png"]
  const blueCleaningText =
    "거제 관내 중소사업장 노동자들의 작업복세탁을 지원하여 유해물질로부터 노동자와 가족의 건강을 보호합니다."
  const blueCleaningAddress = "연초면 소오비길 30"
  const blueCleaningPhone = "055-635-1008"

  return (
    <div className="space-y-12">
      {/* 섹션 1: 농축사업단 */}
      <section aria-labelledby="agri-section-heading" className="space-y-8">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-primary-100 bg-primary-50 px-5 py-2">
            <h3 id="agri-section-heading" className="text-base font-semibold text-primary-900">
              농축사업단
            </h3>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {agriBoxes.map((box) => (
            <article
              key={box.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
            >
              <div className="relative w-full h-64 md:h-72">
                <ServiceImageCarousel images={box.images} alt={box.text} />
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <p className="text-sm leading-relaxed text-ink-800 whitespace-pre-line text-center">{box.text}</p>
                <div className="mt-auto pt-4 text-xs text-ink-700 space-y-1">
                  <div className="grid grid-cols-[1.1rem_auto] gap-x-1 items-center justify-center">
                    <span aria-hidden className="text-center leading-5">
                      📍
                    </span>
                    <span>{box.address}</span>
                  </div>
                  <div className="grid grid-cols-[1.1rem_auto] gap-x-1 items-center justify-center">
                    <span aria-hidden className="text-center leading-5">
                      ☎
                    </span>
                    <a
                      href={`tel:${box.phone.replace(/[^0-9]/g, "")}`}
                      className="underline hover:text-primary-700 font-mono tabular-nums"
                    >
                      {box.phone}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* 섹션 2: 비움사업단 */}
      <section aria-labelledby="bioum-section-heading" className="space-y-8">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-primary-100 bg-primary-50 px-5 py-2">
            <h3 id="bioum-section-heading" className="text-base font-semibold text-primary-900">
              비움사업단
            </h3>
          </div>
        </header>

        <div className="grid gap-6 md:grid-cols-3">
          {bioumBoxes.map((box) => (
            <article
              key={box.id}
              className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm"
            >
              <div className="relative w-full h-64 md:h-72">
                <ServiceImageCarousel images={box.images} alt={box.text} />
              </div>
              <div className="flex flex-1 flex-col p-4 md:p-5">
                <p className="text-sm leading-relaxed text-ink-800 whitespace-pre-line text-center">{box.text}</p>
                <div className="mt-auto pt-4 text-xs text-ink-700 space-y-1">
                  <div className="grid grid-cols-[1.1rem_auto] gap-x-1 items-center justify-center">
                    <span aria-hidden className="text-center leading-5">
                      📍
                    </span>
                    <span>{box.address}</span>
                  </div>
                  <div className="grid grid-cols-[1.1rem_auto] gap-x-1 items-center justify-center">
                    <span aria-hidden className="text-center leading-5">
                      ☎
                    </span>
                    <a
                      href={`tel:${box.phone.replace(/[^0-9]/g, "")}`}
                      className="underline hover:text-primary-700 font-mono tabular-nums"
                    >
                      {box.phone}
                    </a>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <SectionDivider />

      {/* 섹션 3: 블루클리닝 */}
      <section aria-labelledby="bluecleaning-heading" className="space-y-8">
        <header className="space-y-3 text-center">
          <div className="inline-flex items-center justify-center rounded-full border border-primary-100 bg-primary-50 px-5 py-2">
            <h3 id="bluecleaning-heading" className="text-base font-semibold text-primary-900">
              블루클리닝
            </h3>
          </div>
        </header>

        <div className="max-w-5xl mx-auto">
          <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
            <div className="relative w-full h-[308px] md:h-[440px]">
              <ServiceImageCarousel images={blueCleaningImages} alt={blueCleaningText} />
            </div>

            <div className="flex flex-1 flex-col p-5 md:p-6">
              <p className="text-sm leading-relaxed text-ink-800 text-center">{blueCleaningText}</p>

              <div className="mt-auto pt-4 text-xs text-ink-700 space-y-1 text-center">
                <div className="flex items-center justify-center gap-1">
                  <span aria-hidden>📍</span>
                  <span>{blueCleaningAddress}</span>
                </div>
                <div className="flex items-center justify-center gap-1">
                  <span aria-hidden>☎</span>
                  <a
                    href={`tel:${blueCleaningPhone.replace(/[^0-9]/g, "")}`}
                    className="underline hover:text-primary-700 font-mono tabular-nums"
                  >
                    {blueCleaningPhone}
                  </a>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>
    </div>
  )
}

// ===== 사회서비스형 공통: 이미지 슬라이더 =====
function ServiceImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const safeImages = Array.isArray(images) && images.length > 0 ? images : ["/cc1.png"]
  const [index, setIndex] = useState(0)
  const total = safeImages.length
  const current = safeImages[index % total]

  const go = (delta: number) => {
    setIndex((prev) => (prev + delta + total) % total)
  }

  // 블러 + 비율 유지가 필요한 이미지들만 따로 처리
  const needsBlurBackground = [
    "/cc8.png",
    "/cc1010.png",
    "/cc11.png",
    "/dd222.png",
    "/new11.png", // 세로 블루클리닝 이미지
  ].includes(current)

  const isSplitBanner = current === "/new11.png"

  // 1) 일반 카드
  if (!needsBlurBackground) {
    return (
      <div className="relative h-full w-full">
        <Image
          src={current || "/placeholder.svg"}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
        />
        {total > 1 && (
          <>
            <button
              type="button"
              aria-label="이전 이미지"
              onClick={() => go(-1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink-900 shadow hover:bg-white"
            >
              &lt;
            </button>
            <button
              type="button"
              aria-label="다음 이미지"
              onClick={() => go(1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-ink-900 shadow hover:bg-white"
            >
              &gt;
            </button>
            <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1">
              {safeImages.map((_, i) => (
                <span
                  key={i}
                  className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                  aria-hidden
                />
              ))}
            </div>
          </>
        )}
      </div>
    )
  }

  return (
    <div className="relative h-full w-full overflow-hidden">
      {/* 블러 배경 */}
      <Image
        src={current || "/placeholder.svg"}
        alt=""
        aria-hidden
        fill
        className="absolute inset-0 z-0 scale-110 object-cover blur-xl"
        sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
      />

      {/* 가운데 원본 이미지 (비율 유지) */}
      <div className="relative z-10 flex h-full w-full items-center justify-center">
        {isSplitBanner ? (
          <div className="flex h-[80%] w-[90%] gap-2">
            <div className="relative flex-1">
              <Image
                src="/new12.png"
                alt="블루클리닝 상단"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, (min-width: 769px) 16vw"
              />
            </div>
            <div className="relative flex-1">
              <Image
                src="/new13.png"
                alt="블루클리닝 하단"
                fill
                className="object-contain"
                sizes="(max-width: 768px) 50vw, (min-width: 769px) 16vw"
              />
            </div>
          </div>
        ) : (
          <div className="relative h-[80%] w-[90%]">
            <Image
              src={current || "/placeholder.svg"}
              alt={alt}
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, (min-width: 769px) 33vw"
            />
          </div>
        )}
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="이전 이미지"
            onClick={() => go(-1)}
            className="absolute left-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xs text-ink-900 shadow hover:bg-white"
          >
            &lt;
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            onClick={() => go(1)}
            className="absolute right-1 top-1/2 z-20 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-white/85 text-xs text-ink-900 shadow hover:bg-white"
          >
            &gt;
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2 z-20 flex justify-center gap-1">
            {safeImages.map((_, i) => (
              <span
                key={i}
                className={`h-1.5 w-1.5 rounded-full ${i === index ? "bg-white" : "bg-white/50"}`}
                aria-hidden
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/* ===================== 공통 구분선 ===================== */

function SectionDivider() {
  return (
    <div role="separator" aria-hidden="true" className="my-12 flex justify-center">
      <div className="h-px w-24 rounded-full bg-gradient-to-r from-primary-200 via-primary-500 to-primary-200" />
    </div>
  )
}

/* ===================== 인턴 & 도우미형 ===================== */

function InternContent() {
  return (
    <section id="intern-helper" aria-label="사회복지시설도우미">
      <article className="relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
        {/* 상단 요약: 아이콘 + 제목 (설명 텍스트 제거 버전, 중앙 정렬) */}
        <div className="flex flex-col items-center gap-2 border-b border-border px-6 py-6 bg-gradient-to-r from-primary-50 to-transparent text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary-600/10">
            <Handshake className="h-6 w-6 text-primary-700" aria-hidden />
          </div>
          <h3 className="text-lg font-semibold text-ink-900">{internHelperEntry.name}</h3>
        </div>

        {/* 하단 정보: 주소 / 연락처 / 협력 시설 / 운영 활동 (데스크톱에서 일렬) */}
        <div className="p-5 md:p-6">
          <div className="grid gap-6 md:gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 items-start">
            {/* 주소 */}
            <div className="flex items-start gap-3">
              <MapPin className="mt-0.5 h-5 w-5 text-primary-600" aria-hidden />
              <div className="min-w-0">
                <div className="text-xs text-ink-500">주소</div>
                <div className="mt-1 font-medium text-ink-900">{internHelperEntry.address}</div>
              </div>
            </div>

            {/* 연락처 */}
            <div className="flex items-start gap-3">
              <Phone className="mt-0.5 h-5 w-5 text-primary-600" aria-hidden />
              <div className="min-w-0">
                <div className="text-xs text-ink-500">연락처</div>
                <div className="mt-1 font-medium text-ink-900">{internHelperEntry.phone}</div>
              </div>
            </div>

            {/* 협력 시설 (소원의항구 / 애광원 링크 처리) */}
            <div className="flex items-start gap-3">
              <Users className="mt-0.5 h-5 w-5 text-primary-600" aria-hidden />
              <div className="min-w-0">
                <div className="text-xs text-ink-500">협력 시설</div>
                <div className="mt-1 flex flex-wrap gap-2">
                  {internHelperEntry.partners?.map((p) => {
                    const normalized = p.replace(/\s+/g, "")
                    const isWish = normalized === "소원의항구"
                    const isAkw = normalized === "애광원"

                    if (isWish) {
                      return (
                        <a
                          key={p}
                          href="http://wish-harbor.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary-600/10 px-2.5 py-1 text-xs font-medium text-primary-800 ring-1 ring-primary-600/20 hover:bg-primary-600/15"
                          aria-label="소원의항구 새 창에서 열기"
                        >
                          {p}
                          <ExternalLink className="h-[14px] w-[14px]" aria-hidden />
                        </a>
                      )
                    }

                    if (isAkw) {
                      return (
                        <a
                          key={p}
                          href="https://akw.or.kr/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 rounded-full bg-primary-600/10 px-2.5 py-1 text-xs font-medium text-primary-800 ring-1 ring-primary-600/20 hover:bg-primary-600/15"
                          aria-label="애광원 새 창에서 열기"
                        >
                          {p}
                          <ExternalLink className="h-[14px] w-[14px]" aria-hidden />
                        </a>
                      )
                    }

                    return (
                      <span
                        key={p}
                        className="inline-flex items-center rounded-full bg-ink-100 px-2.5 py-1 text-xs font-medium text-ink-800 ring-1 ring-ink-200/60"
                      >
                        {p}
                      </span>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* 운영 활동 */}
            <div className="flex items-start gap-3">
              <div className="min-w-0">
                <div className="mt-1 flex flex-wrap items-center gap-2 text-sm">
                  <span className="inline-flex items-center gap-1 rounded-md bg-sand-50 px-2 py-1 text-ink-700 ring-1 ring-border">
                    <Tag className="h-4 w-4" aria-hidden />
                    운영 활동
                  </span>
                  <span className="text-ink-900">
                    {internHelperEntry.activities?.[0] ?? "사회복지시설에 보조인력 지원"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </article>
    </section>
  )
}
