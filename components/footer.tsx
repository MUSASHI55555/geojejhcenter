// components/footer.tsx
import Link from "next/link"

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="bg-ink-900 text-gray-300 text-xs">
      <div className="container mx-auto px-4 py-8 text-center space-y-1">
        <p>
          경남 거제시 두동로 1길 109(사등면) / T. 055-688-5890 / F. 055-688-5490 / 사업자등록번호 : 612-82-05196
        </p>
        <p>
          대표자 : 박로미 / E-mail :{" "}
          <a
            href="mailto:kojejh@hanmail.net"
            className="hover:text-white transition-colors"
          >
            kojejh@hanmail.net
          </a>
        </p>
        <p className="mt-1 text-gray-500">
          Copyright ⓒ {year} 거제지역자활센터. All Rights Reserved.
          {/* 필요하면 아래 주석 해제
          <span className="ml-2 text-gray-500">
            Hosting by{" "}
            <Link href="https://webplan.co.kr" className="hover:text-white">
              WEBPLAN
            </Link>
          </span>
          */}
        </p>
      </div>
    </footer>
  )
}
