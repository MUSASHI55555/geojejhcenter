// components/business-icons-grid.tsx
import type React from "react"
import Link from "next/link"
import { Sprout, Flower2, Store, ClipboardList, HeartHandshake } from "lucide-react"

type Item = {
  label: string
  href: string
  Icon: React.ComponentType<React.SVGProps<SVGSVGElement>>
}

const BRAND_BLUE = "#1F3AA7"

const items: Item[] = [
  { label: "자활사업안내", href: "/business/self-support", Icon: Sprout },
  { label: "자활근로사업", href: "/business/workfare", Icon: Flower2 },
  { label: "자활기업", href: "/business/social-enterprise", Icon: Store },
  { label: "자활사례관리", href: "/business/case-management", Icon: ClipboardList },
  { label: "사회서비스", href: "/business/care", Icon: HeartHandshake },
]

export function BusinessIconsGrid() {
  return (
    // [LAYOUT-GUARD] Prevent horizontal overflow on mobile: keep container width <= viewport
    <section aria-label="사업 바로가기" className="py-14 bg-[#E9F4FF] overflow-hidden">
      <div className="container mx-auto max-w-6xl px-4">
        <ul
          role="list"
          className="
            flex flex-wrap justify-center
            w-full max-w-5xl mx-auto
            gap-x-2 gap-y-6
            sm:flex-nowrap sm:gap-x-0
          "
        >
          {items.map(({ label, href, Icon }, index) => {
            const isLast = index === items.length - 1

            return (
              <li
                key={label}
                className="
                  relative
                  flex items-stretch
                  flex-1 min-w-0
                  basis-[45%] sm:basis-auto
                "
              >
                <Link
                  href={href}
                  className="
                    group
                    relative
                    flex flex-col
                    items-center
                    justify-start
                    w-full
                    px-4
                    pt-4
                    pb-6
                    rounded-2xl
                    transition-transform
                    hover:-translate-y-0.5
                    focus:outline-none
                  "
                >
                  {/* 아이콘 원 */}
                  <span className="mb-3 inline-flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/5">
                    <Icon className="h-9 w-9" strokeWidth={2} style={{ color: BRAND_BLUE }} aria-hidden="true" />
                  </span>

                  {/* 라벨 */}
                  <span className="text-sm font-semibold text-ink-900 text-center">{label}</span>

                  {/* hover 밑줄 */}
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none
                      absolute
                      left-6
                      right-6
                      -bottom-1
                      h-[3px]
                      overflow-hidden
                    "
                  >
                    <span
                      className="
                        block
                        h-[3px]
                        w-0
                        mx-auto
                        bg-[#1F3AA7]
                        transition-all
                        duration-300
                        ease-out
                        group-hover:w-full
                      "
                    />
                  </span>
                </Link>

                {/* 세로 구분선 (마지막 제외, 모바일에서는 숨김) */}
                {!isLast && (
                  <span
                    aria-hidden="true"
                    className="
                      hidden
                      sm:block
                      absolute
                      top-1/2
                      -translate-y-1/2
                      right-0
                      h-20
                      w-px
                      bg-black/10
                    "
                  />
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
