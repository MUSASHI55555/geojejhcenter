import Link from "next/link"
import { ChevronRight } from "lucide-react"

type BreadcrumbItem = {
  label: string
  href?: string
}

type BreadcrumbProps = {
  items: BreadcrumbItem[]
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav aria-label="Breadcrumb" className="py-4">
      <ol className="flex items-center gap-2 text-sm flex-wrap">
        <li>
          <Link href="/" className="text-primary-600 hover:text-primary-500 transition-colors">
            홈
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <ChevronRight className="w-4 h-4 text-ink-700" aria-hidden="true" />
            {item.href && index < items.length - 1 ? (
              <Link href={item.href} className="text-primary-600 hover:text-primary-500 transition-colors">
                {item.label}
              </Link>
            ) : (
              <span className="text-ink-700 font-medium" aria-current={index === items.length - 1 ? "page" : undefined}>
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  )
}
