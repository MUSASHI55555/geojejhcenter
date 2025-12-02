// data/gateway.ts
export const gateway = {
  hero: {
    title: "게이트웨이",
    subtitle: "참여 전 2개월, 맞춤 자립경로 설계 프로그램",
    kpis: [
      { label: "대상", value: "신규·기존 참여자" },
      { label: "기간", value: "2개월(+1개월 연장)" },
      { label: "출력물", value: "IAP/ISP" },
    ],
  },
  process: [
    { key: "counsel", title: "상담/진단", desc: "참여 여부 확인, 근로방해요소 파악", icon: "MessageSquare" },
    { key: "plan", title: "계획수립", desc: "개인별 IAP/ISP 수립", icon: "ListChecks" },
    { key: "train", title: "교육·실습", desc: "맞춤 교육·실습 실행", icon: "GraduationCap" },
    { key: "decide", title: "경로확정", desc: "자활근로·취업·창업 연계", icon: "CheckCircle2" },
  ],
  steps: [
    { step: 1, title: "상담", items: ["초기상담(참여여부 결정)", "심층상담(정보수집·근로장애요소 파악)"] },
    { step: 2, title: "계획수립·실행", items: ["IAP·ISP 계획수립", "교육훈련 계획 실행"] },
    { step: 3, title: "연계", items: ["자활근로 참여", "취업·창업 지원"] },
  ],
  faq: [
    { q: "기간은 얼마나 걸리나요?", a: "기본 2개월이며, 필요 시 1개월 연장 가능합니다." },
    { q: "중간에 경로를 바꿀 수 있나요?", a: "상담을 통해 재설계가 가능합니다." },
    { q: "비용이 드나요?", a: "대부분 무료이며, 일부 교육·실습에 따라 상이할 수 있습니다." },
    { q: "어떤 서류가 필요한가요?", a: "신분증 등 기본 서류가 필요하며 상담 시 안내드립니다." },
  ],
}
