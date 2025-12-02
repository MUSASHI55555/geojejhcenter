import { gateway } from "@/data/case-gateway"

export function GatewaySteps() {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {gateway.steps.map((step) => (
        <div key={step.id} className="bg-white border border-border p-6 rounded-xl">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
              {step.id}
            </div>
            <h3 className="text-lg font-bold text-ink-900">{step.title}</h3>
          </div>
          <p className="text-ink-700 leading-relaxed">{step.desc}</p>
        </div>
      ))}
    </div>
  )
}
