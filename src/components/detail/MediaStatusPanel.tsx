import { CheckCircle2, XCircle, Eye, EyeOff } from "lucide-react"

import { Card } from "@/components/ui/card"
import { formatBytes } from "@/lib/format"
import type { MovieDetail } from "@/types/media"

function StatePill({ ok, label }: { ok: boolean; label: string }) {
  return (
    <span
      className={
        "inline-flex items-center gap-1 text-sm font-medium " +
        (ok ? "text-emerald-300" : "text-muted-foreground")
      }
    >
      {ok ? <CheckCircle2 className="size-4" /> : <XCircle className="size-4" />}
      {label}
    </span>
  )
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 text-right text-sm font-medium text-foreground">{children}</dd>
    </div>
  )
}

export function MediaStatusPanel({ movie }: { movie: MovieDetail }) {
  const file = movie.mediaFile
  const syncedAt = new Date(movie.lastSyncedAt).toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  })

  return (
    <Card className="p-5">
      <h2 className="mb-2 text-base font-semibold tracking-tight">媒体状态</h2>
      <dl className="divide-y divide-white/5">
        <Row label="Emby 状态">
          <StatePill ok={movie.inEmby} label={movie.inEmby ? "已入库可播放" : "未入库"} />
        </Row>
        <Row label="Radarr 状态">
          <StatePill ok={movie.inRadarr} label={movie.inRadarr ? "已添加" : "未添加"} />
        </Row>
        <Row label="监控状态">
          <span className="inline-flex items-center gap-1">
            {movie.monitored ? (
              <Eye className="size-4 text-sky-300" />
            ) : (
              <EyeOff className="size-4 text-muted-foreground" />
            )}
            {movie.monitored ? "监控中" : "未监控"}
          </span>
        </Row>
        <Row label="当前质量">{file ? file.quality : "—"}</Row>
        <Row label="分辨率">{file ? file.resolution.toUpperCase() : "—"}</Row>
        <Row label="视频编码">{file ? file.videoCodec : "—"}</Row>
        <Row label="HDR 格式">{file ? file.hdrFormat : "—"}</Row>
        <Row label="音频格式">{file ? file.audioFormat : "—"}</Row>
        <Row label="文件大小">{file ? formatBytes(file.sizeBytes) : "—"}</Row>
        <Row label="文件路径">
          {file ? (
            <code className="break-all font-mono text-xs text-foreground/80">{file.filePath}</code>
          ) : (
            "—"
          )}
        </Row>
        <Row label="根目录">
          <code className="font-mono text-xs text-foreground/80">{movie.rootFolder}</code>
        </Row>
        <Row label="最后同步">{syncedAt}</Row>
      </dl>
    </Card>
  )
}
