import { MapPin, Phone, Mail, Map } from "lucide-react"
import { contact } from "@/data/contact"

export function ContactSummary() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-ink-900 mb-8 text-center">오시는 길</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">주소</h3>
                  <p className="text-ink-700">TBD</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">전화</h3>
                  <a
                    href={`tel:${contact.telHref}`}
                    className="text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    {contact.telDisplay}
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="w-6 h-6 text-primary-600 flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-ink-900 mb-1">이메일</h3>
                  <a
                    href={`mailto:${contact.email}`}
                    className="text-primary-600 hover:text-primary-500 transition-colors"
                  >
                    {contact.email}
                  </a>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-center">
              <a
                href={contact.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-500 transition-colors min-h-[44px]"
              >
                <Map className="w-5 h-5" aria-hidden="true" />
                지도에서 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
