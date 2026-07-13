import { useEffect, useMemo, useState } from "react"
import { Film, FolderOpen, Search, HardDrive } from "lucide-react"

import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { formatBytes } from "@/lib/format"
import type {
  DownloadConfirmConfig,
  MovieDetail,
  QualityProfile,
  QualityTag,
  ReleaseResource,
} from "@/types/media"

interface DownloadConfirmDialogProps {
  open: boolean
  onClose: () => void
  movie: MovieDetail
  profiles: QualityProfile[]
  /** 快捷下载时预选的画质档 */
  intent: QualityTag | null
  /** 手动选择资源时携带的具体资源 */
  release: ReleaseResource | null
  onConfirm: (config: DownloadConfirmConfig) => void
}

/** 依据画质意图估算文件大小范围 */
function estimateSize(intent: QualityTag | null, release: ReleaseResource | null) {
  if (release) {
    return { min: release.sizeBytes * 0.95, max: release.sizeBytes * 1.05 }
  }
  if (intent === "4k") return { min: 22_000_000_000, max: 70_000_000_000 }
  return { min: 8_000_000_000, max: 18_000_000_000 }
}

export function DownloadConfirmDialog({
  open,
  onClose,
  movie,
  profiles,
  intent,
  release,
  onConfirm,
}: DownloadConfirmDialogProps) {
  const defaultProfileId = useMemo(() => {
    if (release) return release.resolution === "2160p" ? "uhd" : "hd"
    return intent === "4k" ? "uhd" : "hd"
  }, [intent, release])

  const [profileId, setProfileId] = useState(defaultProfileId)
  const [searchNow, setSearchNow] = useState(true)

  useEffect(() => {
    if (open) {
      setProfileId(defaultProfileId)
      setSearchNow(true)
    }
  }, [open, defaultProfileId])

  const { min, max } = estimateSize(intent, release)
  const profile = profiles.find((p) => p.id === profileId) ?? profiles[0]

  const handleConfirm = () => {
    onConfirm({
      movieTitle: movie.title,
      qualityProfile: profile?.name ?? "Any",
      rootFolder: movie.rootFolder,
      searchNow,
      estimatedMinBytes: min,
      estimatedMaxBytes: max,
    })
  }

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title={release ? "确认下载所选资源" : "确认加入下载队列"}
      description={release ? "将该资源发送到 qBittorrent 并由 Radarr 管理导入。" : undefined}
    >
      <div className="space-y-4">
        {/* 影片 */}
        <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-surface/60 p-3">
          <img
            src={movie.posterUrl || "/placeholder.svg"}
            alt=""
            className="h-16 w-11 shrink-0 rounded-md object-cover"
          />
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 text-sm font-semibold">
              <Film className="size-3.5 text-muted-foreground" />
              {movie.title}
            </p>
            <p className="truncate text-xs text-muted-foreground">
              {movie.originalTitle} · {movie.releaseYear}
            </p>
          </div>
        </div>

        {/* 手动选择的具体资源标题 */}
        {release && (
          <p className="break-all rounded-lg bg-white/5 p-2.5 font-mono text-[11px] leading-relaxed text-foreground/80">
            {release.title}
          </p>
        )}

        {/* 质量配置 */}
        <div className="space-y-1.5">
          <label className="text-xs font-medium text-muted-foreground">质量配置</label>
          <div className="grid grid-cols-1 gap-2">
            {profiles.map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => setProfileId(p.id)}
                className={cn(
                  "flex items-center justify-between rounded-lg border px-3 py-2 text-left text-sm transition-colors",
                  profileId === p.id
                    ? "border-primary/50 bg-primary/10 text-foreground"
                    : "border-white/10 bg-surface/50 text-foreground/80 hover:bg-white/5",
                )}
              >
                <span className="font-medium">{p.name}</span>
                <span className="text-xs text-muted-foreground">{p.cutoff}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 根目录 */}
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-surface/50 px-3 py-2.5 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <FolderOpen className="size-4" />
            根目录
          </span>
          <code className="font-mono text-xs text-foreground/85">{movie.rootFolder}</code>
        </div>

        {/* 预计文件大小 */}
        <div className="flex items-center justify-between gap-3 rounded-lg border border-white/8 bg-surface/50 px-3 py-2.5 text-sm">
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <HardDrive className="size-4" />
            预计文件大小
          </span>
          <span className="font-medium tabular-nums">
            {formatBytes(min)} – {formatBytes(max)}
          </span>
        </div>

        {/* 是否立即搜索 */}
        <button
          type="button"
          onClick={() => setSearchNow((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/8 bg-surface/50 px-3 py-2.5 text-left text-sm"
        >
          <span className="flex items-center gap-1.5">
            <Search className="size-4 text-muted-foreground" />
            添加后立即搜索片源
          </span>
          <span
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full transition-colors",
              searchNow ? "bg-primary" : "bg-white/15",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-4 rounded-full bg-white transition-all",
                searchNow ? "left-4" : "left-0.5",
              )}
            />
          </span>
        </button>

        {/* 操作 */}
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>
            取消
          </Button>
          <Button onClick={handleConfirm}>确认下载</Button>
        </div>
      </div>
    </Dialog>
  )
}
