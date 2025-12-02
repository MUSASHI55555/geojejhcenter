// app/business/care/page.tsx
import { SkipLink } from "@/components/skip-link"
import { Header } from "@/components/header"
import { SectionHero } from "@/components/section-hero"
import { BreadcrumbBar } from "@/components/breadcrumb-bar"
import { Footer } from "@/components/footer"
import { CareContent } from "./care-content"

export const metadata = {
  title: "사회서비스사업 - 거제지역자활센터",
  description: "거제돌봄지원센터를 통해 방문요양·가족요양·방문목욕·등급상담·요양보호사 파견 서비스를 제공합니다.",
}

export default function CarePage() {
  return (
    <>
      <SkipLink />
      <Header />
      <SectionHero sectionKey="business" title="사회서비스사업" />
      <BreadcrumbBar
        topLabel="사업안내"
        topHref="/business/self-support"
        currentLabel="사회서비스사업"
        siblingsOfTop={[{ label: "사업안내", href: "/business/self-support" }]}
        siblingsOfCurrent={[
          { label: "자활사업", href: "/business/self-support" },
          { label: "자활근로사업", href: "/business/workfare" },
          { label: "자활기업", href: "/business/social-enterprise" },
          { label: "자활사례관리", href: "/business/case-management" },
          { label: "사회서비스사업", href: "/business/care" },
        ]}
      />
      <CareContent />
      <Footer />
    </>
  )
}
