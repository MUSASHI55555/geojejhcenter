import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { Breadcrumb } from "@/components/breadcrumb"
import { Footer } from "@/components/footer"

export const metadata = {
  title: "개인정보처리방침 - 거제지역자활센터",
  description: "거제지역자활센터 개인정보처리방침",
}

export default function PrivacyPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <main id="main-content" className="min-h-screen">
        <div className="bg-primary-800 text-white py-12">
          <div className="container mx-auto px-4">
            <Breadcrumb items={[{ label: "개인정보처리방침" }]} />
            <h1 className="text-4xl md:text-5xl font-bold mt-4">개인정보처리방침</h1>
          </div>
        </div>

        <div className="container mx-auto px-4 py-16">
          <div className="max-w-4xl mx-auto prose prose-lg">
            <section className="mb-12">
              <h2>제1조 (개인정보의 처리 목적)</h2>
              <p className="text-ink-700 leading-relaxed">
                거제지역자활센터는 다음의 목적을 위하여 개인정보를 처리합니다. 처리하고 있는 개인정보는 다음의 목적
                이외의 용도로는 이용되지 않으며, 이용 목적이 변경되는 경우에는 개인정보 보호법 제18조에 따라 별도의
                동의를 받는 등 필요한 조치를 이행할 예정입니다.
              </p>
              <ul className="space-y-2 text-ink-700 mt-4">
                <li>자활사업 참여자 상담 및 관리</li>
                <li>자활근로 사업 운영</li>
                <li>후원자 관리 및 기부금 영수증 발급</li>
                <li>민원 처리 및 고충 상담</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>제2조 (개인정보의 처리 및 보유 기간)</h2>
              <p className="text-ink-700 leading-relaxed">
                거제지역자활센터는 법령에 따른 개인정보 보유·이용기간 또는 정보주체로부터 개인정보를 수집 시에 동의받은
                개인정보 보유·이용기간 내에서 개인정보를 처리·보유합니다.
              </p>
            </section>

            <section className="mb-12">
              <h2>제3조 (정보주체의 권리·의무 및 그 행사방법)</h2>
              <p className="text-ink-700 leading-relaxed">
                정보주체는 거제지역자활센터에 대해 언제든지 다음 각 호의 개인정보 보호 관련 권리를 행사할 수 있습니다.
              </p>
              <ul className="space-y-2 text-ink-700 mt-4">
                <li>개인정보 열람 요구</li>
                <li>오류 등이 있을 경우 정정 요구</li>
                <li>삭제 요구</li>
                <li>처리정지 요구</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>제4조 (개인정보의 안전성 확보 조치)</h2>
              <p className="text-ink-700 leading-relaxed">
                거제지역자활센터는 개인정보의 안전성 확보를 위해 다음과 같은 조치를 취하고 있습니다.
              </p>
              <ul className="space-y-2 text-ink-700 mt-4">
                <li>관리적 조치: 내부관리계획 수립·시행, 정기적 직원 교육</li>
                <li>
                  기술적 조치: 개인정보처리시스템 등의 접근권한 관리, 접근통제시스템 설치, 고유식별정보 등의 암호화
                </li>
                <li>물리적 조치: 전산실, 자료보관실 등의 접근통제</li>
              </ul>
            </section>

            <section className="mb-12">
              <h2>제5조 (개인정보 보호책임자)</h2>
              <p className="text-ink-700 leading-relaxed">
                거제지역자활센터는 개인정보 처리에 관한 업무를 총괄해서 책임지고, 개인정보 처리와 관련한 정보주체의
                불만처리 및 피해구제 등을 위하여 아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
              </p>
              <div className="bg-sand-50 p-6 rounded-xl mt-4">
                <p className="text-ink-900 font-semibold mb-2">개인정보 보호책임자</p>
                <p className="text-ink-700">성명: TBD</p>
                <p className="text-ink-700">직책: TBD</p>
                <p className="text-ink-700">연락처: 055-688-5890-1</p>
                <p className="text-ink-700">이메일: gupostation@hanmail.net</p>
              </div>
            </section>

            <section className="mb-12">
              <h2>제6조 (개인정보 처리방침 변경)</h2>
              <p className="text-ink-700 leading-relaxed">
                이 개인정보처리방침은 시행일로부터 적용되며, 법령 및 방침에 따른 변경내용의 추가, 삭제 및 정정이 있는
                경우에는 변경사항의 시행 7일 전부터 공지사항을 통하여 고지할 것입니다.
              </p>
            </section>

            <div className="bg-primary-100 p-6 rounded-xl mt-8">
              <p className="text-ink-900 font-semibold">시행일자: 2025년 1월 1일</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
