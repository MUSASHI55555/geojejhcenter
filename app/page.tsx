// app/page.tsx
"use client"

import Link from "next/link"
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { HeroSimple } from "@/components/hero-simple"
import { BusinessIconsGrid } from "@/components/business-icons-grid"
import { HomeNoticesBox } from "@/components/home-notices"
import { HomeGallery } from "@/components/home-gallery"
import { PartnersStrip } from "@/components/partners-strip"
import { Footer } from "@/components/footer"
import { Megaphone, MapPin, Heart } from "lucide-react"

/** 오시는 길 미니 카드 (우측 하단, 연블루 그라데이션) */
function LocationCard() {
  return (
    <Link
      href="/about/location"
      className="
        flex items-center justify-between
        w-full rounded-2xl
        border border-[#CCE3FF]
        bg-gradient-to-r from-[#E8F2FF] via-[#E8F2FF] to-white
        px-3 py-2
        gap-2
        transition-transform hover:-translate-y-0.5 hover:shadow-md
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3AA7]
      "
      aria-label="오시는 길 - 거제지역자활센터 위치 및 교통 안내"
    >
      <span className="text-[13px] font-semibold text-[#0B1320]">
        오시는 길
      </span>
      <span
        className="
          flex h-7 w-7 flex-shrink-0 items-center justify-center
          rounded-full bg-white shadow-sm ring-1 ring-black/8
        "
      >
        <MapPin className="h-4 w-4 text-[#1F3AA7]" aria-hidden="true" />
      </span>
    </Link>
  )
}

/** 후원안내 미니 카드 (우측 하단, 연블루 그라데이션 변주) */
function DonationCard() {
  return (
    <Link
      href="/donation"
      className="
        flex items-center justify-between
        w-full rounded-2xl
        border border-[#CCEAF8]
        bg-gradient-to-r from-[#E9F8FF] via-[#E9F8FF] to-white
        px-3 py-2
        gap-2
        transition-transform hover:-translate-y-0.5 hover:shadow-md
        focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3AA7]
      "
      aria-label="후원안내 - 후원 계좌 및 방법 안내"
    >
      <span className="text-[13px] font-semibold text-[#0B1320]">
        후원안내
      </span>
      <span
        className="
          flex h-7 w-7 flex-shrink-0 items-center justify-center
          rounded-full bg-white shadow-sm ring-1 ring-black/8
        "
      >
        <Heart className="h-4 w-4 text-[#1F3AA7]" aria-hidden="true" />
      </span>
    </Link>
  )
}

export default function HomePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content">
        <HeroSimple />
        <BusinessIconsGrid />

        {/* 센터 소식·안내 */}
        <section className="pt-10 pb-20 bg-neutral-50">
          <div className="container mx-auto px-4">
            {/* 섹션 타이틀 */}
            <div className="flex flex-col items-center gap-2 mb-6">
              <Megaphone className="w-7 h-7 text-[#1F3AA7]" aria-hidden="true" />
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-[#111827]">
                센터 소식·안내
              </h2>
            </div>

            {/* 좌우 동일 너비, 중앙 정렬 */}
            <div
              className="
                mx-auto
                grid gap-6
                md:grid-cols-2
                md:items-stretch
                max-w-6xl
              "
            >
              {/* LEFT: 공지사항 */}
              <div className="flex">
                <HomeNoticesBox />
              </div>

              {/* RIGHT: 갤러리 우선 + 하단 미니 카드 2개 */}
              <div className="flex flex-col gap-3 h-full">
                <div className="flex-1 min-h-[200px]">
                  <HomeGallery />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <LocationCard />
                  <DonationCard />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 센터 소식·안내와 협력 기관 로고 사이 여백 */}
        <div className="mt-3">
          <PartnersStrip />
        </div>
      </main>

      <Footer />
    </>
  )
}
