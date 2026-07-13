import { AlertTriangle, ArrowDownToLine, Clock, Activity, RotateCcw } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatBytes, formatEta, formatSpeed } from "@/lib/format"
import { QB_STATUS_META, RADARR_STATUS_META } from "@/lib/status"
import type { StatusMetric } from "@/types/assistant"
import type { DownloadTaskDetail } from "@/types/media"
import { StatusBadge, QualityBadge } from "@/components/media/StatusBadge"
import { Badge } from "@/components/ui/badge"

/* ---------- 流式文字块 ---------- */
export function TextBlock({ text, streaming }: { text: string; streaming?: boolean }) {
  return (
    <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
      {text}
      {streaming && (
        <span className="ml-0.5 inline-block h-4 w-1.5 translate-y-0.5 animate-pulse rounded-sm bg-primary align-middle" />
      )}
    </p>
  )
}

/* ---------- 下载任务卡片 ---------- */
export function DownloadTaskBlock({
  task,
  onRetry,
  onOpen,
}: {
  task: DownloadTaskDetail
  onRetry?: (task: DownloadTaskDetail) => void
  onOpen?: (task: DownloadTaskDetail) => void
}) {
  const isFailed = task.status === "failed"
  const isActive = task.status === "downloading"
  return (
    <div className="rounded-xl border border-white/8 bg-background/40 p-3">
      <div className="flex gap-3">
        <img
          src={task.posterUrl || "/placeholder.svg"}
          alt=""
          className="h-24 w-16 shrink-0 rounded-lg object-cover"
        />
        <div className="flex min-w-0 flex-1 flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h4 className="truncate text-sm font-semibold">{task.title}</h4>
            <QualityBadge quality={task.quality} />
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <StatusBadge status={task.status} />
            <Badge className={QB_STATUS_META[task.qbStatus].className}>
              qB · {QB_STATUS_META[task.qbStatus].label}
            </Badge>
            <Badge className={RADARR_STATUS_META[task.radarrImportStatus].className}>
              Radarr · {RADARR_STATUS_META[task.radarrImportStatus].label}
            </Badge>
          </div>
          <div className="mt-0.5 h-1.5 w-full overflow-hidden rounded-full bg-white/8">
            <div
              className={cn(
                "h-full rounded-full",
                isFailed ? "bg-red-400/70" : isActive ? "bg-primary" : "bg-emerald-400/70",
              )}
              style={{ width: `${Math.max(task.progress, 2)}%` }}
            />
          </div>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
            <span className="tabular-nums text-foreground">{task.progress.toFixed(0)}%</span>
            <span className="tabular-nums">
              {formatBytes(task.downloadedBytes)} / {formatBytes(task.sizeBytes)}
            </span>
            {isActive && (
              <>
                <span className="flex items-center gap-1 tabular-nums">
                  <ArrowDownToLine className="size-3 text-primary" />
                  {formatSpeed(task.downloadSpeed)}
                </span>
                <span className="flex items-center gap-1 tabular-nums">
                  <Clock className="size-3" />
                  {formatEta(task.etaSeconds)}
                </span>
              </>
            )}
          </div>
          <div className="mt-1 flex items-center gap-1.5">
            {isFailed && onRetry && (
              <button
                type="button"
                onClick={() => onRetry(task)}
                className="inline-flex items-center gap-1 rounded-lg bg-white/6 px-2.5 py-1 text-xs font-medium hover:bg-white/12"
              >
                <RotateCcw className="size-3.5" />
                重试搜索
              </button>
            )}
            {onOpen && (
              <button
                type="button"
                onClick={() => onOpen(task)}
                className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1 text-xs font-medium text-muted-foreground hover:bg-white/6 hover:text-foreground"
              >
                查看任务
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------- 系统状态卡片 ---------- */
const TONE: Record<NonNullable<StatusMetric["tone"]>, string> = {
  ok: "text-emerald-300",
  warn: "text-amber-300",
  error: "text-red-300",
  muted: "text-muted-foreground",
}

export function SystemStatusBlock({ title, metrics }: { title: string; metrics: StatusMetric[] }) {
  return (
    <div className="rounded-xl border border-white/8 bg-background/40 p-3">
      <div className="mb-2.5 flex items-center gap-1.5 text-sm font-medium">
        <Activity className="size-4 text-primary" />
        {title}
      </div>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {metrics.map((m) => (
          <div key={m.label} className="rounded-lg bg-white/4 px-3 py-2">
            <p className="text-xs text-muted-foreground">{m.label}</p>
            <p className={cn("mt-0.5 text-sm font-semibold tabular-nums", m.tone ? TONE[m.tone] : "text-foreground")}>
              {m.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ---------- 错误提示块 ---------- */
export function ErrorBlock({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="flex gap-2.5 rounded-xl border border-red-500/25 bg-red-500/8 p-3">
      <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-300" />
      <div className="min-w-0">
        <p className="text-sm text-red-100/90">{text}</p>
        {hint && <p className="mt-1 text-xs text-red-200/70">{hint}</p>}
      </div>
    </div>
  )
}
