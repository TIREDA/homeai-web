import { NavLink } from "react-router-dom"
import { Clapperboard } from "lucide-react"

import { cn } from "@/lib/utils"
import { NAV_ITEMS } from "@/config/nav"
import { StorageMeter } from "./StorageMeter"

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <span className="grid size-9 place-items-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/20">
        <Clapperboard className="size-5" />
      </span>
      {!compact && (
        <div className="leading-tight">
          <p className="text-base font-bold tracking-tight">HomeAI</p>
          <p className="text-[11px] text-muted-foreground">家庭影音中心</p>
        </div>
      )}
    </div>
  )
}

export function NavItems({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav className="flex flex-col gap-1">
      {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          end={to === "/"}
          onClick={onNavigate}
          className={({ isActive }) =>
            cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
              isActive
                ? "bg-primary/15 text-primary"
                : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
            )
          }
        >
          {({ isActive }) => (
            <>
              <Icon className={cn("size-5 shrink-0", isActive && "text-primary")} />
              {label}
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}

/** 桌面端固定侧边导航 */
export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 flex-col border-r border-sidebar-border bg-sidebar lg:flex">
      <div className="flex h-16 items-center px-5">
        <Logo />
      </div>
      <div className="flex-1 overflow-y-auto px-3 py-2">
        <NavItems />
      </div>
      <div className="p-3">
        <StorageMeter />
      </div>
    </aside>
  )
}
