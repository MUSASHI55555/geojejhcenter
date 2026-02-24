// components/hero-simple.tsx
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import Image from "next/image"

function TypingHeadline() {
  const line1 = "꿈과 의미 있는 삶이 있어 즐거운"
  const line2 = "거제지역 자활센터"
  const pastel = "#5CB6FF"

  const [d1, setD1] = useState("")
  const [d2, setD2] = useState("")
  const [typing1, setTyping1] = useState(true)
  const [typing2, setTyping2] = useState(false)
  const isTyping = typing1 || typing2

  const [blink, setBlink] = useState(true)

  // 크기 변경 완료 여부
  const [resized, setResized] = useState(false)

  // 데코레이션 타이밍 (꿈 dot → 의미 wave)
  const [showDot, setShowDot] = useState(false)
  const [showWave, setShowWave] = useState(false)

  // 1) 타이핑
  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches

    if (prefersReduced) {
      setD1(line1)
      setD2(line2)
      setTyping1(false)
      setTyping2(false)
      setResized(true)
      setShowDot(true)
      setShowWave(true)
      return
    }

    let t: NodeJS.Timeout | undefined

    if (typing1 && d1.length < line1.length) {
      const delay = 70 + Math.random() * 40
      t = setTimeout(() => setD1(line1.slice(0, d1.length + 1)), delay)
    } else if (typing1 && d1.length === line1.length) {
      t = setTimeout(() => {
        setTyping1(false)
        setTyping2(true)
      }, 420)
    } else if (typing2 && d2.length < line2.length) {
      const delay = 70 + Math.random() * 40
      t = setTimeout(() => setD2(line2.slice(0, d2.length + 1)), delay)
    } else if (typing2 && d2.length === line2.length) {
      setTyping2(false)
    }

    return () => t && clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [d1, d2, typing1, typing2])

  // 2) 타이핑 완료 후 1초 뒤 크기 변경
  const fullyTyped = !typing1 && !typing2 && d1 === line1 && d2 === line2

  useEffect(() => {
    if (!fullyTyped || resized) return
    const id = setTimeout(() => setResized(true), 1000)
    return () => clearTimeout(id)
  }, [fullyTyped, resized])

  // 3) 크기 변경 후 데코 순차 등장 (꿈 dot → 의미 wave)
  useEffect(() => {
    if (!resized) return

    const t1 = setTimeout(() => setShowDot(true), 300)
    const t2 = setTimeout(() => setShowWave(true), 800)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [resized])

  // 4) 캐럿 (흰색)
  useEffect(() => {
    if (!isTyping) {
      setBlink(false)
      return
    }
    const id = setInterval(() => setBlink((v) => !v), 530)
    return () => clearInterval(id)
  }, [isTyping])

  const baseStyle: React.CSSProperties = {
    lineHeight: 1.15,
    letterSpacing: "-0.01em",
    color: "#FFFFFF",
    textShadow: "0 1px 2px rgba(0,0,0,.35), 0 8px 24px rgba(0,0,0,.18)",
  }

  const transitionStyle: React.CSSProperties = {
    transition:
      "font-size 320ms ease-out, font-weight 320ms ease-out, transform 320ms ease-out, color 450ms ease-out, text-shadow 450ms ease-out, -webkit-text-stroke 450ms ease-out",
  }

  const line1Style: React.CSSProperties = {
    ...baseStyle,
    ...transitionStyle,
    fontSize: resized
      ? "clamp(1.4rem, 3.2vw, 2.4rem)"
      : "clamp(1.8rem, 4.6vw, 3.1rem)",
    fontWeight: 600,
  }

  const line2Style: React.CSSProperties = {
    ...baseStyle,
    ...transitionStyle,
    fontSize: resized
      ? "clamp(2.2rem, 5.4vw, 4rem)"
      : "clamp(1.8rem, 4.6vw, 3.1rem)",
    fontWeight: resized ? 800 : 700,
  }

  const keywordStyle = (active: boolean): React.CSSProperties => ({
    color: active ? pastel : "#FFFFFF",
    fontWeight: 900,
    WebkitTextStroke: active ? "2.4px #FFFFFF" : "0px transparent",
    textShadow: active
      ? `
        0 0 3px #FFFFFF,
        0 0 6px #FFFFFF,
        0 0 10px rgba(0,0,0,.40)
      `
      : baseStyle.textShadow,
    transition:
      "color 450ms ease-out, text-shadow 450ms ease-out, -webkit-text-stroke 450ms ease-out",
  })

  const Caret = () =>
    isTyping && blink ? (
      <span
        className="inline-block align-middle ml-1"
        style={{
          width: 2,
          height: "1em",
          backgroundColor: "#FFFFFF",
        }}
        aria-hidden="true"
      />
    ) : null

  // ----- line1 구성 (꿈과 의미 있는 삶,) -----
  let line1Node: React.ReactNode

  if (!fullyTyped) {
    line1Node = (
      <>
        {d1}
        {typing1 && <Caret />}
      </>
    )
  } else {
    line1Node = (
      <>
        {/* 꿈 + 스타카토 */}
        <span className="relative inline-block">
          꿈
          <span
            aria-hidden="true"
            style={{
              position: "absolute",
              left: "50%",
              top: "-0.3em",
              transform: showDot ? "translateX(-50%)" : "translate(-50%, -4px)",
              width: 8,
              height: 8,
              borderRadius: "999px",
              backgroundColor: pastel,
              opacity: showDot ? 1 : 0,
              transition: "opacity 280ms ease-out, transform 280ms ease-out",
            }}
          />
        </span>
        <span>과 </span>

        {/* 의미 + 물결 밑선 */}
        <span className="relative inline-block">
          의미
          <svg
            aria-hidden="true"
            viewBox="0 0 60 12"
            style={{
              position: "absolute",
              left: "50%",
              bottom: "-0.22em",
              transform: showWave
                ? "translateX(-50%)"
                : "translate(-50%, 4px)",
              width: 78,
              height: 16,
              opacity: showWave ? 1 : 0,
              transition: "opacity 220ms ease-out, transform 320ms ease-out",
            }}
          >
            <path
              d="
                M2 7
                Q 7 3, 12 7
                T 22 7
                T 32 7
                T 42 7
                T 52 7
                T 58 7
              "
              fill="none"
              stroke={pastel}
              strokeWidth={2.4}
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{
                strokeDasharray: 60,
                strokeDashoffset: showWave ? 0 : 60,
                transition: "stroke-dashoffset 500ms ease-out",
              }}
            />
          </svg>
        </span>

        <span> 있는 삶,</span>
      </>
    )
  }

  // ----- line2 구성 (거제지역 자활센터) -----
  let line2Node: React.ReactNode

  if (!fullyTyped) {
    line2Node = (
      <>
        {d2}
        {typing2 && <Caret />}
      </>
    )
  } else {
    line2Node = (
      <>
        <span className="inline-flex whitespace-nowrap">
          <span style={keywordStyle(resized)}>거제지역&nbsp;</span>
          <span className="inline-flex whitespace-nowrap">
            <span style={keywordStyle(resized)}>자활</span>
            <span style={keywordStyle(resized)}>센터</span>
          </span>
        </span>
      </>
    )
  }

  return (
    <div aria-live="polite" className="flex flex-col items-center text-center gap-2">
      <p className="font-semibold" style={line1Style}>
        {/* SEO/크롤러용: 서버 HTML에 텍스트를 남김 */}
        <span className="sr-only">{line1}</span>
        {/* 화면용(타이핑/장식): 시각적으로만 노출 */}
        <span aria-hidden="true">{line1Node}</span>
      </p>

      <h1 className="font-bold" style={line2Style}>
        {/* SEO/크롤러용: 서버 HTML에 H1 텍스트를 남김 */}
        <span className="sr-only">{line2}</span>
        {/* 화면용(타이핑/장식): 시각적으로만 노출 */}
        <span aria-hidden="true">{line2Node}</span>
      </h1>
    </div>
  )
}

export function HeroSimple() {
  return (
    <section
      className="relative min-h-[clamp(520px,90vh,1100px)] overflow-hidden"
      aria-label="메인 히어로"
    >
      {/* ggoo.png 단일 배경 이미지 */}
      <Image
        src="/ggoo.png"
        alt="거제지역자활센터 메인 이미지"
        fill
        priority
        className="object-cover"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/35 to-black/40" />

      {/* 중앙 타이핑 헤드라인 */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-4 md:px-8">
        <TypingHeadline />
      </div>
    </section>
  )
}
