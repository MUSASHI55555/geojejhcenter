import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Footer } from "@/components/footer"
import { MapPin, Phone, Mail, Map, Clock } from "lucide-react"
import { contact } from "@/data/contact"

export const metadata = {
  title: "오시는 길 - 거제지역자활센터",
  description: "거제지역자활센터 위치 및 연락처",
}

export default function ContactPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" className="min-h-screen">
        <div className="bg-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={[{ label: "기관소개", href: "/about" }, { label: "오시는 길" }]} />
            <h1 className="text-4xl md:text-5xl font-bold mt-4">오시는 길</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8 mb-12">
              {/* Contact Information */}
              <div className="space-y-6">
                <div className="bg-white border border-border p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-6 h-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-ink-900 mb-2">주소</h2>
                      <address className="not-italic text-ink-700 leading-relaxed">
                        <p>TBD</p>
                        <p className="text-sm text-ink-700 mt-2">* 주소는 추후 업데이트 예정입니다.</p>
                      </address>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-border p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Phone className="w-6 h-6 text-teal-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-ink-900 mb-2">전화</h2>
                      <a
                        href={`tel:${contact.telHref}`}
                        className="text-primary-600 hover:text-primary-500 transition-colors text-lg font-medium"
                      >
                        {contact.telDisplay}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-border p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-6 h-6 text-primary-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-ink-900 mb-2">이메일</h2>
                      <a
                        href={`mailto:${contact.email}`}
                        className="text-primary-600 hover:text-primary-500 transition-colors break-all"
                      >
                        {contact.email}
                      </a>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-border p-6 rounded-xl">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-6 h-6 text-teal-600" aria-hidden="true" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-ink-900 mb-2">운영 시간</h2>
                      <div className="text-ink-700 space-y-1">
                        <p>평일: 오전 9시 - 오후 6시</p>
                        <p className="text-sm text-ink-700">주말 및 공휴일 휴무</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Map */}
              <div className="bg-sand-50 rounded-xl p-8 flex flex-col items-center justify-center">
                <div className="text-center mb-6">
                  <Map className="w-16 h-16 text-primary-600 mx-auto mb-4" aria-hidden="true" />
                  <h2 className="text-2xl font-bold text-ink-900 mb-2">지도</h2>
                  <p className="text-ink-700">지도 서비스를 통해 위치를 확인하세요</p>
                </div>
                <a
                  href={contact.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-500 transition-colors min-h-[44px]"
                >
                  <Map className="w-5 h-5" aria-hidden="true" />
                  지도에서 보기
                </a>
                <p className="text-sm text-ink-700 mt-4">* 지도 링크는 추후 업데이트 예정입니다.</p>
              </div>
            </div>

            {/* Transportation */}
            <div className="bg-white border border-border p-8 rounded-xl">
              <h2 className="text-2xl font-bold text-ink-900 mb-6">대중교통 이용</h2>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-ink-900 mb-3">버스</h3>
                  <p className="text-ink-700 leading-relaxed">
                    * 대중교통 정보는 추후 업데이트 예정입니다. 자세한 내용은 전화 문의 바랍니다.
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-ink-900 mb-3">주차</h3>
                  <p className="text-ink-700 leading-relaxed">
                    * 주차 정보는 추후 업데이트 예정입니다. 방문 전 전화로 문의해주시기 바랍니다.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
