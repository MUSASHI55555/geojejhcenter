// components/org-chart-image.tsx
"use client"

import Image from "next/image"
import { useState } from "react"

type Props = {
  src: string
  alt?: string
  caption?: string
}

export default function OrgChartImage({
  src,
  alt = "거제지역자활센터 조직도",
  caption = "조직도",
}: Props) {
  // 이미지 비율을 로��� 완료 후 자동 계산
  const [ratio, setRatio] = useState<number | null>(null)

  return (
    <figure className="mx-auto">
      <div className="relative rounded-xl border border-border bg-white shadow-sm">
        {/* 컨텐츠 패딩 */}
        <div className="p-3 md:p-4">
          {/* 가로폭에 맞춰 축소, 세로는 비율로 자동 */}
          <div
            className="relative w-full"
            style={{ aspectRatio: ratio ? `${ratio}` : "4 / 5" }} // 로딩 전 임시 비율
          >
            <Image
              src={src}
              alt={alt}
              fill
              sizes="(min-width: 1024px) 1000px, 100vw"
              className="object-contain rounded-lg border border-primary-100"
              onLoad={(e) => {
                const img = e.currentTarget
                if (img.naturalWidth && img.naturalHeight) {
                  setRatio(img.naturalWidth / img.naturalHeight)
                }
              }}
              priority={false}
            />
          </div>
        </div>

        {/* 하단 액션 */}
        <div className="flex items-center justify-end gap-2 px-3 pb-3 md:px-4">
          <a
            href={src}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-primary-200 px-3 py-1.5 text-sm text-primary-700 hover:bg-primary-50"
          >
            원본 보기
          </a>
          <a
            href={src}
            download
            className="rounded-md border border-primary-200 px-3 py-1.5 text-sm text-primary-700 hover:bg-primary-50"
          >
            다운로드
          </a>
        </div>
      </div>

      <figcaption className="mt-3 text-center text-sm text-ink-600">
        {caption}
      </figcaption>
    </figure>
  )
}
