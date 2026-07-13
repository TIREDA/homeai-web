import { useEffect, useRef, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { ArrowLeft, CheckCircle2, Film } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState, ErrorState } from "@/components/common/StateViews"
import { DetailHero } from "@/components/detail/DetailHero"
import { ActionBar } from "@/components/detail/ActionBar"
import { MediaStatusPanel } from "@/components/detail/MediaStatusPanel"
import { CastRow } from "@/components/detail/CastRow"
import { ReleaseList } from "@/components/detail/ReleaseList"
import { DownloadConfirmDialog } from "@/components/detail/DownloadConfirmDialog"
import { useMovieDetail } from "@/hooks/queries"
import type { DownloadConfirmConfig, QualityTag, ReleaseResource } from "@/types/media"

export function MovieDetailPage() {
  const { tmdbId } = useParams()
  const navigate = useNavigate()
  const id = Number(tmdbId)

  const detail = useMovieDetail(id)

  const [showReleases, setShowReleases] = useState(false)
  const releasesRef = useRef<HTMLDivElement>(null)

  const [dialog, setDialog] = useState<{
    open: boolean
    intent: QualityTag | null
    release: ReleaseResource | null
  }>({ open: false, intent: null, release: null })

  const [toast, setToast] = useState<string | null>(null)
  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3200)
    return () => clearTimeout(t)
  }, [toast])

  const openManual = () => {
    setShowReleases(true)
    setTimeout(() => releasesRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 60)
  }

  const handleConfirm = (config: DownloadConfirmConfig) => {
    setDialog({ open: false, intent: null, release: null })
    setToast(
      `已提交《${config.movieTitle}》· ${config.qualityProfile}${config.searchNow ? " · 正在搜索片源" : ""}`,
    )
  }

  // 加载态
  if (detail.isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="-mx-4 -mt-4 h-[46vh] rounded-none sm:-mx-6 sm:-mt-6 sm:h-[52vh] lg:-mx-8" />
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-4 lg:col-span-2">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-24 w-full" />
          </div>
          <Skeleton className="h-80 w-full rounded-2xl" />
        </div>
      </div>
    )
  }

  if (detail.isError) {
    return <ErrorState className="mt-10" error={detail.error} onRetry={() => detail.refetch()} />
  }

  const movie = detail.data
  if (!movie) {
    return (
      <EmptyState
        className="mt-10"
        icon={Film}
        title="未找到该影片"
        description="可能该影片尚未收录，返回上一页重新选择。"
      />
    )
  }

  return (
    <div className="pb-24 sm:pb-8">
      {/* 返回按钮 */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute left-4 top-4 z-20 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-background/60 px-3 py-1.5 text-sm font-medium backdrop-blur-md transition-colors hover:bg-background/80 sm:left-6 sm:top-6"
      >
        <ArrowLeft className="size-4" />
        返回
      </button>

      <DetailHero movie={movie} />

      <div className="mx-auto max-w-6xl">
        {/* 桌面端操作栏 */}
        <div className="mb-8 mt-5 hidden sm:block">
          <ActionBar
            movie={movie}
            onPlay={() => setToast("正在 Emby 中打开播放…")}
            onDownload={(q) => setDialog({ open: true, intent: q, release: null })}
            onManualSelect={openManual}
            onResearch={() => setToast("已触发 Radarr 重新搜索…")}
            onViewProgress={() => navigate("/downloads")}
          />
        </div>

        <div className="mt-6 grid gap-8 lg:grid-cols-3 lg:gap-10">
          {/* 主列 */}
          <div className="space-y-8 lg:col-span-2">
            <CastRow cast={movie.cast} />

            {/* 可用资源（默认折叠） */}
            <section ref={releasesRef} aria-label="可用资源">
              <div className="mb-3 flex items-center justify-between gap-4">
                <h2 className="text-base font-semibold tracking-tight">可用资源</h2>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => setShowReleases((v) => !v)}
                >
                  {showReleases ? "收起" : "展开搜索结果"}
                </Button>
              </div>
              {showReleases ? (
                <ReleaseList
                  releases={[]}
                  isLoading={false}
                  isError={false}
                  onRetry={() => undefined}
                  onGrab={(r) => setDialog({ open: true, intent: null, release: r })}
                />
              ) : (
                <p className="rounded-xl border border-dashed border-white/10 bg-surface/40 px-4 py-6 text-center text-sm text-muted-foreground">
                  点击「手动选择资源」或「展开搜索结果」，查看来自各 Indexer 的可用片源。
                </p>
              )}
            </section>
          </div>

          {/* 侧列：媒体状态 */}
          <aside className="lg:col-span-1">
            <MediaStatusPanel movie={movie} />
          </aside>
        </div>
      </div>

      {/* 移动端底部固定操作栏 */}
      <ActionBar
        sticky
        movie={movie}
        onPlay={() => setToast("正在 Emby 中打开播放…")}
        onDownload={(q) => setDialog({ open: true, intent: q, release: null })}
        onManualSelect={openManual}
        onResearch={() => setToast("已触发 Radarr 重新搜索…")}
        onViewProgress={() => navigate("/downloads")}
      />

      {/* 下载确认弹窗 */}
      <DownloadConfirmDialog
        open={dialog.open}
        onClose={() => setDialog({ open: false, intent: null, release: null })}
        movie={movie}
        profiles={[]}
        intent={dialog.intent}
        release={dialog.release}
        onConfirm={handleConfirm}
      />

      {/* 轻量提示 */}
      {toast && (
        <div className="fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-4 py-2 text-sm font-medium text-emerald-100 shadow-lg backdrop-blur-md sm:bottom-6">
          <CheckCircle2 className="size-4" />
          {toast}
        </div>
      )}
    </div>
  )
}
