// components/info-cards-2.tsx
import Link from "next/link"
import { Info } from "lucide-react"

export function InfoCards2() {
  return (
    <div className="w-full rounded-2xl border border-black/[0.08] bg-white shadow-sm flex flex-col">
      <div className="flex items-center justify-between px-4 pt-5 pb-3">
        <h2 className="text-[20px] md:text-[22px] font-bold text-[#0B1320]">
          센터 이용 안내
        </h2>
        <Link
          href="/intro"
          aria-label="센터 소개 및 안내 보기"
          title="센터 소개 및 안내 보기"
          className="inline-flex h-8 px-3 items-center justify-center rounded-full border border-black/10 text-[11px] md:text-[12px] text-[#0B1320]/70 hover:bg-black/[0.04] transition"
        >
          자세히 보기
        </Link>
      </div>

      <hr className="mx-3 border-t border-[#1F3AA7]/60 rounded-full" />

      <div className="px-4 py-3 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-sky-50 flex items-center justify-center flex-shrink-0">
          <Info className="w-4 h-4 text-sky-700" aria-hidden="true" />
        </div>
        <p className="text-[12px] md:text-[13px] leading-relaxed text-[#0B1320]/80">
          센터 소개, 사업 안내, 참여 방법 등 주요 정보를 한눈에 확인하실 수 있습니다.
        </p>
      </div>
    </div>
  )
}
