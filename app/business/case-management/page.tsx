// /app/business/case-management/page.tsx — CLEAN VERSION (tabs only)
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import { CaseTabs } from "@/components/case-tabs"

export const metadata = {
  title: "자활사례관리 - 거제지역자활센터",
  description: "게이트웨이 과정을 통한 개인별 맞춤 계획 수립",
}

export default function CaseManagementPage() {
  return (
    <>
      <SkipLink />
      <Header />
      <SectionHero sectionKey="business" title="자활사례관리" />
      <BreadcrumbBar
        topLabel="사업안내"
        topHref="/business/self-support"
        currentLabel="자활사례관리"
        siblingsOfTop={[{ label: "사업안내", href: "/business/self-support" }]}
        siblingsOfCurrent={[
          { label: "자활사업", href: "/business/self-support" },
          { label: "자활근로사업", href: "/business/workfare" },
          { label: "자활기업", href: "/business/social-enterprise" },
          { label: "자활사례관리", href: "/business/case-management" },
          { label: "사회서비스사업", href: "/business/care" },
        ]}
      />
      <main id="main-content" className="min-h-screen">
        <div className="container mx-auto px-4 py-16 max-w-6xl">
          {/* ✅ Only tabs; all previous gateway content above tabs is removed */}
          <CaseTabs />
        </div>
      </main>
      <Footer />
    </>
  )
}
