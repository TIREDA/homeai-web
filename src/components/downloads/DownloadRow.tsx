import {
  ArrowDownToLine,
  ArrowUpFromLine,
  Clock,
  Info,
  Pause,
  Play,
  RotateCcw,
  Trash2,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { formatBytes, formatEta, formatRelativeTime, formatSpeed } from "@/lib/format"
import { QB_STATUS_META, RADARR_STATUS_META } from "@/lib/status"
import type { DownloadTaskDetail } from "@/types/media"
import { Badge } from "@/components/ui/badge"
import { StatusBadge, QualityBadge } from "@/components/media/StatusBadge"

interface RowActions {
  onPause: (t: DownloadTaskDetail) => void
  onResume: (t: DownloadTaskDetail) => void
  onRetry: (t: DownloadTaskDetail) => void
  onDelete: (t: DownloadTaskDetail) => void
  onDetail: (t: DownloadTaskDetail) => void
}

interface DownloadRowProps extends RowActions {
  task: DownloadTaskDetail
  compact?: boolean
}

export function DownloadRow({ task, compact, ...actions }: DownloadRowProps) {
  return compact ? (
    <CompactRow task={task} {...actions} />
  ) : (
    <ListRow task={task} {...actions} />
  )
}

/* ---------- 进度条 ---------- */
function ProgressBar({ task }: { task: DownloadTaskDetail }) {
  const isFailed = task.status === "failed"
  const isActive = task.status === "downloading"
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/8">
      <div
        className={cn(
          "h-full rounded-full transition-all duration-700",
          isFailed ? "bg-red-400/70" : isActive ? "bg-primary" : "bg-emerald-400/70",
        )}
        style={{ width: `${Math.max(task.progress, isActive ? 2 : 0)}%` }}
      />
    </div>
  )
}

/* ---------- 操作按钮组 ---------- */
function RowActionsGroup({ task, onPause, onResume, onRetry, onDelete, onDetail }: DownloadRowProps) {
  const { status, qbStatus } = task
  const canPause = status === "downloading" || (status === "queued" && qbStatus !== "paused")
  const canResume = qbStatus === "paused" || status === "queued"
  const canRetry = status === "failed"

  return (
    <div className="flex items-center gap-1">
      {canRetry ? (
        <IconAction icon={RotateCcw} label="重试搜索" onClick={() => onRetry(task)} />
      ) : canPause ? (
        <IconAction icon={Pause} label="暂停" onClick={() => onPause(task)} />
      ) : canResume ? (
        <IconAction icon={Play} label="恢复" onClick={() => onResume(task)} />
      ) : null}
      <IconAction icon={Info} label="查看详情" onClick={() => onDetail(task)} />
      <IconAction icon={Trash2} label="删除任务" danger onClick={() => onDelete(task)} />
    </div>
  )
}

function IconAction({
  icon: Icon,
  label,
  danger,
  onClick,
}: {
  icon: typeof Info
  label: string
  danger?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      onClick={onClick}
      className={cn(
        "grid size-8 place-items-center rounded-lg text-muted-foreground transition-colors hover:bg-white/8",
        danger ? "hover:text-red-300" : "hover:text-foreground",
      )}
    >
      <Icon className="size-4" />
    </button>
  )
}

/* ---------- 完整列表行 ---------- */
function ListRow({ task, ...actions }: DownloadRowProps) {
  const showSpeed = task.status === "downloading"
  return (
    <div className="rounded-2xl border border-white/8 bg-surface/60 p-3 transition-colors hover:border-white/15 sm:p-4">
      <div className="flex gap-3 sm:gap-4">
        <button
          type="button"
          onClick={() => actions.onDetail(task)}
          className="shrink-0 overflow-hidden rounded-lg"
          aria-label={`查看 ${task.title} 详情`}
        >
          <img
            src={task.posterUrl || "/placeholder.svg"}
            alt=""
            className="h-28 w-[74px] object-cover sm:h-32 sm:w-[86px]"
          />
        </button>

        <div className="flex min-w-0 flex-1 flex-col gap-2">
          {/* 标题行 */}
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="truncate text-sm font-semibold text-foreground sm:text-base">
                  {task.title}
                </h3>
                <QualityBadge quality={task.quality} className="hidden sm:inline-flex" />
              </div>
              <p className="mt-0.5 truncate font-mono text-xs text-muted-foreground" title={task.releaseTitle}>
                {task.releaseTitle}
              </p>
            </div>
            <div className="hidden sm:block">
              <RowActionsGroup task={task} {...actions} />
            </div>
          </div>

          {/* 状态徽章行 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={task.status} />
            <Badge className={QB_STATUS_META[task.qbStatus].className}>
              qB · {QB_STATUS_META[task.qbStatus].label}
            </Badge>
            <Badge className={RADARR_STATUS_META[task.radarrImportStatus].className}>
              Radarr · {RADARR_STATUS_META[task.radarrImportStatus].label}
            </Badge>
          </div>

          {/* 进度 */}
          <div className="space-y-1.5">
            <ProgressBar task={task} />
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
              <span className="tabular-nums text-foreground">
                {task.progress.toFixed(task.progress % 1 ? 1 : 0)}%
              </span>
              <span className="tabular-nums">
                {formatBytes(task.downloadedBytes)} / {formatBytes(task.sizeBytes)}
              </span>
              {showSpeed && (
                <>
                  <span className="flex items-center gap-1 tabular-nums">
                    <ArrowDownToLine className="size-3 text-primary" />
                    {formatSpeed(task.downloadSpeed)}
                  </span>
                  <span className="flex items-center gap-1 tabular-nums">
                    <ArrowUpFromLine className="size-3" />
                    {formatSpeed(task.uploadSpeed)}
                  </span>
                  <span className="flex items-center gap-1 tabular-nums">
                    <Clock className="size-3" />
                    {formatEta(task.etaSeconds)}
                  </span>
                </>
              )}
              <span className="ml-auto">{formatRelativeTime(task.createdAt)}</span>
            </div>
          </div>

          {/* 错误信息 */}
          {task.errorMessage && (
            <p className="rounded-lg border border-red-500/20 bg-red-500/5 px-2.5 py-1.5 text-xs text-red-200/90">
              {task.errorMessage}
            </p>
          )}

          {/* 移动端操作 */}
          <div className="sm:hidden">
            <RowActionsGroup task={task} {...actions} />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- 紧凑行 ---------- */
function CompactRow({ task, ...actions }: DownloadRowProps) {
  const showSpeed = task.status === "downloading"
  return (
    <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-surface/60 px-3 py-2 transition-colors hover:border-white/15">
      <button
        type="button"
        onClick={() => actions.onDetail(task)}
        className="min-w-0 flex-1 text-left"
      >
        <div className="flex items-center gap-2">
          <span className="truncate text-sm font-medium text-foreground">{task.title}</span>
          <StatusBadge status={task.status} className="shrink-0" />
        </div>
        <div className="mt-1 flex items-center gap-2">
          <div className="h-1 flex-1 overflow-hidden rounded-full bg-white/8">
            <div
              className={cn(
                "h-full rounded-full",
                task.status === "failed"
                  ? "bg-red-400/70"
                  : task.status === "downloading"
                    ? "bg-primary"
                    : "bg-emerald-400/70",
              )}
              style={{ width: `${task.progress}%` }}
            />
          </div>
          <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
            {showSpeed ? formatSpeed(task.downloadSpeed) : `${task.progress.toFixed(0)}%`}
          </span>
        </div>
      </button>
      <RowActionsGroup task={task} {...actions} />
    </div>
  )
}
