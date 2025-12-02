import { MessageSquare, Briefcase, BarChart3, Link2 } from "lucide-react"

const items = [
  { icon: MessageSquare, title: "상담", desc: "개인별 맞춤 상담" },
  { icon: Briefcase, title: "근로기���", desc: "자활근로 배치" },
  { icon: BarChart3, title: "모니터링", desc: "진행 상황 점검" },
  { icon: Link2, title: "연계", desc: "복지·고용 서비스" },
]

export function PlanAndLinking() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => {
        const Icon = item.icon
        return (
          <div key={index} className="bg-white border border-border p-6 rounded-xl text-center">
            <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Icon className="w-6 h-6 text-teal-600" aria-hidden="true" />
            </div>
            <h3 className="font-bold text-ink-900 mb-2">{item.title}</h3>
            <p className="text-sm text-ink-700">{item.desc}</p>
          </div>
        )
      })}
    </div>
  )
}
