// data/enterprises.ts

export type Enterprise = {
  name: string
  workers: number
  subsidy: number
  area: string
  field: string
  // 확장 필드
  desc?: string
  phone?: string
  /** public/ 아래 파일명 (예: "narumi.jpg") */
  image?: string
  tags?: string[]
  /** 카드·필드 아이콘 지정 */
  icon?: "delivery" | "store" | "reuse" | "cleaning"
}

export const enterpriseTotals = {
  workers: 20,
  subsidized: 12,
  asOf: "2024-06",
}

export const enterprises: Enterprise[] = [
  {
    name: "거제희망나르미",
    area: "사등면",
    field: "양곡 배송",
    desc: "정부 양곡배송 전문 서비스",
    phone: "055-688-3129",
    image: "na1.jpg",
    tags: ["양곡배송", "지역일자리"],
    icon: "delivery",
  },
  {
    name: "CU거제계룡점",
    area: "상문동",
    field: "편의점",
    desc: "24시간 편의점 운영",
    phone: "055-638-2380",
    image: "cugr.jpg",
    tags: ["24시", "지역상권"],
    icon: "store",
  },
  {
    name: "기부나눔마켓 리본 고현점",
    area: "고현동",
    field: "재활용품 판매",
    desc: "미사용 물품 기부·재사용 문화 확산",
    phone: "055-632-5891",
    image: "ribbon.jpg",
    tags: ["리유즈", "나눔", "순환"],
    icon: "reuse",
  },
  {
    name: "깨끗한",
    area: "사등면",
    field: "청소용역",
    desc: "전문환경관리사의 청결 솔루션",
    phone: "055-632-5890",
    image: "clean1.jpg",
    tags: ["위생관리", "현장전문"],
    icon: "cleaning",
  },
]
