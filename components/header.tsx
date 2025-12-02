// components/header.tsx
"use client"

import type React from "react"
import Link from "next/link"
import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { mainMenu } from "@/data/menu"
import { Menu, X, Phone, Mail } from "lucide-react"
import { cleanLabel } from "@/lib/text"

const FIRST: Record<string, string> = {
  기관소개: "/about",
  사업안내: "/business/self-support",
  커뮤니티: "/notice",
  웹진보기: "/webzine",
}

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [authed, setAuthed] = useState(false)
  const router = useRouter()

  // ✅ 세션 상태 확인: "명시적 authed === true"만 인정
  useEffect(() => {
    let alive = true
    ;(async () => {
      try {
        const res = await fetch("/api/auth/session", {
          cache: "no-store",
          credentials: "include",
        })

        if (!res.ok) {
          if (alive) setAuthed(false)
          return
        }

        let j: any
        try {
          j = await res.json()
        } catch {
          if (alive) setAuthed(false)
          return
        }

        // 오직 이 조건 하나만 신뢰:
        // 백엔드가 "로그인 상태"일 때 { authed: true } 를 준다는 전제.
        const isAuthed = j?.authed === true

        if (alive) setAuthed(isAuthed)
      } catch {
        if (alive) setAuthed(false)
      }
    })()

    return () => {
      alive = false
    }
  }, [])

  const onLogout = async () => {
    try {
      await fetch("/api/auth/simple-login", {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      })
    } catch {
      // 무시
    } finally {
      setAuthed(false)
      router.refresh()
    }
  }

  return (
    <>
      {/* Topbar */}
      <div className="bg-primary-700 text-white py-2">
        <div className="container mx-auto pl-0 pr-4 flex items-center justify-start gap-6 text-sm">
          <a
            href="tel:0556885890"
            aria-label="Call 055-688-5890"
            className="flex items-center gap-2 hover:text-primary-200 transition-colors"
          >
            <Phone className="w-4 h-4" aria-hidden />
            <span>055-688-5890</span>
          </a>
          <span className="hidden md:inline-block text-white/20">|</span>
          <a
            href="mailto:kojejh@hanmail.net"
            className="flex items-center gap-2 hover:text-primary-200 transition-colors"
          >
            <Mail className="w-4 h-4" aria-hidden />
            <span>kojejh@hanmail.net</span>
          </a>
        </div>
      </div>

      {/* Main header */}
      <header
        role="banner"
        className="bg-white text-slate-900 sticky top-0 z-40 shadow-sm border-b border-slate-200"
>
        <div className="container mx-auto px-4">
          <div className="relative flex items-center h-20 lg:h-24">
            {/* Logo (left) */}
            <Link
              href="/"
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              {/* 아이콘 이미지 */}
              <img
                src="/jhlogo1.png"
                alt="거제지역자활센터 로고"
                width={64}
                height={64}
                className="h-12 w-auto lg:h-16"
              />

              {/* 텍스트 영역 */}
              <div className="flex flex-col leading-tight">
                <span className="text-[11px] lg:text-xs text-slate-600 font-medium">
                  사단법인 곰솔
                </span>
                <span className="text-base lg:text-xl font-bold text-[#9c1fa4] tracking-tight">
                  거제지역자활센터
                </span>
              </div>
            </Link>

            {/* Desktop navigation (center) */}
            <div className="hidden lg:block absolute left-1/2 top-0 -translate-x-1/2 h-full">
              <MegaNav />
            </div>

            {/* Desktop auth buttons (right) */}
            <div className="hidden lg:flex items-center gap-3 ml-auto">
              {authed ? (
                <button
                  onClick={onLogout}
                  className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                >
                  로그아웃
                </button>
              ) : (
                <button
                  onClick={() => router.push("/login")}
                  className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
                >
                  로그인
                </button>
              )}
            </div>

            {/* Mobile toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden ml-auto p-2 hover:bg-slate-100 rounded transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-700"
              aria-label={mobileMenuOpen ? "메뉴 닫기" : "메뉴 열기"}
              aria-expanded={mobileMenuOpen}
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-white border-t border-slate-200">
            <nav
              className="container mx-auto px-4 py-4 text-slate-900"
              aria-label="모바일 메뉴"
            >
              <MobileNav
                onClose={() => setMobileMenuOpen(false)}
                authed={authed}
                onLogout={onLogout}
              />
            </nav>
          </div>
        )}
      </header>
    </>
  )
}

/* ---------------- MegaNav (Desktop) ---------------- */

function MegaNav() {
  const [isOpen, setIsOpen] = useState(false)
  const timeoutRef = useRef<NodeJS.Timeout>()

  const open = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    setIsOpen(true)
  }

  const close = () => {
    timeoutRef.current = setTimeout(() => setIsOpen(false), 120)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") setIsOpen(false)
  }

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    },
    [],
  )

  return (
    <div
      className="relative h-full flex items-center"
      onMouseEnter={open}
      onMouseLeave={close}
      onKeyDown={handleKeyDown}
    >
      <ul role="menubar" className="flex items-center gap-16">
        {mainMenu.map((item, i) => {
          const targetHref =
            FIRST[item.label] ??
            item.children?.[0]?.href ??
            item.href ??
            "#"

          return (
            <li key={i} role="none">
              <Link
                href={targetHref}
                role="menuitem"
                aria-haspopup="true"
                aria-expanded={isOpen}
                aria-controls="mega-panel"
                className="block font-semibold text-[18px] text-ink-900 hover:text-primary-700 transition-colors"
              >
                {cleanLabel(item.label)}
              </Link>
            </li>
          )
        })}
      </ul>

      <div
        id="mega-panel"
        aria-hidden={!isOpen}
        className={[
          "absolute left-1/2 top-full -translate-x-1/2 z-30 origin-top",
          "transition-transform duration-200 ease-out",
          isOpen
            ? "scale-y-100 translate-y-0 pointer-events-auto"
            : "scale-y-0 -translate-y-2 pointer-events-none",
        ].join(" ")}
      >
        <div className="bg-white shadow-2xl ring-1 ring-black/5 rounded-b-xl rounded-t-none">
          <div className="px-10 py-7 grid grid-cols-4 gap-x-16 gap-y-2 min-w-[520px]">
            {mainMenu.map((section, colIndex) => (
              <ul
                key={colIndex}
                className="space-y-1 flex flex-col items-center"
              >
                {section.children?.map((child, j) => (
                  <li key={j} role="none" className="w-full">
                    <Link
                      href={child.href}
                      role="menuitem"
                      className="
                        flex items-center justify-center
                        w-full
                        py-1.5
                        text-sm
                        text-slate-800
                        hover:bg-primary-50
                        hover:text-primary-700
                        rounded-sm
                        transition-colors
                        whitespace-nowrap
                        text-center
                      "
                    >
                      {cleanLabel(child.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- MobileNav ---------------- */

function MobileNav({
  onClose,
  authed,
  onLogout,
}: {
  onClose: () => void
  authed: boolean
  onLogout: () => Promise<void> | void
}) {
  const [expandedItems, setExpandedItems] = useState<Set<number>>(new Set())

  const toggleExpanded = (index: number) => {
    setExpandedItems((prev) => {
      const next = new Set(prev)
      if (next.has(index)) {
        next.delete(index)
      } else {
        next.add(index)
      }
      return next
    })
  }

  return (
    <div className="space-y-2">
      {/* 상단 로그인 / 로그아웃 */}
      <div className="flex items-center gap-2 px-4 pb-2">
        {authed ? (
          <button
            onClick={async () => {
              await onLogout()
              onClose()
            }}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
          >
            로그아웃
          </button>
        ) : (
          <Link
            href="/login"
            onClick={onClose}
            className="px-3 py-1.5 rounded-md border text-sm hover:bg-gray-50"
          >
            로그인
          </Link>
        )}
      </div>

      {/* 메뉴 + 하위메뉴 */}
      {mainMenu.map((item, i) => {
        const hasChildren = item.children && item.children.length > 0
        const isExpanded = expandedItems.has(i)
        const targetHref =
          FIRST[item.label] ??
          item.children?.[0]?.href ??
          item.href ??
          "#"

        return (
          <div key={i} className="space-y-1">
            {/* Parent menu item row */}
            {hasChildren ? (
              <button
                onClick={() => toggleExpanded(i)}
                className="
                  w-full
                  flex items-center justify-between
                  px-4 py-3
                  font-medium
                  text-slate-900
                  hover:text-primary-700
                  hover:bg-primary-50
                  rounded
                  transition-colors
                  text-left
                "
                aria-expanded={isExpanded}
                aria-controls={`mobile-submenu-${i}`}
              >
                <span>{cleanLabel(item.label)}</span>
                <svg
                  className={`w-5 h-5 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  aria-hidden
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            ) : (
              <Link
                href={targetHref}
                onClick={onClose}
                className="
                  block
                  px-4 py-3
                  font-medium
                  text-slate-900
                  hover:text-primary-700
                  hover:bg-primary-50
                  rounded
                  transition-colors
                "
              >
                {cleanLabel(item.label)}
              </Link>
            )}

            {/* Children submenu */}
            {hasChildren && isExpanded && (
              <ul
                id={`mobile-submenu-${i}`}
                className="ml-4 space-y-1 mt-1"
              >
                {item.children.map((child, j) => (
                  <li key={j}>
                    <Link
                      href={child.href}
                      onClick={onClose}
                      className="
                        block
                        px-4 py-2
                        text-sm
                        text-slate-700
                        hover:text-primary-700
                        hover:bg-primary-50
                        rounded
                        transition-colors
                      "
                    >
                      {cleanLabel(child.label)}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )
      })}
    </div>
  )
}
