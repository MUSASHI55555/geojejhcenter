"use client"

import Image from "next/image"
import { Phone, Heart, Users, Bath, MessageCircle, UserCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function SocialServicesSection() {
  const services = [
    { icon: Heart, label: "방문요양" },
    { icon: Users, label: "가족요양" },
    { icon: Bath, label: "방문목욕" },
    { icon: MessageCircle, label: "등급 상담" },
    { icon: UserCheck, label: "요양보호사 파견" },
  ]

  return (
    <section
      aria-label="거제돌봄지원센터 사회서비스 안내"
      className="relative w-full bg-gradient-to-b from-white to-blue-50/30"
    >
      <div className="container mx-auto px-4 py-8 md:py-12 lg:py-16 max-w-7xl">
        {/* 헤더: 제목 → (연락처 + 로고) → 안내 문구(아래 줄) */}
        <div className="flex flex-col gap-4 md:gap-6">
          <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-extrabold tracking-tight text-[#0B1320]">
            거제돌봄지원센터
          </h1>

          {/* 연락처 + 로고 한 줄 */}
          <div className="flex flex-wrap items-center gap-3 md:gap-5">
            <Button
              asChild
              className="bg-[#1F3AA7] hover:bg-[#1F3AA7]/90 text-white shadow-md"
              aria-label="전화걸기 055-687-2648"
            >
              <a href="tel:0556872648" className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span className="font-semibold">055-687-2648</span>
              </a>
            </Button>

            <div className="flex items-center gap-4 md:gap-6">
              <Image
                src="/healthbo.png"
                alt="국민건강보험 h:well 로고"
                width={120}
                height={48}
                className="h-8 md:h-10 w-auto object-contain"
                priority
              />
              <Image
                src="/noin.png"
                alt="노인장기요양보험 로고"
                width={140}
                height={48}
                className="h-8 md:h-10 w-auto object-contain"
                priority
              />
            </div>
          </div>

          {/* 안내 문구: 연락처/로고 아래 줄 */}
          <p className="text-sm md:text-base text-[#0B1320]/80 leading-relaxed">
            ※ 노인장기요양보험에서 85% ~ 100% 지원합니다
          </p>
        </div>

        {/* 활동 사진: 헤더 바로 아래 */}
        <div className="mt-8 md:mt-10">
          <h2 className="text-2xl md:text-3xl font-bold text-[#0B1320] mb-6 md:mb-8">활동 사진</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { src: "/activity-11.jpg", alt: "거제돌봄지원센터 활동 사진 1" }, // 파일명 변경 반영
              { src: "/activity-2.jpg", alt: "거제돌봄지원센터 활동 사진 2" },
              { src: "/activity-3.jpg", alt: "거제돌봄지원센터 활동 사진 3" },
            ].map((img, i) => (
              <Card key={i} className="overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white">
                <div className="relative aspect-[3/2]">
                  <Image
                    src={img.src}
                    alt={img.alt}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                    priority={i === 0}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* 서비스 아이콘 카드 */}
        <div className="mt-12 md:mt-16">
          <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4" role="list">
            {services.map(({ icon: Icon, label }, idx) => (
              <li key={idx}>
                <Card className="p-4 md:p-6 text-center hover:shadow-md transition-shadow focus-within:outline focus-within:outline-2 focus-within:outline-[#1F3AA7] focus-within:outline-offset-2 bg-white border-gray-200">
                  <Icon className="w-8 h-8 md:w-10 md:h-10 mx-auto mb-3 text-[#1F3AA7]" aria-hidden="true" />
                  <p className="text-sm md:text-base font-medium text-[#0B1320]">{label}</p>
                </Card>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 모바일 고정 통화 버튼 */}
      <div className="fixed bottom-4 right-4 md:hidden z-50" style={{ paddingBottom: "env(safe-area-inset-bottom)" }}>
        <Button
          asChild
          className="bg-[#1F3AA7] hover:bg-[#1F3AA7]/90 text-white shadow-2xl rounded-full w-14 h-14 p-0"
          aria-label="전화걸기 055-687-2648"
        >
          <a href="tel:0556872648" className="flex items-center justify-center">
            <Phone className="w-6 h-6" />
          </a>
        </Button>
      </div>

      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "거제돌봄지원센터",
            telephone: "+82-55-687-2648",
            department: "Home Care",
            address: { "@type": "PostalAddress", addressLocality: "거제시", addressCountry: "KR" },
            sameAs: [],
          }),
        }}
      />
    </section>
  )
}
