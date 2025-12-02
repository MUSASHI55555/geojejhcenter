import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Footer } from "@/components/footer"
import { donation } from "@/data/donation"
import { contact } from "@/data/contact"
import { Heart, Phone, Mail } from "lucide-react"

export const metadata = {
  title: "후원 안내 - 거제지역자활센터",
  description: "거제지역자활센터 후원 안내",
}

export default function DonationPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" className="min-h-screen">
        <div className="bg-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={[{ label: "참여·후원 안내", href: "/guide/apply" }, { label: "후원하기" }]} />
            <h1 className="text-4xl md:text-5xl font-bold mt-4">후원하기</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <div className="w-20 h-20 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Heart className="w-10 h-10 text-teal-600" aria-hidden="true" />
              </div>
              <h2 className="text-3xl font-bold text-ink-900 mb-4">작은 나눔이 지역을 밝힙니다</h2>
              <p className="text-xl text-ink-700 leading-relaxed">
                여러분의 후원으로 더 많은 이웃이 자립의 기회를 얻을 수 있습니다.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-600 to-teal-400 text-white p-12 rounded-2xl shadow-lg mb-12">
              <h2 className="text-2xl font-bold mb-6 text-center">후원 계좌</h2>
              <div className="space-y-4 text-center">
                <div>
                  <span className="text-teal-100 block mb-2">은행</span>
                  <span className="text-3xl font-bold">{donation.bank}</span>
                </div>
                <div>
                  <span className="text-teal-100 block mb-2">계좌번호</span>
                  <span className="text-3xl font-bold">{donation.account}</span>
                </div>
                <div>
                  <span className="text-teal-100 block mb-2">예금주</span>
                  <span className="text-3xl font-bold">{donation.holder}</span>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white border border-border p-8 rounded-xl">
                <h3 className="text-xl font-bold text-ink-900 mb-4">후원금 사용처</h3>
                <ul className="space-y-3 text-ink-700">
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                    <span>자활 참여자 교육 및 훈련 지원</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                    <span>자활근로 사업 운영</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                    <span>자활기업 창업 지원</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-2 h-2 bg-teal-600 rounded-full mt-2 flex-shrink-0" aria-hidden="true" />
                    <span>긴급 지원이 필요한 가구 지원</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white border border-border p-8 rounded-xl">
                <h3 className="text-xl font-bold text-ink-900 mb-4">기부금 영수증</h3>
                <p className="text-ink-700 leading-relaxed mb-4">
                  후원하신 금액에 대해 기부금 영수증을 발급해드립니다. 연말정산 시 소득공제 혜택을 받으실 수 있습니다.
                </p>
                <p className="text-sm text-ink-700">
                  영수증 발급을 원하시면 후원 시 성명과 주민등록번호를 함께 알려주시기 바랍니다.
                </p>
              </div>
            </div>

            <div className="bg-sand-50 p-8 rounded-xl">
              <h3 className="text-xl font-bold text-ink-900 mb-6 text-center">후원 문의</h3>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                <a
                  href={`tel:${contact.telHref}`}
                  className="flex items-center gap-3 text-primary-600 hover:text-primary-500 transition-colors"
                >
                  <Phone className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">{contact.telDisplay}</span>
                </a>
                <a
                  href={`mailto:${contact.email}`}
                  className="flex items-center gap-3 text-primary-600 hover:text-primary-500 transition-colors"
                >
                  <Mail className="w-5 h-5" aria-hidden="true" />
                  <span className="font-medium">{contact.email}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
