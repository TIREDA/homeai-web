import { Menu, Search, Bell } from "lucide-react"

import { useUIStore } from "@/store/useUIStore"
import { Logo } from "./Sidebar"

/** 顶部栏：移动端汉堡 + logo，桌面端搜索，右侧通知与头像 */
export function TopBar() {
  const openMobileNav = useUIStore((s) => s.openMobileNav)

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/8 bg-background/80 px-4 backdrop-blur-xl sm:px-6">
      <button
        type="button"
        onClick={openMobileNav}
        aria-label="打开导航"
        className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
      >
        <Menu className="size-5" />
      </button>

      <div className="lg:hidden">
        <Logo compact />
      </div>

      {/* 搜索 */}
      <div className="relative ml-auto hidden w-full max-w-sm items-center sm:flex lg:ml-0">
        <Search className="pointer-events-none absolute left-3 size-4 text-muted-foreground" />
        <input
          type="search"
          placeholder="搜索电影、演员或标签…"
          className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.04] pl-9 pr-3 text-sm outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40 focus:bg-white/[0.06]"
        />
      </div>

      <div className="ml-auto flex items-center gap-2 sm:ml-4">
        <button
          type="button"
          aria-label="搜索"
          className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground sm:hidden"
        >
          <Search className="size-5" />
        </button>
        <button
          type="button"
          aria-label="通知"
          className="relative grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
        >
          <Bell className="size-5" />
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary ring-2 ring-background" />
        </button>
        <span
          className="grid size-9 place-items-center rounded-full bg-gradient-to-br from-primary to-amber-600 text-sm font-semibold text-primary-foreground"
          aria-label="家庭账户"
        >
          家
        </span>
      </div>
    </header>
  )
}
