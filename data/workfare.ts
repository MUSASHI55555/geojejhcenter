// data/workfare.ts

// ========== 팀 카드용 타입/데이터 ==========

export type WorkfareTeam = {
  name: string
  headcount: number
  summary: string
  branches?: { label: string; note?: string }[]
}

export const workfareTeams: WorkfareTeam[] = [
  {
    name: "희망도시락",
    headcount: 3,
    summary: "단체·돌봄 도시락과 식재료 가공",
    branches: [
      { label: "희망도시락", note: "단체도시락" },
      { label: "건강도시락", note: "단체도시락" },
      { label: "햇살바른김거제점", note: "조미김·다시팩·과일 간식" },
    ],
  },
  {
    name: "로컬",
    headcount: 6,
    summary: "편의점·로컬푸드·카페 운영",
    branches: [
      { label: "GS연초신우점" },
      { label: "GS거제중곡점" },
      { label: "CU거제상문점" },
      { label: "로컬푸드직매장 & 스마트팜카페(중곡점)" },
      { label: "로컬푸드직매장 & 무인카페(아주점)" },
    ],
  },
  { name: "찾아가는빨래방", headcount: 2, summary: "세탁 취약계층 대상 이동 세탁" },
  {
    name: "농축",
    headcount: 37,
    summary: "전처리·소분·배송·펫간식 등 농축 가공/물류",
    branches: [
      { label: "공공식품", note: "어린이집 과일배송" },
      { label: "농산물 전처리", note: "양파 전처리·껍질 건조" },
      { label: "농산물 소분", note: "채소류" },
      { label: "급식 배송", note: "학교 식자재" },
      { label: "애완동물 간식 제조" },
    ],
  },
  { name: "노동자작업복세탁소", headcount: 6, summary: "작업복 수거·세탁·건조" },
  {
    name: "비움",
    headcount: 9,
    summary: "제로웨이스트·업사이클·공예·문서파쇄",
    branches: [
      { label: "제로웨이스트샵 비움 거제점" },
      { label: "문서파쇄" },
      { label: "우드카빙" },
      { label: "플라스틱 업사이클" },
      { label: "뜨개" },
      { label: "라탄" },
      { label: "미싱" },
    ],
  },
  {
    name: "사회복지시설도우미",
    headcount: 3,
    summary: "지역 복지시설 근로지원",
    branches: [
      { label: "소원의항구", note: "복지시설 보조" },
      { label: "애광원", note: "복지시설 보조" },
    ],
  },
  { name: "게이트웨이", headcount: 2, summary: "신규 참여자 상담·교육·실습" },
  { name: "자활기업 인건비 지원", headcount: 12, summary: "5개 기업 중 4개소 인건비 지원" },
]

// ========== 시장진입형 - 식품·도시락·가공(희망도시락사업단) ==========

export type MarketEntry = {
  name: string
  image: string
  activities: string[]
  address: string
  phone?: string
}

export const marketSharedDescription =
  "사랑과 정성으로 만드는 도시락과 식품으로 지역의 건강한 한 끼와 자립을 함께 만들어 가는 사업단입니다."

export const marketEntries: MarketEntry[] = [
  {
    name: "두동식당",
    image: "/dodong11.jpg",
    activities: ["사등면 작업장 내 자활근로 참여자 점심식당 운영"],
    address: "경남 거제시 사등면 두동로 1길 109",
    phone: "055-688-5890",
  },
  {
    name: "희망도시락",
    image: "/h1.png", // 메인 썸네일
    activities: [
      "여름 및 겨울방학 기간 우리 아이들의 안전하고 건강한 도시락 제조·배송",
      "행복두끼프로젝트 사업 운영(결식아동 식사 제공)",
    ],
    address: "경남 거제시 거제중앙로 10길 9-1",
    phone: "055-688-5890",
  },
  {
    name: "건강도시락",
    image: "/g1.jpg",
    activities: ["여름 및 겨울방학 기간 우리 아이들의 안전하고 건강한 도시락 제조·배송", "단체 도시락 및 맞춤 도시락"],
    address: "경남 거제시 거제대로 3427",
  },
  {
    name: "햇살바른김거제점",
    image: "/slide5.jpg",
    activities: [
      "국내산 김을 활용하여 HACCP 시설 제조",
      "조미김 및 다시팩 생산",
      "초등돌봄교실 학기 중 과일 간식 제조·배송",
    ],
    address: "경남 거제시 산촌명진길 42-30",
  },
]

// ========== 시장진입형 - 로컬사업단(편의·로컬·카페) ==========

export const retailSharedDescription =
  "사회공헌형 편의점 운영과 로컬푸드 직매장·스마트팜 카페를 통해 신선한 먹거리와 편안한 휴식 공간을 제공합니다."

export type RetailEntry = {
  name: string
  image: string
  activities: string[]
  address: string
  phone?: string
}

export const retailEntries: RetailEntry[] = [
  {
    name: "GS연초신우점",
    image: "/sinugs.jpg",
    activities: ["사회공헌형 편의점 운영"],
    address: "경남 거제시 연초면 죽토로 2",
    phone: "055-641-9913",
  },
  {
    name: "GS거제중곡점",
    image: "/jggs.jpg",
    activities: ["사회공헌형 편의점 운영"],
    address: "경남 거제시 중곡로 3길 41",
    phone: "055-633-6065",
  },
  {
    name: "CU거제상문점",
    image: "/smcu.jpg",
    activities: ["사회공헌형 편의점 운영"],
    address: "경남 거제시 수양로 40",
  },
  {
    name: "카페여해",
    image: "/yeohae.jpg",
    activities: ["음료 및 디저트 제공", "자활생산품 전시·판매"],
    address: "경남 거제시 팔랑포2길 87",
  },
  {
    name: "로컬푸드직매장 & 스마트팜카페(거제로컬누리센터 중곡점)",
    image: "/smart1.jpg",
    activities: ["지역 농산물 직매장 운영", "스마트팜을 연계한 브런치·카페 공간 제공"],
    address: "경남 거제시 중곡1로 54",
  },
  {
    name: "로컬푸드직매장 & 무인카페(거제로컬누리센터 아주점)",
    image: "/muin1.jpg",
    activities: ["지역 농산물 직매장 운영", "무인 카페 운영으로 편리한 휴식 공간 제공"],
    address: "경남 거제면 서정리 700", // 실제 지번 주소 있으면 여기로 교체
  },
]

// ========== 시장진입형 - 찾아가는빨래방 ==========

export type LaundryEntry = {
  name: string
  image?: string
  description: string[]
  areas?: string[]
  phones: string[]
}

export const laundryEntry: LaundryEntry = {
  name: "찾아가는빨래방",
  image: "/bbalrae.jpg",
  description: [
    "이동식 세탁 차량으로 거제, 통영, 고성, 사천 지역의 어르신과 취약계층을 지원합니다.",
    "세탁 취약가구와 복지 사각지대 가정을 직접 찾아가는 맞춤형 세탁 서비스입니다.",
  ],
  phones: ["055-688-5890", "055-602-1636"],
}

// ===== 공통 타입 =====

export type ServiceOffering = {
  title: string
  bullets?: string[]
  image?: string
  notes?: string
}

export type ServiceSite = {
  address: string
  phone?: string
  area?: string
  image?: string
  mapUrl?: string
  description?: string
  offerings: ServiceOffering[]
}

// ========== 섹터 1: 복지·돌봄 지원 ==========

export const serviceCareSharedDescription = ""

export const serviceCareSharedPhone = "055-688-5890"

export const serviceCareSites: ServiceSite[] = []

export const serviceCareEntries: MarketEntry[] = []

// ========== 섹터 2: 세탁 지원·클리닝 ==========

export const serviceLaundrySharedDescription = ""

export const serviceLaundryEntries: MarketEntry[] = []

// ========== 섹터 3: 공공·환경/자원순환 ==========

export const servicePublicEnvSharedDescription = ""

// 이후 리팩토링 시 PublicEnvSite 타입 정의 후 연결 예정
export const servicePublicEnvSites: any[] = []

// ========== 인턴·도우미형 — 사회복지시설도우미 ==========

export type InternHelper = {
  name: string
  activities: string[]
  address: string
  phone: string
  partners?: string[]
  image?: string
  mapUrl?: string
  notes?: string
}

export const internHelperEntry: InternHelper = {
  name: "사회복지시설도우미",
  activities: ["사회복지시설에 보조인력 지원"],
  address: "경남 거제시 사등면 두동로 1길 109",
  phone: "055-688-5890",
  partners: ["소원의항구", "애광원"],
  // image: "/helper.jpg",
}
