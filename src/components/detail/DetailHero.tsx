import { Star, Clock, Calendar } from "lucide-react"

import { formatRuntime } from "@/lib/format"
import { StatusBadge, QualityBadge } from "@/components/media/StatusBadge"
import type { MovieDetail } from "@/types/media"

export function DetailHero({ movie }: { movie: MovieDetail }) {
  return (
    <header className="relative -mx-4 -mt-4 sm:-mx-6 sm:-mt-6 lg:-mx-8">
      {/* 背景剧照 */}
      <div className="relative h-[46vh] min-h-72 w-full overflow-hidden sm:h-[52vh]">
        <img
          src={movie.backdropUrl || "/placeholder.svg"}
          alt=""
          className="size-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/70 to-background/20" />
        <div className="absolute inset-0 bg-gradient-to-r from-background/85 via-background/20 to-transparent" />
      </div>

      {/* 覆盖内容 */}
      <div className="absolute inset-x-0 bottom-0">
        <div className="mx-auto flex max-w-6xl gap-4 px-4 pb-2 sm:gap-6 sm:px-6 lg:px-8">
          {/* 海报 */}
          <img
            src={movie.posterUrl || "/placeholder.svg"}
            alt={`${movie.title} 海报`}
            className="hidden aspect-[2/3] w-40 shrink-0 rounded-xl border border-white/10 object-cover shadow-2xl shadow-black/50 sm:block lg:w-48"
          />

          {/* 信息 */}
          <div className="min-w-0 flex-1 space-y-3 pb-2">
            <div className="flex flex-wrap items-center gap-2">
              <StatusBadge status={movie.status} />
              {movie.qualities.map((q) => (
                <QualityBadge key={q} quality={q} />
              ))}
            </div>

            <div>
              <h1 className="text-2xl font-bold tracking-tight text-balance sm:text-4xl">
                {movie.title}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground sm:text-base">
                {movie.originalTitle}
              </p>
            </div>

            {movie.tagline && (
              <p className="text-sm italic text-foreground/80">{movie.tagline}</p>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span className="flex items-center gap-1 font-medium text-primary">
                <Star className="size-4 fill-current" />
                {movie.voteAverage.toFixed(1)}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="size-4" />
                {movie.releaseYear}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-4" />
                {formatRuntime(movie.runtimeMinutes)}
              </span>
              <div className="flex flex-wrap gap-1.5">
                {movie.genres.map((g) => (
                  <span key={g.id} className="rounded-full border border-white/10 px-2 py-0.5 text-xs">
                    {g.name}
                  </span>
                ))}
              </div>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-foreground/85">
              {movie.overview}
            </p>
          </div>
        </div>
      </div>
    </header>
  )
}
