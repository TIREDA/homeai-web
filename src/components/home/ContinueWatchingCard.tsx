import { Play } from "lucide-react"

import { cn } from "@/lib/utils"
import type { ContinueWatching } from "@/types/media"

export function ContinueWatchingCard({
  item,
  className,
}: {
  item: ContinueWatching
  className?: string
}) {
  return (
    <button
      type="button"
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-xl border border-white/8 bg-surface text-left",
        "transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {/* 16:9 缩略图 */}
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={item.backdropUrl || "/placeholder.svg"}
          alt={`${item.title} 剧照`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

        {/* 播放按钮 */}
        <span className="absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <span className="grid size-11 place-items-center rounded-full bg-primary/90 text-primary-foreground shadow-lg">
            <Play className="size-5 fill-current" />
          </span>
        </span>

        {/* 观看者 */}
        <span className="absolute right-2 top-2 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-medium text-foreground backdrop-blur-md">
          {item.watcher}
        </span>

        {/* 底部信息 */}
        <div className="absolute inset-x-0 bottom-0 p-2.5">
          <p className="truncate text-sm font-semibold">{item.title}</p>
          <p className="text-[11px] text-muted-foreground">剩余 {item.remainingMinutes} 分钟</p>
        </div>
      </div>

      {/* 播放进度条 */}
      <div className="h-1 w-full bg-white/10">
        <div
          className="h-full rounded-r-full bg-primary transition-all"
          style={{ width: `${item.progress}%` }}
        />
      </div>
    </button>
  )
}
