"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { ChevronLeft, ChevronRight } from "lucide-react"

const slides = [
  {
    src: "/images/hero/hero-bath-truck.jpg",
    alt: "이동목욕 차량 서비스",
  },
  {
    src: "/images/hero/hero-laundry-exterior.jpg",
    alt: "세탁 서비스 시설 외관",
  },
  {
    src: "/images/hero/hero-cafe-yeohae.jpg",
    alt: "카페 여해 내부",
  },
  {
    src: "/images/hero/hero-seaweed-products.jpg",
    alt: "김 제품 생산",
  },
  {
    src: "/images/hero/hero-handcraft-gifts.jpg",
    alt: "수공예 선물 제품",
  },
]

export function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isPaused, setIsPaused] = useState(false)

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }, [])

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }, [])

  const goToSlide = useCallback((index: number) => {
    setCurrentSlide(index)
  }, [])

  useEffect(() => {
    if (isPaused) return

    const interval = setInterval(() => {
      nextSlide()
    }, 5500)

    return () => clearInterval(interval)
  }, [isPaused, nextSlide])

  return (
    <section
      className="relative w-full bg-[#0B0F14]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      aria-label="메인 슬라이더"
    >
      {/* Slider container with aspect ratio */}
      <div className="relative w-full aspect-[16/9] md:min-h-[720px] overflow-hidden">
        {slides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-700 ${
              index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
            }`}
          >
            <Image
              src={slide.src || "/placeholder.svg"}
              alt={slide.alt}
              fill
              className="object-cover object-center"
              priority={index === 0}
              loading={index === 0 ? "eager" : "lazy"}
              sizes="100vw"
            />
          </div>
        ))}

        {/* Gradient overlay for text legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/60 z-20" />

        {/* Content overlay */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center px-4">
          <div className="text-center text-white max-w-4xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 md:mb-6 text-balance drop-shadow-lg">
              함께 일하고, 함께 자립합니다
            </h1>
            <p className="text-xl md:text-2xl text-white/90 text-balance drop-shadow-md">
              거제의 자활·돌봄·사회서비스 파트너
            </p>
          </div>
        </div>

        {/* Navigation arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-sm"
          aria-label="이전 슬라이드"
        >
          <ChevronLeft className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-2 md:p-3 bg-black/30 hover:bg-black/50 text-white rounded-full transition-colors backdrop-blur-sm"
          aria-label="다음 슬라이드"
        >
          <ChevronRight className="w-6 h-6 md:w-8 md:h-8" aria-hidden="true" />
        </button>

        {/* Pagination dots */}
        <div className="absolute bottom-6 md:bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center gap-2">
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              className={`w-2 h-2 md:w-3 md:h-3 rounded-full transition-all ${
                index === currentSlide ? "bg-[#B8892B] w-8 md:w-10" : "bg-white/50 hover:bg-white/80"
              }`}
              aria-label={`슬라이드 ${index + 1}로 이동`}
              aria-current={index === currentSlide ? "true" : "false"}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
