"use client"

import Image from "next/image"

type SectionKey = "about" | "business" | "community" | "webzine"

interface SectionHeroProps {
  sectionKey: SectionKey
  title: string
  subtitle?: string
  /** (옵션) 섹션 기본 매핑을 덮어쓸 커스텀 이미지 경로 */
  heroImage?: string
}

/** 섹션별 기본 히어로 이미지 매핑 */
const heroImages: Record<SectionKey, string> = {
  about: "/gkgk2.jpg",
  business: "/sisi.jpg",
  community: "/cookie.jpg",
  webzine: "/jojo.png",
}

/** 섹션별 상단 라벨 매핑 (최상위 메뉴명) */
const sectionLabels: Record<SectionKey, string> = {
  about: "기관소개",
  business: "사업안내",
  community: "커뮤니티",
  webzine: "웹진보기",
}

export function SectionHero({ sectionKey, title, subtitle, heroImage }: SectionHeroProps) {
  // 전달된 heroImage가 있으면 우선 적용, 없으면 기본 매핑 사용
  const imageSrc = heroImage ?? heroImages[sectionKey]
  const sectionLabel = sectionLabels[sectionKey]

  return (
    <section className="relative w-full overflow-hidden">
      {/* 4:1 느낌의 세로 여백 (반응형) */}
      <div className="relative h-[280px] sm:h-[360px] md:h-[420px]">
        {/* Background Image (fallback: gradient) */}
        <div className="absolute inset-0">
          {imageSrc ? (
            <Image
              src={imageSrc || "/placeholder.svg"}
              alt=""
              fill
              priority
              sizes="100vw"
              className="object-cover object-center"
              onError={(e) => {
                const target = e.target as HTMLImageElement
                target.style.display = "none"
                if (target.parentElement) {
                  target.parentElement.style.background = "linear-gradient(135deg, #0B0F14 0%, #030213 100%)"
                }
              }}
            />
          ) : (
            <div className="h-full w-full bg-[linear-gradient(135deg,#0B0F14_0%,#030213_100%)]" />
          )}
        </div>

        {/* readability overlay */}
        <div className="absolute inset-0 bg-black/25" aria-hidden="true" />

        {/* Content */}
        <div className="relative h-full container mx-auto px-4 flex flex-col justify-center">
          <p className="text-sm sm:text-base text-white/80 font-medium mb-2">{sectionLabel}</p>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white text-balance">{title}</h1>
          {subtitle && <p className="mt-4 text-lg sm:text-xl text-white/90 text-pretty">{subtitle}</p>}
        </div>
      </div>
    </section>
  )
}

export default SectionHero
