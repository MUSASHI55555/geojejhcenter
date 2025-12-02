import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Footer } from "@/components/footer"
import { contact } from "@/data/contact"
import { Phone, Map } from "lucide-react"

export const metadata = {
  title: "참여 신청 - 거제지역자활센터",
  description: "자활사업 참여 신청 안내",
}

const steps = [
  { id: 1, title: "상담", desc: "전화 또는 방문을 통해 초기 상담을 진행합니다" },
  { id: 2, title: "실습·체험", desc: "게이트웨이 과정을 통해 적합한 프로그램을 찾습니다" },
  { id: 3, title: "참여 확정", desc: "개인별 맞춤 계획을 수립하고 참여를 확정합니다" },
  { id: 4, title: "근로·참여", desc: "자활근로 또는 교육 프로그램에 참여합니다" },
  { id: 5, title: "점검·조정", desc: "정기적인 모니터링과 계획 조정을 진행합니다" },
]

export default function ParticipationPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" className="min-h-screen">
        <div className="bg-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={[{ label: "참여·후원 안내", href: "/guide/apply" }, { label: "참여 신청" }]} />
            <h1 className="text-4xl md:text-5xl font-bold mt-4">참여 신청</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="mb-12">
              <h2 className="text-3xl font-bold text-ink-900 mb-6">참여 절차</h2>
              <p className="text-xl text-ink-700 leading-relaxed mb-8">
                자활사업 참여는 상담부터 시작됩니다. 아래 단계를 따라 진행되며, 각 단계마다 전문 상담사가 함께합니다.
              </p>

              <div className="space-y-6">
                {steps.map((step, index) => (
                  <div key={step.id} className="flex gap-6">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                        {step.id}
                      </div>
                      {index < steps.length - 1 && (
                        <div className="w-0.5 h-12 bg-primary-200 mx-auto mt-2" aria-hidden="true" />
                      )}
                    </div>
                    <div className="flex-1 pb-8">
                      <h3 className="text-xl font-bold text-ink-900 mb-2">{step.title}</h3>
                      <p className="text-ink-700 leading-relaxed">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-teal-100 p-8 rounded-xl mb-12">
              <h2 className="text-2xl font-bold text-ink-900 mb-4">신청 방법</h2>
              <p className="text-ink-700 leading-relaxed mb-6">
                전화 상담 또는 센터 방문을 통해 신청하실 수 있습니다. 상담 시간은 평일 오전 9시부터 오후 6시까지입니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a
                  href={`tel:${contact.telHref}`}
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-500 transition-colors min-h-[44px]"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  전화 상담
                </a>
                <a
                  href={contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-primary-600 font-semibold rounded-lg hover:bg-primary-100 transition-colors border border-primary-600 min-h-[44px]"
                >
                  <Map className="w-5 h-5" aria-hidden="true" />
                  오시는 길
                </a>
              </div>
            </div>

            <div className="bg-sand-50 p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-ink-900 mb-4">준비 서류</h2>
              <ul className="space-y-2 text-ink-700">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                  <span>신분증 (주민등록증, 운전면허증 등)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                  <span>수급자 증명서 (해당자에 한함)</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                  <span>기타 상담 시 안내되는 서류</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
