import { useEffect, useState } from "react"
import { Play, Plus, Star, Info } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatRuntime } from "@/lib/format"
import type { Movie } from "@/types/media"
import { StatusBadge } from "./StatusBadge"

interface HeroBannerProps {
  movies: Movie[]
  /** movieId -> 下载进度 0-100，用于展示 Hero 下载状态 */
  downloadProgress?: Record<number, number>
  /** 打开影片详情 */
  onOpenDetail?: (movie: Movie) => void
}

export function HeroBanner({ movies, downloadProgress, onOpenDetail }: HeroBannerProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (movies.length <= 1) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % movies.length), 7000)
    return () => clearInterval(timer)
  }, [movies.length])

  if (movies.length === 0) return null
  const movie = movies[index]

  const inLibrary = movie.status === "in_library"
  const isDownloading = movie.status === "downloading"
  const progress = downloadProgress?.[movie.id]

  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/8">
      {/* 背景剧照 16:9 */}
      <div className="relative aspect-[16/9] max-h-[62vh] w-full sm:aspect-[21/9]">
        {movies.map((m, i) => (
          <img
            key={m.id}
            src={m.backdropUrl || "/placeholder.svg"}
            alt=""
            aria-hidden={i !== index}
            className={cn(
              "absolute inset-0 size-full object-cover transition-opacity duration-1000",
              i === index ? "opacity-100" : "opacity-0",
            )}
          />
        ))}
        {/* 渐变叠层 */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/55 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/30 to-transparent" />
      </div>

      {/* 内容 */}
      <div className="absolute inset-0 flex flex-col justify-end gap-4 p-5 sm:max-w-2xl sm:p-8 lg:p-10">
        <div className="flex flex-wrap items-center gap-2">
          <StatusBadge status={movie.status} />
          <span className="flex items-center gap-1 text-sm font-medium text-primary">
            <Star className="size-3.5 fill-current" />
            {movie.voteAverage.toFixed(1)}
          </span>
          <span className="text-sm text-muted-foreground">
            {movie.releaseYear} · {formatRuntime(movie.runtimeMinutes)}
          </span>
        </div>

        <h1 className="text-3xl font-bold tracking-tight text-balance sm:text-5xl">
          {movie.title}
        </h1>
        <p className="text-sm text-muted-foreground">{movie.originalTitle}</p>

        <p className="line-clamp-2 max-w-xl text-sm leading-relaxed text-foreground/85 sm:line-clamp-3 sm:text-base">
          {movie.overview}
        </p>

        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          {movie.genres.map((g) => (
            <span key={g.id} className="rounded-full border border-white/10 px-2.5 py-0.5">
              {g.name}
            </span>
          ))}
        </div>

        {/* 下载进度（仅正在下载时显示） */}
        {isDownloading && typeof progress === "number" && (
          <div className="max-w-md space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-primary">正在下载 4K 片源</span>
              <span className="font-semibold tabular-nums">{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
              <div
                className="h-full rounded-full bg-primary transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}

        <div className="mt-1 flex flex-wrap items-center gap-3">
          <Button size="lg" className="gap-1.5" onClick={() => onOpenDetail?.(movie)}>
            <Play className="size-4 fill-current" />
            立即播放
          </Button>
          <Button
            size="lg"
            variant="secondary"
            className="gap-1.5"
            onClick={() => onOpenDetail?.(movie)}
          >
            <Info className="size-4" />
            查看详情
          </Button>
          {!inLibrary && (
            <Button
              size="lg"
              variant="ghost"
              className="gap-1.5"
              onClick={() => onOpenDetail?.(movie)}
            >
              <Plus className="size-4" />
              加入 4K
            </Button>
          )}
        </div>

        {/* 轮播指示器 */}
        {movies.length > 1 && (
          <div className="mt-2 flex gap-1.5">
            {movies.map((m, i) => (
              <button
                key={m.id}
                type="button"
                aria-label={`切换到 ${m.title}`}
                onClick={() => setIndex(i)}
                className={cn(
                  "h-1 rounded-full transition-all",
                  i === index ? "w-8 bg-primary" : "w-4 bg-white/25 hover:bg-white/40",
                )}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
