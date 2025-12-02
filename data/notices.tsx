export type NoticeCat = "공지" | "채용" | "교육" | "기타" | "갤러리"

export function getCategoryLabel(category: NoticeCat): string {
  // Categories are already in Korean, so just return them
  return category
}

export type Notice = {
  id: string
  title: string
  date: string // ISO format
  category: NoticeCat
  thumbnail?: string
  href: string
  excerpt?: string
  body?: string
  views?: number
  hasAttachment?: boolean
}

export const notices: Notice[] = [
  {
    id: "opening-hours-202510",
    title: "10월 운영 안내",
    date: "2025-10-20",
    category: "공지",
    href: "/notice/opening-hours-202510",
    excerpt: "운영시간·상담 안내",
    body: "<p>10월 운영시간 및 상담 안내입니다. 평일 오전 9시부터 오후 6시까지 운영합니다.</p>",
    views: 142,
    hasAttachment: true,
  },
  {
    id: "recruit-202509",
    title: "실무자(청년자활) 채용 공고",
    date: "2025-09-30",
    category: "채용",
    thumbnail: "/notice/recruit.jpg",
    href: "/notice/recruit-202509",
    views: 567,
    hasAttachment: true,
  },
  {
    id: "gallery-edu",
    title: "9월 월례교육 스냅",
    date: "2025-09-15",
    category: "갤러리",
    thumbnail: "/notice/edu.jpg",
    href: "/notice/gallery-edu",
    views: 203,
  },
  {
    id: "edu-asset-building",
    title: "자산형성 교육 프로그램 안내",
    date: "2025-09-09",
    category: "교육",
    thumbnail: "/notice/edu-asset.jpg",
    href: "/notice/edu-asset-building",
    views: 234,
  },
  {
    id: "news-grant",
    title: "자산형성 제도 변경 안내",
    date: "2025-08-29",
    category: "기타",
    href: "/notice/news-grant",
    views: 189,
  },
  {
    id: "webzine-vol1",
    title: "웹진 VOL.1 발행",
    date: "2025-08-15",
    category: "갤러리",
    thumbnail: "/notice/vol1.jpg",
    href: "/notice/webzine-vol1",
    views: 89,
  },
  {
    id: "summer-program",
    title: "여름 특별 프로그램 참가자 모집",
    date: "2025-07-20",
    category: "교육",
    href: "/notice/summer-program",
    views: 156,
  },
]
