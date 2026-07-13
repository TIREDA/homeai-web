import { Home, Compass, Library, Download, Sparkles, Settings, type LucideIcon } from "lucide-react"

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
}

export const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "首页", icon: Home },
  { to: "/discover", label: "发现", icon: Compass },
  { to: "/library", label: "媒体库", icon: Library },
  { to: "/downloads", label: "下载中心", icon: Download },
  { to: "/assistant", label: "AI 助手", icon: Sparkles },
  { to: "/settings", label: "系统设置", icon: Settings },
]
