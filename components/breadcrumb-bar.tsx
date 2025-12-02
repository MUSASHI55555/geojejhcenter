"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { Home, ChevronDown, ChevronRight } from "lucide-react"
import { mainMenu } from "@/data/menu"
import { cleanLabel } from "@/lib/text"

interface BreadcrumbItem {
  label: string
  href: string
}

interface BreadcrumbBarProps {
  topLabel: string
  topHref: string
  currentLabel: string
  siblingsOfTop?: BreadcrumbItem[]
  siblingsOfCurrent?: BreadcrumbItem[]
}

export function BreadcrumbBar({
  topLabel,
  topHref,
  currentLabel,
  siblingsOfTop = [],
  siblingsOfCurrent = [],
}: BreadcrumbBarProps) {
  const [topDropdownOpen, setTopDropdownOpen] = useState(false)
  const [currentDropdownOpen, setCurrentDropdownOpen] = useState(false)
  const topRef = useRef<HTMLDivElement>(null)
  const currentRef = useRef<HTMLDivElement>(null)

  const allRootSections = mainMenu.map((item) => ({
    label: cleanLabel(item.label),
    href: item.href,
  }))

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setTopDropdownOpen(false)
        setCurrentDropdownOpen(false)
      }
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (topRef.current && !topRef.current.contains(e.target as Node)) {
        setTopDropdownOpen(false)
      }
      if (currentRef.current && !currentRef.current.contains(e.target as Node)) {
        setCurrentDropdownOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <nav className="bg-sand-50 border-b border-border py-3" aria-label="Breadcrumb">
      <div className="container mx-auto px-4">
        <ol className="flex items-center gap-2 text-sm flex-wrap">
          {/* Home */}
          <li>
            <Link
              href="/"
              className="inline-flex items-center text-ink-700 hover:text-primary-600 transition-colors min-h-[44px] px-2"
              aria-label="홈으로 이동"
            >
              <Home className="w-4 h-4" aria-hidden="true" />
            </Link>
          </li>

          <ChevronRight className="w-4 h-4 text-ink-400" aria-hidden="true" />

          {/* Top Level with Dropdown - Shows ALL root sections */}
          <li className="relative" ref={topRef}>
            <button
              onClick={() => setTopDropdownOpen(!topDropdownOpen)}
              className="inline-flex items-center gap-1 text-ink-700 hover:text-primary-600 transition-colors min-h-[44px] px-2 font-medium"
              aria-expanded={topDropdownOpen}
              aria-haspopup="true"
            >
              {cleanLabel(topLabel)}
              <ChevronDown className="w-4 h-4" aria-hidden="true" />
            </button>
            {topDropdownOpen && (
              <div className="absolute top-full left-0 mt-0 bg-white border border-border shadow-lg py-2 min-w-[160px] z-50 rounded-none">
                {allRootSections.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block px-4 py-2 text-ink-700 hover:bg-sand-50 hover:text-primary-600 transition-colors"
                    onClick={() => setTopDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </li>

          <ChevronRight className="w-4 h-4 text-ink-400" aria-hidden="true" />

          {/* Current Page with Dropdown - Shows sibling child pages */}
          <li className="relative" ref={currentRef}>
            <button
              onClick={() => setCurrentDropdownOpen(!currentDropdownOpen)}
              className="inline-flex items-center gap-1 text-primary-600 font-semibold min-h-[44px] px-2"
              aria-current="page"
              aria-expanded={currentDropdownOpen}
              aria-haspopup="true"
            >
              {cleanLabel(currentLabel)}
              {siblingsOfCurrent.length > 0 && <ChevronDown className="w-4 h-4" aria-hidden="true" />}
            </button>
            {currentDropdownOpen && siblingsOfCurrent.length > 0 && (
              <div className="absolute top-full left-0 mt-0 bg-white border border-border shadow-lg py-2 min-w-[160px] z-50 rounded-none">
                {siblingsOfCurrent.map((item, index) => (
                  <Link
                    key={index}
                    href={item.href}
                    className="block px-4 py-2 text-ink-700 hover:bg-sand-50 hover:text-primary-600 transition-colors"
                    onClick={() => setCurrentDropdownOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            )}
          </li>
        </ol>
      </div>
    </nav>
  )
}
