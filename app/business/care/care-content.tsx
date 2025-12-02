// app/business/care/care-content.tsx
"use client"

import Image from "next/image"
import { useState } from "react"
import { MapPin, Phone, HeartHandshake, Users } from "lucide-react"

export function CareContent() {
  const heroImages = ["/db1.jpg", "/db4.jpg"]

  return (
    <main id="main-content" className="min-h-screen bg-background">
      {/* 1. 기관 소개 */}
      <section aria-labelledby="care-about" className="border-b bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:flex-row md:items-center md:py-10">
          {/* 좌측 텍스트 */}
          <div className="flex-1 space-y-5">
            {/* 상단 라벨 */}
            <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary-100">
              <Users className="h-4 w-4" aria-hidden />
              <span>기관 소개</span>
            </div>

            {/* 텍스트 제목 대신 로고 이미지 */}
            <div className="relative md:-ml-[60px] h-16 w-[320px] md:h-20 md:w-[400px]">
              <Image src="/dolllbom.png" alt="거제돌봄지원센터 로고" fill sizes="400px" className="object-contain" />
            </div>

            {/* 기관 소개 문장들 */}
            <div className="space-y-3 text-sm leading-relaxed text-ink-900 md:text-[0.95rem]">
              {/* 1) 설립 문장 */}
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
                <p className="text-sm leading-relaxed">
                  <span className="block">거제돌봄지원센터는 2008년 설립되어</span>
                  <span className="block">
                    돌봄과 사회서비스를 필요로 하는 노인이나 장애인 가구를 직접 방문하여 서비스 제공
                  </span>
                </p>
              </div>

              {/* 2) 장기요양기관 평가 문장 */}
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
                <p className="text-sm leading-relaxed">
                  <span className="block">국민건강보험공단 장기요양기관 평가에서 방문요양, 방문목욕 부문</span>
                  <span className="block">최우수, 우수기관으로 다회 선정되었으며 목욕차량 2대 운영</span>
                </p>
              </div>

              {/* 3) 요양보호사 파견 문장 */}
              <div className="flex items-start gap-3">
                <span className="mt-2 h-2 w-2 rounded-full bg-primary-500" aria-hidden />
                <p className="text-sm leading-relaxed">다년간의 경력과 업무역량 강화 교육을 수료한 요양보호사를 파견</p>
              </div>
            </div>

            {/* 문의 / 소재지 – 라벨 제거 + 박스 높이 축소 */}
            <div className="grid gap-3 text-sm md:max-w-lg md:grid-cols-2">
              <div className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50/80 px-4 py-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                  <Phone className="h-4 w-4 text-primary-700" aria-hidden />
                </div>
                <div className="font-medium text-ink-900">055) 687-2648, 2649</div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-sand-200 bg-sand-50/80 px-4 py-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white shadow-sm">
                  <MapPin className="h-4 w-4 text-primary-700" aria-hidden />
                </div>
                <div className="font-medium text-ink-900">거제시 거제중앙로 1900, 303호(청원상가)</div>
              </div>
            </div>
          </div>

          {/* 우측 사진 – db1 + db4 슬라이더 */}
          <div className="flex-1 md:translate-y-[5px]">
            <div className="relative mx-auto aspect-[4/3] w-full max-w-md overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-xl">
              <HeroImageCarousel images={heroImages} />
            </div>
          </div>
        </div>
      </section>

      {/* 2. 주요사업 · 노인장기요양 & 장애인 활동지원 */}
      <section
        aria-labelledby="care-programs"
        className="border-b bg-gradient-to-b from-white via-sand-50/80 to-blue-50/30"
      >
        <div className="container mx-auto max-w-6xl px-4 py-12 md:py-16">
          {/* 섹션 헤더 */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary-50 px-3 py-1 text-xs font-medium text-primary-700 ring-1 ring-primary-100">
                <HeartHandshake className="h-4 w-4" aria-hidden />
                <span>주요사업</span>
              </div>
              <h2 id="care-programs" className="text-lg font-semibold tracking-tight text-ink-900 md:text-xl">
                장기요양 어르신과 장애인을 위한 방문 돌봄 서비스
              </h2>
              <p className="max-w-xl text-xs text-ink-700 md:text-sm">
                <span className="block">장기요양 1~5등급 어르신과 활동지원등급을 받은 장애인을 대상으로,</span>
                <span className="block">가정에 직접 방문하여 일상생활과 이동, 목욕을 지원합니다.</span>
              </p>
            </div>
          </div>

          {/* 좌/우 2단 구성 */}
          <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1.25fr)_minmax(0,1fr)]">
            {/* 좌측 텍스트 카드 그룹 */}
            <div className="space-y-8">
              {/* 노인장기요양 카드 */}
              <div className="space-y-5 rounded-3xl border border-sand-200 bg-white/95 p-6 shadow-sm md:p-7">
                <div className="space-y-4 text-sm leading-relaxed text-ink-900">
                  {/* 1) 대상자 문단 (먼저) */}
                  <p>
                    <span className="font-semibold text-ink-900">* 대상자:</span>
                    <br />
                    -65세 미만: 치매/알츠하이머, 중풍, 파킨슨, 뇌혈관성 질환으로 거동이 불편하신 분
                    <br />
                    -65세 이상: 거동이나 일상생활이 불편하신 분
                  </p>

                  {/* 2) 노인장기요양 개요 문단 (둘째) */}
                  <p>
                    <span className="font-semibold text-ink-900">노인장기요양</span>
                    <span className="block">
                      장기요양 1~5등급을 받으신 어르신에게 요양보호사가 방문하여 서비스 제공
                    </span>
                  </p>

                  {/* 3) 방문요양 */}
                  <p>
                    <span className="font-semibold text-ink-900">방문요양</span>
                    <span className="block">신체활동, 개인활동, 가사활동, 정서안정 지원</span>
                    <span className="block">
                      *5등급과 치매 대상자에겐 전문교육을 이수한 요양보호사가 회상훈련, 잔존기능 유지향상 훈련 등
                      인지기능관련 서비스 제공
                    </span>
                  </p>

                  {/* 4) 방문목욕 */}
                  <p>
                    <span className="font-semibold text-ink-900">방문목욕</span>
                    <span className="block">목욕설비를 갖춘 차량으로 어르신댁에 직접 방문하여 목욕제공</span>
                  </p>
                </div>

                {/* 서비스 신청절차 */}
                <div className="mt-4 rounded-2xl bg-sand-50 px-4 py-3 text-xs leading-relaxed text-ink-900">
                  <p className="text-[0.8rem] font-semibold text-ink-900">서비스 신청절차 및 비용</p>
                  <p className="mt-1">○서비스 신청절차</p>
                  <p className="mt-1">
                    - 등급상담(전화/방문) ▶ 계약 ▶ 요양보호사파견 ▶ 서비스제공 ▶ 체계적/전문적 관리
                  </p>
                  <p className="mt-1">- 비용: 노인장기요양보험에서 85%~100%지원</p>
                </div>
              </div>

              {/* 장애인 활동지원 카드 */}
              <div className="space-y-4 rounded-3xl border border-sand-200 bg-white/95 p-6 shadow-sm md:p-7">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-ink-900 md:text-base">
                  <Users className="h-4 w-4 text-primary-700" aria-hidden />
                  장애인 활동지원
                </h3>

                <div className="space-y-3 text-sm leading-relaxed text-ink-900">
                  <p className="font-semibold text-ink-900">장애인 활동지원 서비스</p>
                  <p>대상: 만6세이상 65세 미만의 활동지원등급을 받은 대상자에게 직접 방문하여 차량으로 목욕제공</p>
                </div>
              </div>
            </div>

            {/* 우측 이미지 2단 – 실제 높이 축소 버전 */}
            <div className="space-y-6">
              {/* db2 */}
              <div className="relative h-[380px] md:h-[400px] overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-sm">
                <Image
                  src="/db2.jpg"
                  alt="거제돌봄지원센터 이동목욕차량"
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="pointer-events-none absolute bottom-3 left-4 rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-white">
                  목욕설비를 갖춘 이동목욕차량 운영
                </div>
              </div>

              {/* db3 */}
              <div className="relative h-[380px] md:h-[400px] overflow-hidden rounded-3xl border border-sand-200 bg-sand-50 shadow-sm">
                <Image
                  src="/db3.jpg"
                  alt="거제돌봄지원센터 이동목욕차량 내부"
                  fill
                  sizes="(min-width: 1024px) 32vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover"
                />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/55 to-transparent" />
                <div className="pointer-events-none absolute bottom-3 left-4 rounded-full bg-black/65 px-3 py-1 text-[11px] font-medium text-white">
                  대상자 가정을 직접 방문하는 목욕 지원
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. 하단 요약 · 콜투액션 (Contact) */}
      <section className="border-t bg-white">
        <div className="container mx-auto max-w-6xl px-4 py-6">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            {/* 왼쪽 라벨 */}
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-ink-500">Contact · Location</p>

            {/* 오른쪽 연락처 + 주소 */}
            <div className="flex flex-wrap items-center gap-3 md:gap-4">
              <a
                href="tel:0556872648"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-primary-500 px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary-500/30 transition hover:bg-primary-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-300 md:text-sm"
              >
                <Phone className="h-4 w-4" aria-hidden />
                055) 687-2648, 2649
              </a>
              <div className="flex flex-wrap items-center gap-2 text-xs text-ink-700 md:text-sm">
                <MapPin className="h-4 w-4" aria-hidden />
                <span>거제시 거제중앙로 1900, 303호(청원상가)</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

/* ===== 우측 상단 이미지 슬라이더(db1 + db4) ===== */
function HeroImageCarousel({ images }: { images: string[] }) {
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
        alt="거제돌봄지원센터 활동 사진"
        fill
        sizes="(min-width: 768px) 420px, 100vw"
        className="object-cover"
      />

      {/* 하단 그라디언트 & 라벨 (공통) */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/45 to-transparent" />
      <div className="pointer-events-none absolute bottom-3 left-4 rounded-full bg-black/55 px-3 py-1 text-xs font-medium text-white shadow-sm">
        요양보호사 교육 및 역량 강화
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            aria-label="이전 이미지"
            onClick={() => go(-1)}
            className="absolute left-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-sm text-ink-900 shadow hover:bg-white"
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="다음 이미지"
            onClick={() => go(1)}
            className="absolute right-3 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-sm text-ink-900 shadow hover:bg-white"
          >
            ›
          </button>
          <div className="pointer-events-none absolute inset-x-0 bottom-2 flex justify-center gap-1.5">
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
