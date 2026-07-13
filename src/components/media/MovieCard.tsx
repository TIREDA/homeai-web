import { Star, Play, Download } from "lucide-react"

import { cn } from "@/lib/utils"
import { QUALITY_SHORT, QUALITY_META } from "@/lib/status"
import type { Movie } from "@/types/media"
import { StatusBadge } from "./StatusBadge"

interface MovieCardProps {
  movie: Movie
  className?: string
  onSelect?: (movie: Movie) => void
}

export function MovieCard({ movie, className, onSelect }: MovieCardProps) {
  const topQuality = movie.qualities.at(-1)
  const canDownload = movie.status === "not_collected" || movie.status === "in_radarr"

  return (
    <button
      type="button"
      onClick={() => onSelect?.(movie)}
      className={cn(
        "group relative flex w-full flex-col overflow-hidden rounded-xl border border-white/8 bg-surface text-left",
        "transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:shadow-xl hover:shadow-black/40",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      {/* 2:3 海报 */}
      <div className="relative aspect-[2/3] w-full overflow-hidden">
        <img
          src={movie.posterUrl || "/placeholder.svg"}
          alt={`${movie.title} 海报`}
          loading="lazy"
          className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-90" />

        {/* 画质角标 */}
        {topQuality && (
          <span
            className={cn(
              "absolute left-2 top-2 rounded-md border px-1.5 py-0.5 text-[10px] font-semibold backdrop-blur-md",
              QUALITY_META[topQuality].className,
            )}
          >
            {QUALITY_SHORT[topQuality]}
          </span>
        )}

        {/* 评分 */}
        <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-black/55 px-1.5 py-0.5 text-[11px] font-medium text-primary backdrop-blur-md">
          <Star className="size-3 fill-current" />
          {movie.voteAverage.toFixed(1)}
        </span>

        {/* hover 操作 */}
        <div className="absolute inset-x-0 bottom-0 flex translate-y-2 items-center gap-2 p-2 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <span className="flex flex-1 items-center justify-center gap-1 rounded-lg bg-primary/90 py-1.5 text-xs font-semibold text-primary-foreground">
            {canDownload ? <Download className="size-3.5" /> : <Play className="size-3.5" />}
            {canDownload ? "提交下载" : "查看详情"}
          </span>
        </div>
      </div>

      {/* 信息区 */}
      <div className="flex flex-1 flex-col gap-1.5 p-2.5">
        <div className="flex items-center justify-between gap-2">
          <h3 className="truncate text-sm font-semibold">{movie.title}</h3>
          <span className="shrink-0 text-xs text-muted-foreground">{movie.releaseYear}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <StatusBadge status={movie.status} />
        </div>
      </div>
    </button>
  )
}
