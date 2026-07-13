import { Star, Play, Info, Plus } from "lucide-react"

import { cn } from "@/lib/utils"
import { QUALITY_SHORT, QUALITY_META } from "@/lib/status"
import type { Movie } from "@/types/media"
import { StatusBadge } from "@/components/media/StatusBadge"

interface AssistantMovieCardProps {
  movie: Movie
  onOpen: (movie: Movie) => void
  onDownload: (movie: Movie) => void
  onPlay: (movie: Movie) => void
}

/**
 * AI 结果中的影片卡片：横向布局，突出关键信息与操作。
 * 展示海报、中文名、年份、评分、入库状态、当前画质，
 * 以及「查看详情 / 加入 4K / 播放」三个操作。
 */
export function AssistantMovieCard({ movie, onOpen, onDownload, onPlay }: AssistantMovieCardProps) {
  const inLibrary = movie.status === "in_library"
  const has4k = movie.qualities.includes("4k")
  const topQuality = movie.qualities.at(-1)

  return (
    <div className="flex gap-3 rounded-xl border border-white/8 bg-background/40 p-2.5 transition-colors hover:border-white/15">
      <button
        type="button"
        onClick={() => onOpen(movie)}
        className="relative shrink-0 overflow-hidden rounded-lg"
        aria-label={`查看 ${movie.title} 详情`}
      >
        <img
          src={movie.posterUrl || "/placeholder.svg"}
          alt=""
          className="h-32 w-[86px] object-cover"
        />
        {topQuality && (
          <span
            className={cn(
              "absolute left-1 top-1 rounded border px-1 py-0.5 text-[9px] font-semibold backdrop-blur-md",
              QUALITY_META[topQuality].className,
            )}
          >
            {QUALITY_SHORT[topQuality]}
          </span>
        )}
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h4 className="truncate text-sm font-semibold text-foreground">{movie.title}</h4>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {movie.releaseYear} · {movie.genres.map((g) => g.name).join(" / ")}
            </p>
          </div>
          <span className="flex shrink-0 items-center gap-1 text-xs font-medium text-primary">
            <Star className="size-3 fill-current" />
            {movie.voteAverage.toFixed(1)}
          </span>
        </div>

        <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
          <StatusBadge status={movie.status} />
        </div>

        {/* 操作 */}
        <div className="mt-auto flex flex-wrap items-center gap-1.5 pt-2">
          {inLibrary ? (
            <ActionBtn icon={Play} label="播放" primary onClick={() => onPlay(movie)} />
          ) : (
            <ActionBtn icon={Plus} label={has4k ? "补齐 4K" : "加入 4K"} primary onClick={() => onDownload(movie)} />
          )}
          <ActionBtn icon={Info} label="详情" onClick={() => onOpen(movie)} />
        </div>
      </div>
    </div>
  )
}

function ActionBtn({
  icon: Icon,
  label,
  primary,
  onClick,
}: {
  icon: typeof Play
  label: string
  primary?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium transition-colors",
        primary
          ? "bg-primary text-primary-foreground hover:bg-primary/85"
          : "bg-white/6 text-foreground hover:bg-white/12",
      )}
    >
      <Icon className="size-3.5" />
      {label}
    </button>
  )
}
