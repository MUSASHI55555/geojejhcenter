// data/history.ts

export interface TimelineEvent {
  date: string
  description: string
  highlight?: boolean
}

export interface TimelineSection {
  id: string
  title: string
  subtitle?: string
  color: "navy" | "teal" | "green"
  events: TimelineEvent[]
}

export const historyData: TimelineSection[] = [
  {
    id: "origins",
    title: "자활의 모태",
    subtitle: "Origins of Self-Sufficiency",
    color: "green",
    events: [
      {
        date: "1970",
        description:
          "해방과 전쟁 이후 우리사회가 급속하게 산업화되면서 나타난 도시빈민문제를 지원하고 해결하기 위해 진행되어 온 도시빈민운동",
        highlight: true,
      },
      {
        date: "1990",
        description:
          "도시빈민운동의 일환으로 스페인 몬드라곤 협동조합복합체를 모델로 하여, 단순 일자리 해결을 넘어 봉제·건축 등 업종에서 공동 생산을 통해 열악한 노동조건과 불합리한 하청구조를 극복하고자 했던 생산공동체 운동",
      },
      {
        date: "1996",
        description: "'자활지원센터' 명칭으로 자활시범사업 시작",
      },
      {
        date: "1997",
        description:
          "외환위기로 실업자가 급증하며 실업·빈곤 문제에 대응하기 위해 국민기초생활보장법 제정, 전국 시·군·구 지역자활센터 지정, 수급자 중심 빈곤 탈출 및 경제적 자립 지원 역할 부여 (현재 전국 247개소 자활센터 운영의 기반)",
        highlight: true,
      },
    ],
  },
  {
    id: "geoje-origins",
    title: "거제자활의 모태",
    subtitle: "Origins in Geoje",
    color: "teal",
    events: [
      {
        date: "2000.12",
        description: "거제사회복지지원센터(비영리민간단체) 설립",
        highlight: true,
      },
      {
        date: "2001.01",
        description: "실업극복운동 참여, 지역 저소득 주민을 위한 조사·연구 및 지원사업 전개",
      },
    ],
  },
  {
    id: "center-history",
    title: "거제지역자활센터 발걸음",
    subtitle: "History of the Center",
    color: "navy",
    events: [
      {
        date: "2001.12",
        description: "보건복지부 제167호 경남거제자활후견기관 지정",
        highlight: true,
      },
      { date: "2002.04", description: "개관식(옥파) 및 사업설명회" },
      { date: "2007.07", description: "경남거제지역자활센터로 명칭 변경" },
      { date: "2007.10", description: "공동작업장 '바랄에모여' 개소" },
      {
        date: "2007.09\n–2010.10",
        description: "자활속삭임 1호점(중곡) 운영",
      },
      {
        date: "2008.06\n–2019.12",
        description: "가사간병바우처사업 운영",
      },
      {
        date: "2008.10\n–2011.09",
        description: "자활속삭임 2호점(옥포) 운영",
      },
      { date: "2009.06", description: "사무실 이전(고현) 및 개소식" },
      {
        date: "2009.10\n–2019.12",
        description: "노인돌봄바우처사업 운영",
      },
      {
        date: "2010.01",
        description: "지역자활센터 규모별 평가 '확대형' 선정",
        highlight: true,
      },
      { date: "2010.10", description: "삼성중공업 지원 희망누리농장(블루베리) 설치" },
      {
        date: "2011.08",
        description: "거제지역자활센터 10주년 기념 리본 나눔장터",
        highlight: true,
      },
      { date: "2011.09", description: "자활매장 기부나눔마켓 리본 개소" },
      {
        date: "2011.11\n–2015.04",
        description: "자활매장 버블커피하우스 운영",
      },
      {
        date: "2015.04",
        description: "자활매장 기부나눔마켓 리본 옥포점, 우리집인테리어 개소",
      },
      {
        date: "2015.09\n–2017.08",
        description: "자활매장 카페알프레도 운영",
      },
      { date: "2016.10", description: "경남자활가족한마당 공동주관" },
      {
        date: "2016.02\n–2022.10",
        description: "조선업 희망센터 내 '카페희망' 운영",
      },
      {
        date: "2017.09\n–2019.02",
        description: "고현시장 주차장 해양먹거리장터 '카페 바다방' 운영",
      },
      {
        date: "2018.02",
        description: "거제지역자활센터 신축 완공",
        highlight: true,
      },
      { date: "2018.07", description: "거제지역자활센터 신축 이전 개소식" },
      {
        date: "2019.01",
        description: "사회공헌 CU거제계룡점 운영, 우체국택배 위탁배송",
      },
      {
        date: "2020.01",
        description: "우드·뜨개·미싱 소품제작 공방 운영",
      },
      {
        date: "2021.01",
        description: "자활근로 공동작업장 증식 판매 및 삐사감러브스테이크 운영",
      },
      {
        date: "2021.07",
        description: "노동자작업복세탁소 위탁운영",
      },
      {
        date: "2022.01",
        description: "제로웨이스트 비움 운영, 출장세차사업 운영",
      },
      {
        date: "2022.01",
        description:
          "사회공헌형 편의점(GS25연초신우점, GS25중곡점), 옥포대첩기념공원 카페여해, 반려견 간식제조 OEM 운영",
      },
      {
        date: "2023.01",
        description: "햇살바른김 거제점 운영 시작",
      },
      {
        date: "2023.01",
        description: "어린이집 과일간식 납품 시작",
      },
      {
        date: "2025.01",
        description: "운영법인 명칭을 '사단법인 곰솔'로 변경",
        highlight: true,
      },
    ],
  },
]
