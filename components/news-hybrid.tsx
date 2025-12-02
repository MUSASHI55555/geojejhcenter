"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { notices, type NoticeCat, getCategoryLabel } from "@/data/notices"
import { Calendar } from "lucide-react"

const categories: (NoticeCat | "전체")[] = ["전체", "NOTICE", "GALLERY", "WEBZINE"]

export function NewsHybrid() {
  const [activeCategory, setActiveCategory] = useState<NoticeCat | "전체">("전체")

  const filteredNotices = activeCategory === "전체" ? notices : notices.filter((n) => n.category === activeCategory)

  const listItems = filteredNotices.slice(0, 5)
  const thumbnailItems = filteredNotices.filter((n) => n.thumb).slice(0, 3)

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-ink-900">소식</h2>
          <Link href="/notice" className="text-primary-600 hover:text-primary-500 font-medium transition-colors">
            전체보기 →
          </Link>
        </div>

        {/* Category filter chips */}
        <div className="flex flex-wrap gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full font-medium transition-colors min-h-[44px] ${
                activeCategory === cat
                  ? "bg-primary-600 text-white"
                  : "bg-primary-200 text-primary-700 hover:bg-primary-600 hover:text-white"
              }`}
            >
              {cat === "전체" ? cat : getCategoryLabel(cat)}
            </button>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* List view */}
          <div className="space-y-4">
            {listItems.map((notice) => (
              <Link
                key={notice.slug}
                href={`/notice/${notice.slug}`}
                className="block p-4 border border-border rounded-lg hover:border-primary-600 hover:shadow-md transition-all group"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-ink-900 group-hover:text-primary-600 transition-colors mb-2 truncate">
                      {notice.title}
                    </h3>
                    {notice.excerpt && <p className="text-sm text-ink-700 line-clamp-2">{notice.excerpt}</p>}
                  </div>
                  <div className="flex flex-col items-end gap-2 flex-shrink-0">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        notice.category === "NOTICE"
                          ? "bg-primary-200 text-primary-700"
                          : notice.category === "GALLERY"
                            ? "bg-teal-100 text-teal-600"
                            : "bg-sand-50 text-ink-700"
                      }`}
                    >
                      {getCategoryLabel(notice.category)}
                    </span>
                    <div className="flex items-center gap-1 text-xs text-ink-700">
                      <Calendar className="w-3 h-3" aria-hidden="true" />
                      <time dateTime={notice.date}>{notice.date}</time>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Thumbnail view */}
          <div className="grid gap-4">
            {thumbnailItems.map((notice) => (
              <Link
                key={notice.slug}
                href={`/notice/${notice.slug}`}
                className="group relative overflow-hidden rounded-lg aspect-video bg-sand-50"
              >
                {notice.thumb ? (
                  <Image
                    src={notice.thumb || "/placeholder.svg"}
                    alt=""
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-ink-700">이미지 없음</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-ink-900/80 to-transparent flex items-end p-4">
                  <div className="text-white">
                    <h3 className="font-semibold mb-1 text-balance">{notice.title}</h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="px-2 py-1 bg-white/20 rounded">{getCategoryLabel(notice.category)}</span>
                      <time dateTime={notice.date}>{notice.date}</time>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
