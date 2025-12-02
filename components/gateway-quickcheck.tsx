"use client"

import { useMemo, useState } from "react"

type Answer = "low" | "mid" | "high" | ""
type Result = "취업 준비형" | "창업 탐색형" | "자활근로 적합형" | null

export default function GatewayQuickCheck() {
  const [desire, setDesire] = useState<Answer>("")
  const [aptitude, setAptitude] = useState<Answer>("")
  const [conditions, setConditions] = useState<Answer>("")

  const result = useMemo<Result>(() => {
    if (!desire || !aptitude || !conditions) return null
    // 아주 단순한 규칙 매핑(초기 버전)
    if (aptitude === "high" && desire !== "low") return "취업 준비형"
    if (desire === "high" && conditions === "mid") return "창업 탐색형"
    return "자활근로 적합형"
  }, [desire, aptitude, conditions])

  return (
    <div className="rounded-2xl border border-foreground/10 p-6 bg-white/70">
      <div className="grid md:grid-cols-3 gap-6">
        <Field
          label="욕구"
          value={desire}
          onChange={setDesire}
          options={[
            { v: "low", l: "낮음" },
            { v: "mid", l: "보통" },
            { v: "high", l: "높음" },
          ]}
        />
        <Field
          label="적성"
          value={aptitude}
          onChange={setAptitude}
          options={[
            { v: "low", l: "낮음" },
            { v: "mid", l: "보통" },
            { v: "high", l: "높음" },
          ]}
        />
        <Field
          label="여건"
          value={conditions}
          onChange={setConditions}
          options={[
            { v: "low", l: "제약 많음" },
            { v: "mid", l: "일부 제약" },
            { v: "high", l: "제약 적음" },
          ]}
        />
      </div>

      <div className="mt-6">
        {result ? (
          <div className="flex items-center justify-between rounded-xl border border-foreground/10 p-4 bg-[#B8892B]/5">
            <p className="font-semibold">
              추천 경��: <span className="text-[#B8892B]">{result}</span>
            </p>
            <a
              href="/apply"
              className="px-4 py-2 rounded-full bg-[#B8892B] text-white hover:opacity-90 transition"
            >
              상담 예약으로 이동
            </a>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">세 항목을 모두 선택하면 추천 경로가 표시됩니다.</p>
        )}
      </div>
    </div>
  )
}

function Field({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: Answer
  onChange: (v: Answer) => void
  options: { v: Answer; l: string }[]
}) {
  return (
    <div>
      <p className="mb-2 font-medium">{label}</p>
      <div className="flex gap-2">
        {options.map((o) => (
          <button
            key={o.v}
            type="button"
            onClick={() => onChange(o.v)}
            className={`px-3 py-2 rounded-full border transition ${
              value === o.v ? "bg-[#B8892B] text-white border-transparent" : "hover:bg-muted"
            }`}
            aria-pressed={value === o.v}
          >
            {o.l}
          </button>
        ))}
      </div>
    </div>
  )
}
