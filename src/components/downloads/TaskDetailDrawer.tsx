import { useEffect, useState } from "react"
import { createPortal } from "react-dom"
import { X, Copy, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatBytes, formatDateTime } from "@/lib/format"
import { QB_STATUS_META, RADARR_STATUS_META } from "@/lib/status"
import type { DownloadTaskDetail } from "@/types/media"
import { StatusBadge, QualityBadge } from "@/components/media/StatusBadge"
import { Badge } from "@/components/ui/badge"

interface TaskDetailDrawerProps {
  task: DownloadTaskDetail | null
  open: boolean
  onClose: () => void
}

export function TaskDetailDrawer({ task, open, onClose }: TaskDetailDrawerProps) {
  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
    }
  }, [open, onClose])

  if (!open || !task) return null

  return createPortal(
    <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-label="任务详情">
      <button
        type="button"
        aria-label="关闭详情"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in"
      />
      <div className="absolute inset-y-0 right-0 flex w-full max-w-md flex-col border-l border-white/10 bg-surface shadow-2xl shadow-black/50 animate-in slide-in-from-right">
        {/* 顶部 */}
        <div className="flex items-start justify-between gap-3 border-b border-white/8 p-4">
          <div className="flex gap-3">
            <img
              src={task.posterUrl || "/placeholder.svg"}
              alt=""
              className="h-20 w-[54px] shrink-0 rounded-lg object-cover"
            />
            <div className="min-w-0">
              <h2 className="text-base font-semibold tracking-tight">{task.title}</h2>
              <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                <StatusBadge status={task.status} />
                <QualityBadge quality={task.quality} />
              </div>
            </div>
          </div>
          <button
            type="button"
            aria-label="关闭"
            onClick={onClose}
            className="grid size-8 shrink-0 place-items-center rounded-full text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* 内容 */}
        <div className="flex-1 space-y-5 overflow-y-auto p-4">
          {/* 客户端状态 */}
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge className={QB_STATUS_META[task.qbStatus].className}>
              qBittorrent · {QB_STATUS_META[task.qbStatus].label}
            </Badge>
            <Badge className={RADARR_STATUS_META[task.radarrImportStatus].className}>
              Radarr · {RADARR_STATUS_META[task.radarrImportStatus].label}
            </Badge>
          </div>

          {/* 错误信息 */}
          {task.errorMessage && (
            <div className="rounded-xl border border-red-500/20 bg-red-500/5 p-3">
              <p className="text-xs font-medium text-red-200">错误信息</p>
              <p className="mt-1 text-xs leading-relaxed text-red-200/80">{task.errorMessage}</p>
            </div>
          )}

          {/* 原始资源标题 */}
          <Field label="原始资源标题">
            <p className="break-all rounded-lg border border-white/8 bg-white/[0.03] px-2.5 py-2 font-mono text-xs leading-relaxed text-foreground/90">
              {task.releaseTitle}
            </p>
          </Field>

          {/* 标识信息 */}
          <div className="space-y-1">
            <InfoRow label="HomeAI 任务编号" value={task.id} copyable />
            <InfoRow label="qBittorrent Hash" value={task.hash} copyable mono />
            <InfoRow label="Radarr Movie ID" value={String(task.radarrMovieId)} />
            <InfoRow label="TMDB ID" value={String(task.tmdbId)} />
            <InfoRow label="索引器 Indexer" value={task.indexer} />
          </div>

          {/* 目录 */}
          <div className="space-y-1">
            <InfoRow label="下载目录" value={task.downloadDir} mono />
            <InfoRow label="媒体目标目录" value={task.targetDir} mono />
          </div>

          {/* 大小 */}
          <div className="space-y-1">
            <InfoRow
              label="文件大小"
              value={`${formatBytes(task.downloadedBytes)} / ${formatBytes(task.sizeBytes)}`}
            />
            <InfoRow label="创建时间" value={formatDateTime(task.createdAt)} />
          </div>

          {/* 状态时间线 */}
          <Field label="状态变化时间线">
            <ol className="relative space-y-3 pl-1">
              {task.timeline.map((event, i) => {
                const isLast = i === task.timeline.length - 1
                return (
                  <li key={`${event.key}-${i}`} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span
                        className={cn(
                          "mt-0.5 size-2.5 shrink-0 rounded-full ring-2 ring-surface",
                          event.error
                            ? "bg-red-400"
                            : isLast
                              ? "bg-primary"
                              : "bg-white/30",
                        )}
                      />
                      {!isLast && <span className="mt-1 w-px flex-1 bg-white/10" />}
                    </div>
                    <div className="-mt-0.5 pb-1">
                      <p
                        className={cn(
                          "text-sm",
                          event.error ? "text-red-200" : "text-foreground",
                        )}
                      >
                        {event.label}
                      </p>
                      <p className="mt-0.5 text-xs tabular-nums text-muted-foreground">
                        {formatDateTime(event.timestamp)}
                      </p>
                    </div>
                  </li>
                )
              })}
            </ol>
          </Field>
        </div>
      </div>
    </div>,
    document.body,
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="mb-1.5 text-xs font-medium text-muted-foreground">{label}</p>
      {children}
    </div>
  )
}

function InfoRow({
  label,
  value,
  copyable,
  mono,
}: {
  label: string
  value: string
  copyable?: boolean
  mono?: boolean
}) {
  const [copied, setCopied] = useState(false)
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      /* 忽略剪贴板错误 */
    }
  }
  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="shrink-0 text-xs text-muted-foreground">{label}</span>
      <span className="flex min-w-0 items-center gap-1.5">
        <span
          className={cn(
            "truncate text-xs text-foreground/90",
            mono && "font-mono",
          )}
          title={value}
        >
          {value}
        </span>
        {copyable && (
          <button
            type="button"
            aria-label={`复制${label}`}
            onClick={copy}
            className="grid size-6 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/8 hover:text-foreground"
          >
            {copied ? <Check className="size-3 text-emerald-300" /> : <Copy className="size-3" />}
          </button>
        )}
      </span>
    </div>
  )
}
