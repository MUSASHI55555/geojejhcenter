import { permanentRedirect } from "next/navigation"

export const metadata = {
  title: "기관소개 - 거제지역자활센터",
  description: "거제지역자활센터 기관 소개",
}

export default function IntroIndexPage() {
  permanentRedirect("/intro/greeting")
}
