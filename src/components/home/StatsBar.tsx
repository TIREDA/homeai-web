import { Film, Sparkles, Sun, ArrowDownToLine, HardDrive } from "lucide-react"
import type { LucideIcon } from "lucide-react"

import { Skeleton } from "@/components/ui/skeleton"
import { formatBytes } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { LibrarySummary } from "@/types/media"

interface StatItem {
  icon: LucideIcon
  label: string
  value: string
  accent?: string
}

function StatUnit({ icon: Icon, label, value, accent }: StatItem) {
  return (
    <div className="flex items-center gap-2.5 px-3 py-2">
      <Icon className={cn("size-4 shrink-0", accent ?? "text-muted-foreground")} />
      <div className="flex items-baseline gap-1.5">
        <span className="text-sm font-semibold tabular-nums text-foreground">{value}</span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  )
}

interface StatsBarProps {
  summary?: LibrarySummary
  activeDownloads: number
  isLoading?: boolean
}

export function StatsBar({ summary, activeDownloads, isLoading }: StatsBarProps) {
  if (isLoading || !summary) {
    return (
      <div className="flex flex-wrap items-center gap-2 rounded-2xl border border-white/8 bg-surface/50 p-1.5">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-28 rounded-lg" />
        ))}
      </div>
    )
  }

  const freeBytes = Math.max(summary.totalStorageBytes - summary.usedStorageBytes, 0)
  const items: StatItem[] = [
    { icon: Film, label: "部电影", value: summary.totalMovies.toLocaleString(), accent: "text-primary" },
    { icon: Sparkles, label: "4K", value: summary.total4k.toString(), accent: "text-emerald-300" },
    { icon: Sun, label: "HDR", value: summary.totalHdr.toString(), accent: "text-cyan-300" },
    { icon: ArrowDownToLine, label: "下载中", value: activeDownloads.toString(), accent: "text-amber-300" },
    { icon: HardDrive, label: "已用", value: formatBytes(summary.usedStorageBytes, 0) },
    { icon: HardDrive, label: "剩余", value: formatBytes(freeBytes, 0), accent: "text-emerald-300" },
  ]

  return (
    <div className="flex flex-wrap items-center gap-x-1 gap-y-0 rounded-2xl border border-white/8 bg-surface/50 p-1.5 sm:divide-x sm:divide-white/8">
      {items.map((item) => (
        <StatUnit key={item.label} {...item} />
      ))}
    </div>
  )
}
