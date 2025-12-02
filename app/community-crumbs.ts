// Helper to get community submenu items for breadcrumb dropdowns
export function getCommunityChildren() {
  try {
    // Read from data/menu to avoid duplication
    const { mainMenu } = require("@/data/menu")
    const communityNode = mainMenu?.find((m: any) => m?.label === "커뮤니티") ?? null
    return (communityNode?.children ?? []).map((c: any) => ({
      label: c.label,
      href: c.href,
    }))
  } catch {
    // Fallback if menu data is unavailable
    return [
      { label: "공지사항", href: "/notice" },
      { label: "갤러리", href: "/gallery" },
      { label: "후원안내", href: "/donation" },
    ]
  }
}
