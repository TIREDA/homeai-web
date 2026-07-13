import { useEffect } from "react"
import { useLocation } from "react-router-dom"
import { X } from "lucide-react"

import { cn } from "@/lib/utils"
import { useUIStore } from "@/store/useUIStore"
import { Logo, NavItems } from "./Sidebar"
import { StorageMeter } from "./StorageMeter"

/** 移动端抽屉导航（由顶部汉堡按钮触发） */
export function MobileNav() {
  const { mobileNavOpen, closeMobileNav } = useUIStore()
  const location = useLocation()

  // 路由变化时自动关闭
  useEffect(() => {
    closeMobileNav()
  }, [location.pathname, closeMobileNav])

  // 打开时锁定滚动
  useEffect(() => {
    document.body.style.overflow = mobileNavOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [mobileNavOpen])

  return (
    <div className={cn("lg:hidden", mobileNavOpen ? "pointer-events-auto" : "pointer-events-none")}>
      {/* 遮罩 */}
      <div
        onClick={closeMobileNav}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity duration-300",
          mobileNavOpen ? "opacity-100" : "opacity-0",
        )}
      />
      {/* 抽屉 */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="主导航"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 max-w-[82vw] flex-col border-r border-sidebar-border bg-sidebar transition-transform duration-300 ease-out",
          mobileNavOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-16 items-center justify-between px-5">
          <Logo />
          <button
            type="button"
            onClick={closeMobileNav}
            aria-label="关闭导航"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground"
          >
            <X className="size-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-3 py-2">
          <NavItems onNavigate={closeMobileNav} />
        </div>
        <div className="p-3">
          <StorageMeter />
        </div>
      </aside>
    </div>
  )
}
