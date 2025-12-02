export const gateway = {
  duration: { baseMonths: 2, extensionMonths: 1 },
  steps: [
    { id: "1", title: "초기상담", desc: "참여 의사 확인과 기본 현황 파악" },
    { id: "2", title: "심층상담", desc: "경력·건강·돌봄·부채 등 장애요소 점검" },
    { id: "3", title: "목표·계획수립", desc: "단·중기 목표와 주간 참여 패턴 도출" },
    { id: "4", title: "IAP/ISP 수립", desc: "개인별 활동·서비스 계획 문서화" },
    { id: "5", title: "교육·실습", desc: "직무·생활기술 교육과 현장 실습" },
    { id: "6", title: "경로설정", desc: "자활근로·취업·창업·자활기업 중 선택" },
    {
      id: "7",
      title: "지원체계 구축",
      desc: "복지·고용·금융·법률 등 연계망 마련",
    },
  ],
  cta: { applyHref: "/guide/apply/participation", tel: "+825568858901" },
}

export type AssetProgram = {
  code: "HSA_I" | "HSA_II" | "YNA"
  name: string
  target: string
  monthlyDeposit: string
  govMatch: string
  extraIncentive?: string
  expectedAtMaturity?: string
  notes?: string[]
}

export const assetPrograms: AssetProgram[] = [
  {
    code: "HSA_I",
    name: "희망저축계좌 I",
    target: "생계·의료급여 가구 등",
    monthlyDeposit: "TBD",
    govMatch: "TBD",
    expectedAtMaturity: "TBD",
    notes: ["Check latest notice for work/education requirements"],
  },
  {
    code: "HSA_II",
    name: "희망저축계좌 II",
    target: "주거·교육급여 수급 또는 차상위",
    monthlyDeposit: "TBD",
    govMatch: "TBD",
    expectedAtMaturity: "TBD",
    notes: ["Verify income criteria and maintenance duties"],
  },
  {
    code: "YNA",
    name: "청년내일저축계좌",
    target: "Age 19–34 with income eligibility",
    monthlyDeposit: "TBD",
    govMatch: "TBD",
    expectedAtMaturity: "TBD",
    notes: ["Confirm age/income and employment/education conditions"],
  },
]
