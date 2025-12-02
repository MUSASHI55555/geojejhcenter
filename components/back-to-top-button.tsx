"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronUp } from "lucide-react"

export function BackToTopButton() {
  const [isVisible, setIsVisible] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)")
    setPrefersReducedMotion(mediaQuery.matches)

    const handleChange = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches)
    }

    mediaQuery.addEventListener("change", handleChange)
    return () => mediaQuery.removeEventListener("change", handleChange)
  }, [])

  // Handle scroll visibility
  const handleScroll = useCallback(() => {
    const scrollThreshold = 300
    setIsVisible(window.scrollY > scrollThreshold)
  }, [])

  useEffect(() => {
    // Initial check
    handleScroll()

    // Throttle scroll events for performance
    let timeoutId: NodeJS.Timeout
    const throttledScroll = () => {
      if (timeoutId) clearTimeout(timeoutId)
      timeoutId = setTimeout(handleScroll, 100)
    }

    window.addEventListener("scroll", throttledScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", throttledScroll)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [handleScroll])

  const scrollToTop = () => {
    if (prefersReducedMotion) {
      window.scrollTo({ top: 0 })
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" })
    }
  }

  return (
    <button
      type="button"
      onClick={scrollToTop}
      aria-label="맨 위로 이동"
      className={`
        fixed z-50 
        flex items-center justify-center
        rounded-full
        bg-primary text-primary-foreground
        shadow-lg
        transition-all duration-300 ease-in-out
        hover:bg-primary/90 hover:scale-110
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2
        active:scale-95
        
        ${isVisible ? "opacity-100 translate-y-0 pointer-events-auto" : "opacity-0 translate-y-2 pointer-events-none"}
        
        bottom-20 right-4 h-11 w-11
        md:bottom-24 md:right-6 md:h-12 md:w-12
        lg:bottom-8 lg:right-8 lg:h-14 lg:w-14
      `}
      style={{
        // Ensure minimum touch target size for accessibility
        minWidth: "44px",
        minHeight: "44px",
      }}
    >
      <ChevronUp className="h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7" aria-hidden="true" />
    </button>
  )
}
