import { useNavigate } from "react-router-dom"
import { Film, PauseCircle } from "lucide-react"

import type { Movie } from "@/types/media"
import { HeroBanner } from "@/components/media/HeroBanner"
import { MovieRow } from "@/components/media/MovieRow"
import { DownloadTaskCard } from "@/components/media/DownloadTaskCard"
import { AiPrompt } from "@/components/home/AiPrompt"
import { StatsBar } from "@/components/home/StatsBar"
import { ContinueWatchingRow } from "@/components/home/ContinueWatchingRow"
import { SectionHeader } from "@/components/home/SectionHeader"
import {
  HeroSkeleton,
  RowSkeleton,
  ContinueWatchingSkeleton,
  DownloadSkeleton,
} from "@/components/home/HomeSkeletons"
import { EmptyState, ErrorState } from "@/components/common/StateViews"
import {
  useHomeRows,
  useFeatured,
  useDownloads,
  useLibrarySummary,
  useContinueWatching,
} from "@/hooks/queries"

export function HomePage() {
  const navigate = useNavigate()
  const openMovie = (movie: Movie) => navigate(`/movies/${movie.tmdbId}`)

  const featured = useFeatured()
  const rows = useHomeRows()
  const downloads = useDownloads()
  const library = useLibrarySummary()
  const continueWatching = useContinueWatching()

  const activeDownloads =
    downloads.data?.filter((t) => t.status === "downloading" || t.status === "queued") ?? []

  const downloadProgress = Object.fromEntries(
    (downloads.data ?? []).map((t) => [t.movieId, t.progress]),
  )

  return (
    <div className="space-y-9 pb-16">
      {/* 1. Hero */}
      {featured.isLoading ? (
        <HeroSkeleton />
      ) : featured.isError ? (
        <ErrorState className="aspect-[21/9]" onRetry={() => featured.refetch()} />
      ) : (
        <HeroBanner
          movies={featured.data ?? []}
          downloadProgress={downloadProgress}
          onOpenDetail={openMovie}
        />
      )}

      {/* 2. AI 快捷输入 */}
      <AiPrompt />

      {/* 3. 数据概览信息栏 */}
      <StatsBar
        summary={library.data}
        activeDownloads={activeDownloads.length}
        isLoading={library.isLoading}
      />

      {/* 4. 正在下载 */}
      <section aria-label="正在下载">
        <SectionHeader
          title="正在下载"
          action={
            activeDownloads.length > 0 ? (
              <span className="text-sm text-muted-foreground">{activeDownloads.length} 个任务</span>
            ) : undefined
          }
        />
        {downloads.isLoading ? (
          <DownloadSkeleton />
        ) : downloads.isError ? (
          <ErrorState onRetry={() => downloads.refetch()} />
        ) : activeDownloads.length === 0 ? (
          <EmptyState
            icon={PauseCircle}
            title="暂无下载任务"
            description="在发现页提交影片后，下载进度会实时显示在这里。"
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {activeDownloads.map((task) => (
              <DownloadTaskCard key={task.id} task={task} />
            ))}
          </div>
        )}
      </section>

      {/* 5. 继续观看 */}
      <section aria-label="继续观看">
        {continueWatching.isLoading ? (
          <>
            <SectionHeader title="继续观看" subtitle="接着上次的进度" />
            <ContinueWatchingSkeleton />
          </>
        ) : continueWatching.isError ? (
          <>
            <SectionHeader title="继续观看" />
            <ErrorState onRetry={() => continueWatching.refetch()} />
          </>
        ) : (
          <ContinueWatchingRow items={continueWatching.data ?? []} />
        )}
      </section>

      {/* 6 & 7. 最近新增 / 热门电影等内容行 */}
      <div className="space-y-9">
        {rows.isLoading ? (
          <>
            <RowSkeleton />
            <RowSkeleton />
          </>
        ) : rows.isError ? (
          <ErrorState onRetry={() => rows.refetch()} />
        ) : (rows.data ?? []).length === 0 ? (
          <EmptyState icon={Film} title="媒体库还是空的" description="开始添加你的第一部影片吧。" />
        ) : (
          (rows.data ?? []).map((row) =>
            row.movies.length === 0 ? (
              <section key={row.id}>
                <SectionHeader title={row.title} subtitle={row.subtitle} />
                <EmptyState icon={Film} title="暂无内容" />
              </section>
            ) : (
              <MovieRow key={row.id} row={row} onSelect={openMovie} />
            ),
          )
        )}
      </div>
    </div>
  )
}
