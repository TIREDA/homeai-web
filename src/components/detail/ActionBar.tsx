import { Play, Download, ArrowUpCircle, ListFilter, RefreshCw, Activity, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { MovieDetail, QualityTag } from "@/types/media"

interface ActionBarProps {
  movie: MovieDetail
  onPlay: () => void
  onDownload: (quality: QualityTag) => void
  onManualSelect: () => void
  onResearch: () => void
  onViewProgress: () => void
  /** true 时用于底部固定栏（移动端） */
  sticky?: boolean
}

export function ActionBar({
  movie,
  onPlay,
  onDownload,
  onManualSelect,
  onResearch,
  onViewProgress,
  sticky,
}: ActionBarProps) {
  const has1080 = movie.qualities.includes("1080p")
  const has4k = movie.qualities.includes("4k")
  const canUpgrade = movie.inEmby && has1080 && !has4k

  // 主按钮（primary）
  const primary = () => {
    switch (movie.status) {
      case "in_library":
        return canUpgrade ? (
          <Button size="lg" className="gap-1.5" onClick={() => onDownload("4k")}>
            <ArrowUpCircle className="size-4" />
            升级到 4K
          </Button>
        ) : (
          <Button size="lg" className="gap-1.5" onClick={onPlay}>
            <Play className="size-4 fill-current" />
            在 Emby 中播放
          </Button>
        )
      case "downloading":
        return (
          <Button size="lg" className="gap-1.5" onClick={onViewProgress}>
            <Activity className="size-4" />
            查看下载进度
          </Button>
        )
      case "searching":
        return (
          <Button size="lg" className="gap-1.5" disabled>
            <Loader2 className="size-4 animate-spin" />
            正在搜索片源…
          </Button>
        )
      case "queued":
        return (
          <Button size="lg" className="gap-1.5" onClick={onViewProgress}>
            <Activity className="size-4" />
            查看下载队列
          </Button>
        )
      case "importing":
        return (
          <Button size="lg" className="gap-1.5" disabled>
            <Loader2 className="size-4 animate-spin" />
            等待导入 Emby…
          </Button>
        )
      case "in_radarr":
        return (
          <Button size="lg" className="gap-1.5" onClick={onResearch}>
            <RefreshCw className="size-4" />
            重新搜索
          </Button>
        )
      case "failed":
        return (
          <Button size="lg" className="gap-1.5" onClick={onResearch}>
            <RefreshCw className="size-4" />
            重新搜索
          </Button>
        )
      default:
        // not_collected
        return (
          <Button size="lg" className="gap-1.5" onClick={() => onDownload("4k")}>
            <Download className="size-4" />
            下载 4K
          </Button>
        )
    }
  }

  // 次按钮集合
  const secondary = () => {
    const btns: React.ReactNode[] = []
    const notCollected = movie.status === "not_collected"

    if (canUpgrade) {
      btns.push(
        <Button key="play" size="lg" variant="secondary" className="gap-1.5" onClick={onPlay}>
          <Play className="size-4 fill-current" />
          播放当前版本
        </Button>,
      )
    }
    if (notCollected) {
      btns.push(
        <Button
          key="dl1080"
          size="lg"
          variant="secondary"
          className="gap-1.5"
          onClick={() => onDownload("1080p")}
        >
          <Download className="size-4" />
          下载 1080P
        </Button>,
      )
    }
    // 手动选择资源始终可用
    btns.push(
      <Button
        key="manual"
        size="lg"
        variant={notCollected ? "ghost" : "secondary"}
        className="gap-1.5"
        onClick={onManualSelect}
      >
        <ListFilter className="size-4" />
        手动选择资源
      </Button>,
    )
    return btns
  }

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-3",
        sticky &&
          "fixed inset-x-0 bottom-0 z-30 flex-nowrap overflow-x-auto border-t border-white/10 bg-background/95 p-3 backdrop-blur-md sm:hidden [&>button]:shrink-0",
      )}
    >
      {primary()}
      {secondary()}
    </div>
  )
}
