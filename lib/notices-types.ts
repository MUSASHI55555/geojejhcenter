// lib/notices-types.ts

// 공지 첨부파일 메타 정보
export type NoticeAttachment = {
  // 사용자에게 보여줄 파일명 (원본 파일명)
  name: string
  // 실제 다운로드/열기 가능한 공개 URL (Vercel Blob URL)
  url: string
  // 선택: 바이트 단위 파일 크기
  size?: number
  // 선택: MIME 타입 (예: application/pdf, image/png)
  contentType?: string
}

// 공지 상단/본문에 노출할 이미지 메타 정보
export type NoticeImage = {
  // 실제 표시/다운로드 가능한 공개 URL (Vercel Blob URL 등)
  url: string
  // 선택: 대체 텍스트
  alt?: string
}

// 공지 본문 데이터 구조 (Blob JSON 표준 스키마)
export type Notice = {
  // 제목 (필수)
  title: string
  // 내용 (HTML 또는 plain text, 필수)
  content: string

  // 카테고리 (예: "공지", "채용", "긴급")
  category?: string

  // 생성일 (ISO 문자열)
  createdAt?: string
  // 수정일 (ISO 문자열)
  updatedAt?: string

  // 작성자 표시용
  author?: string

  // 조회수 (과거 필드와 호환)
  views?: number
  viewCount?: number

  // 상단/본문에 출력할 이미지 목록 (선택)
  // 상세 페이지에서는 content 위쪽에 먼저 노출
  images?: NoticeImage[]

  // 첨부파일 목록 (선택)
  // 공지 작성/수정 시 attachments를 포함해서 저장하면,
  // 상세 페이지에서는 이 메타 정보만으로 바로 링크 렌더링 가능.
  attachments?: NoticeAttachment[]
}
