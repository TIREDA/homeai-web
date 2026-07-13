import { ArrowDownToLine, Users, Clock, Pause, Play, RotateCcw, Info } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatBytes, formatEta, formatSpeed } from "@/lib/format"
import { STATUS_META } from "@/lib/status"
import type { DownloadTask } from "@/types/media"
import { StatusBadge, QualityBadge } from "./StatusBadge"

interface DownloadTaskCardProps {
  task: DownloadTask
  onPause?: (task: DownloadTask) => void
  onResume?: (task: DownloadTask) => void
  onRetry?: (task: DownloadTask) => void
  onDetail?: (task: DownloadTask) => void
}

export function DownloadTaskCard({ task, onPause, onResume, onRetry, onDetail }: DownloadTaskCardProps) {
  const isActive = task.status === "downloading"
  const isFailed = task.status === "failed"
  const isQueued = task.status === "queued"

  return (
    <div className="flex gap-3 rounded-xl border border-white/8 bg-surface/70 p-3">
      <img
        src={task.posterUrl || "/placeholder.svg"}
        alt=""
        className="h-24 w-16 shrink-0 rounded-lg object-cover"
      />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold">{task.title}</p>
            <div className="mt-1 flex flex-wrap items-center gap-1.5">
              <StatusBadge status={task.status} />
              <QualityBadge quality={task.quality} />
            </div>
          </div>
          <span
            className={cn(
              "shrink-0 text-sm font-semibold tabular-nums",
              isFailed ? "text-red-300" : "text-foreground",
            )}
          >
            {task.progress}%
          </span>
        </div>

        {/* 进度条 */}
        <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
          <div
            className={cn(
              "h-full rounded-full transition-all duration-700",
              isFailed
                ? "bg-red-500/70"
                : task.status === "importing"
                  ? "bg-emerald-500/80"
                  : "bg-primary",
              isActive && "animate-pulse",
            )}
            style={{ width: `${task.progress}%` }}
          />
        </div>

        {/* 明细 */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-muted-foreground">
          {isActive && (
            <>
              <span className="flex items-center gap-1 text-primary">
                <ArrowDownToLine className="size-3" />
                {formatSpeed(task.downloadSpeed)}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {formatEta(task.etaSeconds)}
              </span>
            </>
          )}
          {isFailed ? (
            <span className="text-red-300">{STATUS_META.failed.label}，可重试</span>
          ) : (
            <span>
              {formatBytes(task.downloadedBytes, 1)} / {formatBytes(task.sizeBytes, 1)}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Users className="size-3" />
            {task.seeders} 做种
          </span>
        </div>

        {/* 操作按钮 */}
        <div className="mt-0.5 flex items-center gap-2">
          {isFailed ? (
            <ActionButton icon={RotateCcw} label="重试" onClick={() => onRetry?.(task)} />
          ) : isQueued ? (
            <ActionButton icon={Play} label="开始" onClick={() => onResume?.(task)} />
          ) : isActive ? (
            <ActionButton icon={Pause} label="暂停" onClick={() => onPause?.(task)} />
          ) : null}
          <ActionButton icon={Info} label="详情" variant="ghost" onClick={() => onDetail?.(task)} />
        </div>
      </div>
    </div>
  )
}

function ActionButton({
  icon: Icon,
  label,
  variant = "solid",
  onClick,
}: {
  icon: typeof Pause
  label: string
  variant?: "solid" | "ghost"
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-[11px] font-medium transition-colors",
        variant === "solid"
          ? "bg-white/8 text-foreground hover:bg-white/15"
          : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
      )}
    >
      <Icon className="size-3" />
      {label}
    </button>
  )
}
