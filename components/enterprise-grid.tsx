"use client"

import { enterprises } from "@/data/enterprises"
import EnterpriseCard from "@/components/enterprise-card"

export function EnterpriseGrid() {
  console.log(
    "[v0] Enterprise data loaded:",
    enterprises.map((e) => ({ name: e.name, image: e.image })),
  )

  return (
    <section aria-labelledby="enterprise-grid-title" className="w-full">
      {/* 섹션 헤더 */}
      <div className="mb-8 text-center">
        <h2
          id="enterprise-grid-title"
          className="inline-block text-2xl md:text-3xl font-bold text-ink-900 tracking-tight"
        >
          자활기업
        </h2>
        <div className="mx-auto mt-3 h-[3px] w-16 rounded-full bg-primary-600/80" aria-hidden />
      </div>

      {/* 카드 그리드 */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {enterprises.map((enterprise) => (
          <EnterpriseCard
            key={enterprise.name}
            name={enterprise.name}
            desc={enterprise.desc || ""}
            phone={enterprise.phone || ""}
            area={enterprise.area}
            field={enterprise.field}
            workers={enterprise.workers}
            subsidy={enterprise.subsidy}
            image={enterprise.image}
            tags={enterprise.tags}
            icon={enterprise.icon}
            className="h-full"
          />
        ))}
      </div>
    </section>
  )
}

export default EnterpriseGrid
