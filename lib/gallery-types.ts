// lib/gallery-types.ts

export type ThumbnailFocus = "top" | "center" | "bottom"

// Gallery image metadata
export type GalleryImage = {
  url: string
  alt?: string
}

// Gallery item data structure (Blob JSON schema)
export type GalleryItem = {
  // blob key (galleries/...)
  key: string

  // 제목
  title: string

  // 설명/본문 (선택)
  description?: string

  // 카테고리 (예: "행사", "교육", "현장스냅")
  category?: string

  // 생성일 / 수정일 (ISO 문자열)
  createdAt: string
  updatedAt?: string

  // 이미지 (1..N)
  images: GalleryImage[]

  // 대표 이미지 선택 (index into images[] + focus position)
  thumbnail?: {
    imageIndex: number           // 0-based index into images[]
    focus?: ThumbnailFocus       // optional, default "center"
  }

  // 작성자
  author?: string

  // 조회수 (과거/현재 호환)
  viewCount?: number
  views?: number
}
