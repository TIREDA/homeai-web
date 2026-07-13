import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

import { cn } from "@/lib/utils"
import type { MediaRow, Movie } from "@/types/media"
import { MovieCard } from "./MovieCard"

interface MovieRowProps {
  row: MediaRow
  onSelect?: (movie: Movie) => void
}

export function MovieRow({ row, onSelect }: MovieRowProps) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current
    if (!el) return
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: "smooth" })
  }

  return (
    <section className="group/row">
      <div className="mb-3 flex items-end justify-between gap-4 px-1">
        <div>
          <h2 className="text-lg font-semibold tracking-tight text-balance">{row.title}</h2>
          {row.subtitle && <p className="text-sm text-muted-foreground">{row.subtitle}</p>}
        </div>
        <div className="hidden gap-1 sm:flex">
          {[-1, 1].map((dir) => (
            <button
              key={dir}
              type="button"
              aria-label={dir === -1 ? "向左滚动" : "向右滚动"}
              onClick={() => scrollBy(dir as 1 | -1)}
              className="grid size-8 place-items-center rounded-full border border-white/10 bg-surface/80 text-muted-foreground transition-colors hover:bg-surface hover:text-foreground"
            >
              {dir === -1 ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
            </button>
          ))}
        </div>
      </div>

      <div
        ref={scrollerRef}
        className={cn(
          "no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-pl-1 pb-1",
        )}
      >
        {row.movies.map((movie) => (
          <MovieCard
            key={`${row.id}-${movie.id}`}
            movie={movie}
            onSelect={onSelect}
            className="w-[38vw] shrink-0 snap-start sm:w-44 lg:w-48"
          />
        ))}
      </div>
    </section>
  )
}
