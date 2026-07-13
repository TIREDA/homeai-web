import { Search, Rows3, List, ArrowUpDown } from "lucide-react"

import { cn } from "@/lib/utils"
import type { QualityTag } from "@/types/media"

export type QualityFilter = "all" | QualityTag
export type SortOrder = "newest" | "oldest" | "progress"
export type ViewMode = "list" | "compact"

const QUALITY_OPTIONS: { value: QualityFilter; label: string }[] = [
  { value: "all", label: "全部画质" },
  { value: "4k", label: "4K" },
  { value: "dolby_vision", label: "Dolby Vision" },
  { value: "hdr", label: "HDR" },
  { value: "1080p", label: "1080P" },
]

const SORT_OPTIONS: { value: SortOrder; label: string }[] = [
  { value: "newest", label: "最新创建" },
  { value: "oldest", label: "最早创建" },
  { value: "progress", label: "下载进度" },
]

interface DownloadToolbarProps {
  search: string
  onSearchChange: (v: string) => void
  quality: QualityFilter
  onQualityChange: (v: QualityFilter) => void
  sort: SortOrder
  onSortChange: (v: SortOrder) => void
  view: ViewMode
  onViewChange: (v: ViewMode) => void
}

export function DownloadToolbar({
  search,
  onSearchChange,
  quality,
  onQualityChange,
  sort,
  onSortChange,
  view,
  onViewChange,
}: DownloadToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
      {/* 搜索 */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="按名称搜索任务…"
          className="h-10 w-full rounded-xl border border-white/8 bg-surface/60 pl-9 pr-3 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/40"
        />
      </div>

      <div className="flex items-center gap-2">
        {/* 画质筛选 */}
        <SelectWrap
          label="按画质筛选"
          value={quality}
          onChange={(v) => onQualityChange(v as QualityFilter)}
          options={QUALITY_OPTIONS}
        />

        {/* 排序 */}
        <div className="relative">
          <ArrowUpDown className="pointer-events-none absolute left-2.5 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <select
            aria-label="排序方式"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOrder)}
            className="h-10 appearance-none rounded-xl border border-white/8 bg-surface/60 pl-8 pr-7 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
          >
            {SORT_OPTIONS.map((o) => (
              <option key={o.value} value={o.value} className="bg-surface text-foreground">
                {o.label}
              </option>
            ))}
          </select>
        </div>

        {/* 视图切换 */}
        <div className="flex h-10 items-center rounded-xl border border-white/8 bg-surface/60 p-1">
          <ViewToggleButton
            active={view === "list"}
            onClick={() => onViewChange("list")}
            icon={Rows3}
            label="列表视图"
          />
          <ViewToggleButton
            active={view === "compact"}
            onClick={() => onViewChange("compact")}
            icon={List}
            label="紧凑视图"
          />
        </div>
      </div>
    </div>
  )
}

function SelectWrap({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: { value: string; label: string }[]
}) {
  return (
    <select
      aria-label={label}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-10 appearance-none rounded-xl border border-white/8 bg-surface/60 px-3 text-sm text-foreground outline-none transition-colors focus:border-primary/40"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value} className="bg-surface text-foreground">
          {o.label}
        </option>
      ))}
    </select>
  )
}

function ViewToggleButton({
  active,
  onClick,
  icon: Icon,
  label,
}: {
  active: boolean
  onClick: () => void
  icon: typeof List
  label: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      aria-pressed={active}
      className={cn(
        "grid size-8 place-items-center rounded-lg transition-colors",
        active ? "bg-white/10 text-foreground" : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
    </button>
  )
}
