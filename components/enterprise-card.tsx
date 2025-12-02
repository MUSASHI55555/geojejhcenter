// components/enterprise-card.tsx
"use client"

import Image from "next/image"
import { Phone, Briefcase, Truck, ShoppingBag, RefreshCcw, Sparkles } from "lucide-react"
import * as React from "react"

export type EnterpriseCardProps = {
  name: string
  desc?: string
  area?: string
  field?: string
  workers?: number         // 데이터는 받지만 UI에는 쓰지 않음
  subsidy?: number         // 마찬가지
  phone?: string
  image?: string           // public/ 파일명
  tags?: string[]
  /** 아이콘 힌트 (없어도 field 키워드로 자동 매핑) */
  icon?: "delivery" | "store" | "reuse" | "cleaning"
  className?: string
}

function pickIcon(hint?: EnterpriseCardProps["icon"], field?: string) {
  if (hint === "delivery") return Truck
  if (hint === "store") return ShoppingBag
  if (hint === "reuse") return RefreshCcw
  if (hint === "cleaning") return Sparkles

  const f = (field || "").toLowerCase()
  if (/(배송|물류|delivery|logistics|truck)/.test(f)) return Truck
  if (/(편의점|소매|store|retail|mart|cu)/.test(f)) return ShoppingBag
  if (/(재사용|재활용|reuse|recycle|순환)/.test(f)) return RefreshCcw
  if (/(청소|클리닝|미화|clean)/.test(f)) return Sparkles
  return Briefcase
}

export function EnterpriseCard({
  name,
  desc,
  area: _area, // NOTE: 데이터는 받지만 UI에는 노출하지 않음
  field,
  workers,  // eslint-disable-line @typescript-eslint/no-unused-vars
  subsidy,  // eslint-disable-line @typescript-eslint/no-unused-vars
  phone,
  image,
  tags = [],
  icon,
  className = "",
}: EnterpriseCardProps) {
  const imgSrc = image ? `/${image}` : undefined
  const FieldIcon = pickIcon(icon, field)

  React.useEffect(() => {
    if (image) {
      console.log(`[v0] EnterpriseCard "${name}" - image: "${image}" -> imgSrc: "${imgSrc}"`)
    }
  }, [name, image, imgSrc])

  return (
    <article
      className={`group relative overflow-hidden rounded-2xl border border-border bg-white shadow-sm transition-all hover:shadow-lg ${className}`}
    >
      {/* 썸네일 */}
      <div className="relative aspect-[16/9] w-full bg-gradient-to-br from-primary-50 to-primary-100">
        {imgSrc ? (
          <Image
            src={imgSrc || "/placeholder.svg"}
            alt={name}
            fill
            className="object-cover"
            sizes="(min-width: 768px) 33vw, 100vw"
            priority
            onError={() => {
              console.error(`[v0] Failed to load image for "${name}": ${imgSrc}`)
            }}
          />
        ) : (
          <div
            aria-hidden
            className="absolute inset-0 flex items-center justify-center text-primary-300"
          >
            <FieldIcon className="h-10 w-10" />
          </div>
        )}

        <div className="pointer-events-none absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/20 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

        {tags.length > 0 && (
          <div className="pointer-events-none absolute left-3 top-3 flex flex-wrap gap-2">
            {tags.slice(0, 3).map((t) => (
              <span
                key={t}
                className="pointer-events-auto inline-flex items-center rounded-full bg-white/90 px-2.5 py-1 text-xs font-medium text-ink-900 backdrop-blur"
              >
                {t}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 본문 */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-ink-900 tracking-tight">{name}</h3>

        {desc && (
          <p className="mt-2 text-ink-700 leading-relaxed">
            {desc}
          </p>
        )}

        {/* 필드만 표시, 근로자/인건비는 숨김 */}
        {field && (
          <div className="mt-4 text-sm text-ink-700">
            <div className="flex items-center gap-2">
              <FieldIcon className="h-[18px] w-[18px] text-primary-600" aria-hidden />
              <span className="truncate">{field}</span>
            </div>
          </div>
        )}

        {/* 액션: 전화 배지 */}
        <div className="mt-5 flex items-center justify-between">
          {phone ? (
            <span
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-sand-50 px-3.5 py-2 text-sm font-medium text-ink-800"
              aria-label={`${name} 연락처`}
            >
              <Phone className="h-[18px] w-[18px] text-primary-600" aria-hidden />
              {phone}
            </span>
          ) : (
            <span className="text-sm text-ink-500">연락처 정보 없음</span>
          )}

          <span className="pointer-events-none select-none text-xs text-ink-400" />
        </div>
      </div>

      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-inset ring-primary-500/0 transition duration-200 group-hover:ring-2" />
    </article>
  )
}

export default EnterpriseCard
