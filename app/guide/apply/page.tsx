import Link from "next/link"
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Footer } from "@/components/footer"
import { ContactSummary } from "@/components/contact-summary"
import { UserPlus, Heart } from "lucide-react"

export const metadata = {
  title: "참여·후원 안내 - 거제지역자활센터",
  description: "자활사업 참여 및 후원 안내",
}

export default function ApplyPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" className="min-h-screen">
        <div className="bg-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={[{ label: "참여·후원 안내" }]} />
            <h1 className="text-4xl md:text-5xl font-bold mt-4">참여·후원 안내</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            <Link
              href="/guide/apply/participation"
              className="bg-gradient-to-br from-primary-600 to-primary-500 text-white p-12 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <UserPlus className="w-10 h-10" aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-bold">참여 신청</h2>
                <p className="text-primary-200 text-lg">
                  자활사업에 참여하여 함께 자립의 길을 걸어가세요. 상담부터 참여까지 단계별로 안내해드립니다.
                </p>
                <span className="text-white font-semibold group-hover:translate-x-2 transition-transform">
                  자세히 보기 →
                </span>
              </div>
            </Link>

            <Link
              href="/guide/apply/donation"
              className="bg-gradient-to-br from-teal-600 to-teal-400 text-white p-12 rounded-2xl shadow-lg hover:shadow-xl transition-shadow group"
            >
              <div className="flex flex-col items-center text-center gap-6">
                <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                  <Heart className="w-10 h-10" aria-hidden="true" />
                </div>
                <h2 className="text-3xl font-bold">후원하기</h2>
                <p className="text-teal-100 text-lg">
                  작은 나눔이 지역을 밝힙니다. 여러분의 후원으로 더 많은 이웃이 자립의 기회를 얻을 수 있습니다.
                </p>
                <span className="text-white font-semibold group-hover:translate-x-2 transition-transform">
                  자세히 보기 →
                </span>
              </div>
            </Link>
          </div>

          <ContactSummary />
        </div>
      </main>
      <Footer />
    </>
  )
}
