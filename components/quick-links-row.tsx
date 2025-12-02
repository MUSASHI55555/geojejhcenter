// components/quick-links-row.tsx
import Link from "next/link"
import { Heart, MapPin, Handshake } from "lucide-react"

type Item = {
  label: string
  desc?: string
  href: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
  // 파스텔 배경 톤
  bgClass: string
}

const items: Item[] = [
  {
    label: "후원안내",
    desc: "작은 나눔이 지역을 밝힙니다",
    href: "/donation",
    Icon: Heart,
    bgClass: "bg-emerald-50",
  },
  {
    label: "오시는 길",
    desc: "거제지역자활센터 위치 안내",
    // 프로젝트 라우트에 맞춰 필요 시 수정하세요.
    href: "/about/location",
    Icon: MapPin,
    bgClass: "bg-amber-50",
  },
  {
    label: "자활사업참여",
    desc: "참여 신청 절차를 확인하세요",
    href: "/guide/apply",
    Icon: Handshake,
    bgClass: "bg-emerald-50",
  },
]

export function QuickLinksRow() {
  return (
    <section aria-label="바로가기" className="py-12">
      <div className="container mx-auto px-4">
        <ul
          role="list"
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map(({ label, desc, href, Icon, bgClass }) => (
            <li key={label}>
              <Link
                href={href}
                aria-label={`${label} 바로가기`}
                className={[
                  "group relative block overflow-hidden rounded-2xl",
                  bgClass,                   // 파스텔 배경
                  "shadow-sm ring-1 ring-black/5",
                  "transition-transform duration-200 hover:-translate-y-0.5 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1F3AA7]",
                ].join(" ")}
              >
                <div className="flex items-center justify-between px-7 py-8 min-h-[120px]">
                  {/* 왼쪽 텍스트(좌정렬) */}
                  <div className="pr-6">
                    <h3 className="text-[20px] font-bold text-[#0B1320]">{label}</h3>
                    {desc && (
                      <p className="mt-2 text-[14px] leading-relaxed text-[#0B1320]/70">
                        {desc}
                      </p>
                    )}
                  </div>

                  {/* 오른쪽 원형 아이콘 캡슐 */}
                  <span className="grid size-14 place-items-center rounded-full bg-white shadow-sm ring-1 ring-black/10">
                    <Icon className="size-7 text-[#1F3AA7]" aria-hidden="true" />
                  </span>
                </div>

                {/* 하단 미세 언더라인 애니메이션 */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-x-7 bottom-2 h-[2px] scale-x-0 bg-[#1F3AA7]/60 transition-transform duration-300 group-hover:scale-x-100"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
