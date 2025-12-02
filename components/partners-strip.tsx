// components/partners-strip.tsx
"use client"

import { useRef } from "react"
import Image from "next/image"

const partners = [
  { src: "/partners/put1.png", alt: "보건복지부", label: "보건복지부" },
  { src: "/partners/put2.png", alt: "한국자활복지개발원", label: "한국자활복지개발원" },
  { src: "/partners/put3.png", alt: "한국지역자활센터협회", label: "한국지역자활센터협회" },
  { src: "/partners/put4.png", alt: "경남광역자활센터", label: "경남광역자활센터" },
  { src: "/partners/put5.png", alt: "경남지역자활센터협회", label: "경남지역자활센터협회" },
  { src: "/partners/put6.png", alt: "거제시청·거제시보건소", label: "거제시청·거제시보건소" },
  { src: "/partners/put7.png", alt: "거제시종합사회복지관", label: "거제시종합사회복지관" },
]

export function PartnersStrip() {
  const trackRef = useRef<HTMLDivElement | null>(null)

  const scrollBy = (dx: number) => {
    const el = trackRef.current
    if (!el) return
    el.scrollBy({ left: dx, behavior: "smooth" })
  }

  return (
    // 섹션 자체는 얇게: 위/아래 패딩 최소화, 마진 없음
    <section aria-label="협력 기관" className="py-2">
      <div className="container mx-auto px-4">
        <div className="relative flex items-center">
          {/* 왼쪽 버튼 */}
          <button
            type="button"
            onClick={() => scrollBy(-260)}
            aria-label="이전 협력 기관"
            className="absolute left-0 top-1/2 -translate-y-1/2 px-2 py-4
                       bg-gradient-to-r from-white via-white/95 to-transparent
                       text-slate-500 hover:text-slate-800 transition-colors z-10"
          >
            ‹
          </button>

          {/* 오른쪽 버튼 */}
          <button
            type="button"
            onClick={() => scrollBy(260)}
            aria-label="다음 협력 기관"
            className="absolute right-0 top-1/2 -translate-y-1/2 px-2 py-4
                       bg-gradient-to-l from-white via-white/95 to-transparent
                       text-slate-500 hover:text-slate-800 transition-colors z-10"
          >
            ›
          </button>

          {/* 로고 트랙 */}
          <div
            ref={trackRef}
            className="mx-10 flex items-center gap-10 overflow-x-hidden py-1"
          >
            {partners.map((p, i) => {
              let imgClass = "object-contain w-auto"

              if (p.src === "/partners/put2.png") {
                // put2만 살짝 축소
                imgClass += " h-[32px]"
              } else if (p.src === "/partners/put3.png") {
                imgClass += " h-[22px]"
              } else if (p.src === "/partners/put5.png") {
                imgClass += " h-[60px]"
              } else {
                imgClass += " h-[40px]"
              }

              const showText =
                p.label === "거제시청" ||
                p.label === "거제시보건소" ||
                p.label === "거제시청·거제시보건소"

              return (
                <div
                  key={`${p.alt}-${i}`}
                  className="flex flex-col items-center gap-1 flex-none"
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    width={150}
                    height={60}
                    className={imgClass}
                  />
                  {showText && (
                    <span className="text-[10px] text-slate-500 leading-tight">
                      {p.label}
                    </span>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
