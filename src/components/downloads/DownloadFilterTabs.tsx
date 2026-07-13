import { cn } from "@/lib/utils"
import type { MediaStatus } from "@/types/media"

export type DownloadFilter = "all" | MediaStatus

/** 下载中心顶部筛选项，顺序对应任务生命周期 */
export const DOWNLOAD_FILTERS: { key: DownloadFilter; label: string }[] = [
  { key: "all", label: "全部" },
  { key: "searching", label: "正在搜索" },
  { key: "queued", label: "等待下载" },
  { key: "downloading", label: "下载中" },
  { key: "importing", label: "等待导入" },
  { key: "in_library", label: "已完成" },
  { key: "failed", label: "失败" },
]

interface DownloadFilterTabsProps {
  active: DownloadFilter
  counts: Record<DownloadFilter, number>
  onChange: (filter: DownloadFilter) => void
}

export function DownloadFilterTabs({ active, counts, onChange }: DownloadFilterTabsProps) {
  return (
    <div
      className="-mx-1 flex gap-1.5 overflow-x-auto px-1 pb-1"
      role="tablist"
      aria-label="下载任务筛选"
    >
      {DOWNLOAD_FILTERS.map((filter) => {
        const isActive = active === filter.key
        const count = counts[filter.key] ?? 0
        return (
          <button
            key={filter.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(filter.key)}
            className={cn(
              "inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors",
              isActive
                ? "border-primary/30 bg-primary/15 text-foreground"
                : "border-white/8 bg-surface/60 text-muted-foreground hover:border-white/15 hover:text-foreground",
            )}
          >
            {filter.label}
            <span
              className={cn(
                "min-w-4 rounded-full px-1 text-center text-[11px] leading-4 tabular-nums",
                isActive ? "bg-primary/25 text-foreground" : "bg-white/8 text-muted-foreground",
              )}
            >
              {count}
            </span>
          </button>
        )
      })}
    </div>
  )
}
