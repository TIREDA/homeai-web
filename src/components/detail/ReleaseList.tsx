import { Download, Users, ArrowDownToLine, Ban, Server, Award } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatBytes } from "@/lib/format"
import { Button } from "@/components/ui/button"
import { ErrorState } from "@/components/common/StateViews"
import { Skeleton } from "@/components/ui/skeleton"
import type { HdrFormat, ReleaseResource, Resolution } from "@/types/media"

const RES_STYLE: Record<Resolution, string> = {
  "2160p": "text-emerald-200 bg-emerald-500/15 border-emerald-500/25",
  "1080p": "text-slate-100 bg-white/10 border-white/15",
  "720p": "text-muted-foreground bg-white/5 border-white/10",
}

const HDR_STYLE: Record<HdrFormat, string> = {
  SDR: "text-muted-foreground bg-white/5 border-white/10",
  HDR10: "text-cyan-200 bg-cyan-500/15 border-cyan-500/25",
  "HDR10+": "text-teal-200 bg-teal-500/15 border-teal-500/25",
  "Dolby Vision": "text-indigo-200 bg-indigo-500/15 border-indigo-500/30",
}

function Tag({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-medium whitespace-nowrap",
        className,
      )}
    >
      {children}
    </span>
  )
}

function ScoreTag({ score }: { score: number }) {
  const tone =
    score >= 100
      ? "text-emerald-300"
      : score >= 0
        ? "text-amber-300"
        : "text-red-300"
  return (
    <span className={cn("inline-flex items-center gap-1 text-xs font-semibold tabular-nums", tone)}>
      <Award className="size-3.5" />
      {score > 0 ? `+${score}` : score}
    </span>
  )
}

function ReleaseTags({ release }: { release: ReleaseResource }) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <Tag className={RES_STYLE[release.resolution]}>{release.resolution.toUpperCase()}</Tag>
      <Tag className="border-white/12 bg-white/8 text-foreground/85">{release.source}</Tag>
      <Tag className="border-white/12 bg-white/8 text-foreground/85">{release.videoCodec}</Tag>
      {release.hdrFormat !== "SDR" && (
        <Tag className={HDR_STYLE[release.hdrFormat]}>{release.hdrFormat}</Tag>
      )}
      <Tag className="border-white/12 bg-white/8 text-foreground/70">{release.audioFormat}</Tag>
    </div>
  )
}

function DownloadBtn({
  release,
  onGrab,
}: {
  release: ReleaseResource
  onGrab: (r: ReleaseResource) => void
}) {
  return (
    <Button
      size="sm"
      variant={release.rejected ? "secondary" : "default"}
      className="gap-1.5"
      onClick={() => onGrab(release)}
    >
      <Download className="size-3.5" />
      {release.rejected ? "强制下载" : "下载"}
    </Button>
  )
}

/** 移动端资源卡片 */
function ReleaseCard({
  release,
  onGrab,
}: {
  release: ReleaseResource
  onGrab: (r: ReleaseResource) => void
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3",
        release.rejected ? "border-red-500/20 bg-red-500/[0.04]" : "border-white/8 bg-surface/70",
      )}
    >
      <p className="break-all font-mono text-xs leading-relaxed text-foreground/90">
        {release.title}
      </p>
      <div className="mt-2">
        <ReleaseTags release={release} />
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <ArrowDownToLine className="size-3.5" />
          {formatBytes(release.sizeBytes)}
        </span>
        <span className="flex items-center gap-1 text-emerald-300">
          <Users className="size-3.5" />
          {release.seeders}
        </span>
        <span className="flex items-center gap-1">下载 {release.leechers}</span>
        <span className="flex items-center gap-1">
          <Server className="size-3.5" />
          {release.indexer}
        </span>
        <ScoreTag score={release.customFormatScore} />
      </div>
      {release.rejected && release.rejectionReasons && (
        <div className="mt-2 flex items-start gap-1.5 rounded-lg bg-red-500/10 p-2 text-[11px] text-red-200">
          <Ban className="mt-0.5 size-3.5 shrink-0" />
          <span>被 Radarr 拒绝：{release.rejectionReasons.join("；")}</span>
        </div>
      )}
      <div className="mt-3 flex justify-end">
        <DownloadBtn release={release} onGrab={onGrab} />
      </div>
    </div>
  )
}

interface ReleaseListProps {
  releases: ReleaseResource[] | undefined
  isLoading: boolean
  isError: boolean
  onRetry: () => void
  onGrab: (r: ReleaseResource) => void
}

export function ReleaseList({ releases, isLoading, isError, onRetry, onGrab }: ReleaseListProps) {
  if (isLoading) {
    return (
      <div className="space-y-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-xl" />
        ))}
      </div>
    )
  }
  if (isError) return <ErrorState onRetry={onRetry} />
  if (!releases || releases.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-white/10 bg-surface/40 px-4 py-8 text-center text-sm text-muted-foreground">
        未找到可用资源，可尝试重新搜索或更换 Indexer。
      </p>
    )
  }

  return (
    <>
      {/* 移动端：卡片列表 */}
      <div className="space-y-2 lg:hidden">
        {releases.map((r) => (
          <ReleaseCard key={r.id} release={r} onGrab={onGrab} />
        ))}
      </div>

      {/* 桌面端：表格 */}
      <div className="hidden overflow-hidden rounded-xl border border-white/8 lg:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/8 bg-white/[0.03] text-left text-xs text-muted-foreground">
              <th className="px-3 py-2.5 font-medium">资源</th>
              <th className="px-3 py-2.5 font-medium">大小</th>
              <th className="px-3 py-2.5 font-medium">做种 / 下载</th>
              <th className="px-3 py-2.5 font-medium">Indexer</th>
              <th className="px-3 py-2.5 font-medium">评分</th>
              <th className="px-3 py-2.5 font-medium" />
            </tr>
          </thead>
          <tbody>
            {releases.map((r) => (
              <tr
                key={r.id}
                className={cn(
                  "border-b border-white/5 align-top last:border-0",
                  r.rejected && "bg-red-500/[0.04]",
                )}
              >
                <td className="max-w-md px-3 py-3">
                  <p className="break-all font-mono text-xs text-foreground/90">{r.title}</p>
                  <div className="mt-1.5">
                    <ReleaseTags release={r} />
                  </div>
                  {r.rejected && r.rejectionReasons && (
                    <div className="mt-1.5 flex items-start gap-1 text-[11px] text-red-200">
                      <Ban className="mt-0.5 size-3 shrink-0" />
                      <span>{r.rejectionReasons.join("；")}</span>
                    </div>
                  )}
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-foreground/80">
                  {formatBytes(r.sizeBytes)}
                </td>
                <td className="whitespace-nowrap px-3 py-3">
                  <span className="text-emerald-300">{r.seeders}</span>
                  <span className="text-muted-foreground"> / {r.leechers}</span>
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-foreground/80">{r.indexer}</td>
                <td className="whitespace-nowrap px-3 py-3">
                  <ScoreTag score={r.customFormatScore} />
                </td>
                <td className="whitespace-nowrap px-3 py-3 text-right">
                  <DownloadBtn release={r} onGrab={onGrab} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  )
}
