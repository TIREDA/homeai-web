import { useState } from "react"
import { Sparkles, CheckCircle2, XCircle, HardDrive, Search, ListChecks, AlertTriangle, Check } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatBytes } from "@/lib/format"
import type { AssistantBlock } from "@/types/assistant"
import type { Movie } from "@/types/media"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

type ActionBlock = Extract<AssistantBlock, { type: "action" }>

interface ActionCardProps {
  block: ActionBlock
  movies: Movie[]
  onConfirm: (executedIds: number[], searchNow: boolean) => void
  onCancel: () => void
}

/**
 * 操作确认卡片。
 * - pending：明确标注「待确认操作」，可确认执行 / 仅选择部分 / 取消。
 * - executed：明确标注「已执行」，绿色成功样式。
 * - cancelled：灰显「已取消」。
 * 危险操作（批量）在确认执行时弹出二次确认。
 */
export function ActionCard({ block, movies, onConfirm, onCancel }: ActionCardProps) {
  const [partial, setPartial] = useState(false)
  const [selected, setSelected] = useState<number[]>(block.movieIds)
  const [searchNow, setSearchNow] = useState(block.searchNow)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const byId = new Map(movies.map((m) => [m.id, m]))
  const listIds = block.state === "executed" ? block.executedMovieIds ?? block.movieIds : block.movieIds

  /* ---------- 已执行 ---------- */
  if (block.state === "executed") {
    return (
      <div className="overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/8">
        <div className="flex items-center gap-2 border-b border-emerald-500/20 px-3 py-2 text-sm font-semibold text-emerald-200">
          <CheckCircle2 className="size-4" />
          已执行
          <span className="ml-auto text-xs font-normal text-emerald-200/70">
            {listIds.length} 部 · {block.qualityProfile}
          </span>
        </div>
        <ul className="divide-y divide-white/5">
          {listIds.map((id) => {
            const m = byId.get(id)
            if (!m) return null
            return (
              <li key={id} className="flex items-center gap-2 px-3 py-2 text-sm">
                <Check className="size-3.5 text-emerald-300" />
                <span className="truncate">{m.title}</span>
                <span className="ml-auto text-xs text-muted-foreground">{m.releaseYear}</span>
              </li>
            )
          })}
        </ul>
        <p className="px-3 py-2 text-xs text-emerald-200/70">
          已创建下载任务{searchNow ? "并开始搜索片源" : ""}，可在下载中心查看进度。
        </p>
      </div>
    )
  }

  /* ---------- 已取消 ---------- */
  if (block.state === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-xl border border-white/8 bg-background/40 px-3 py-2.5 text-sm text-muted-foreground">
        <XCircle className="size-4" />
        已取消该操作
      </div>
    )
  }

  /* ---------- 待确认 ---------- */
  const toggle = (id: number) =>
    setSelected((s) => (s.includes(id) ? s.filter((x) => x !== id) : [...s, id]))

  const effectiveIds = partial ? selected : block.movieIds
  const total = block.estimatedBytes
  const perMovie = block.movieIds.length ? total / block.movieIds.length : 0
  const estimated = partial ? perMovie * effectiveIds.length : total

  const doConfirm = () => {
    setConfirmOpen(false)
    onConfirm(effectiveIds, searchNow)
  }

  const requestConfirm = () => {
    if (effectiveIds.length === 0) return
    if (block.danger) setConfirmOpen(true)
    else doConfirm()
  }

  return (
    <div className="overflow-hidden rounded-xl border border-primary/30 bg-primary/5">
      {/* 头部：明确标注为建议/待确认 */}
      <div className="flex items-center gap-2 border-b border-primary/20 px-3 py-2 text-sm font-semibold text-foreground">
        <span className="grid size-5 place-items-center rounded-md bg-primary/20 text-primary">
          <Sparkles className="size-3.5" />
        </span>
        待确认操作
        {block.danger && (
          <span className="ml-auto flex items-center gap-1 rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-medium text-amber-300">
            <AlertTriangle className="size-3" />
            批量操作
          </span>
        )}
      </div>

      <div className="space-y-3 p-3">
        <p className="text-sm font-medium text-foreground">{block.title}</p>

        {/* 影片列表 */}
        <ul className="divide-y divide-white/5 rounded-lg border border-white/8 bg-background/40">
          {block.movieIds.map((id) => {
            const m = byId.get(id)
            if (!m) return null
            const checked = effectiveIds.includes(id)
            return (
              <li key={id} className="flex items-center gap-2.5 px-3 py-2">
                {partial && (
                  <button
                    type="button"
                    role="checkbox"
                    aria-checked={checked}
                    aria-label={`选择 ${m.title}`}
                    onClick={() => toggle(id)}
                    className={cn(
                      "grid size-4 shrink-0 place-items-center rounded border transition-colors",
                      checked ? "border-primary bg-primary text-primary-foreground" : "border-white/25",
                    )}
                  >
                    {checked && <Check className="size-3" />}
                  </button>
                )}
                <img src={m.posterUrl || "/placeholder.svg"} alt="" className="h-10 w-7 rounded object-cover" />
                <span className="truncate text-sm">{m.title}</span>
                <span className="ml-auto shrink-0 text-xs text-muted-foreground">{m.releaseYear}</span>
              </li>
            )
          })}
        </ul>

        {/* 配置信息 */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="rounded-lg bg-white/4 px-3 py-2">
            <p className="text-muted-foreground">质量配置</p>
            <p className="mt-0.5 font-medium text-foreground">{block.qualityProfile}</p>
          </div>
          <div className="rounded-lg bg-white/4 px-3 py-2">
            <p className="flex items-center gap-1 text-muted-foreground">
              <HardDrive className="size-3" />
              预计总容量
            </p>
            <p className="mt-0.5 font-medium tabular-nums text-foreground">≈ {formatBytes(estimated)}</p>
          </div>
        </div>

        {/* 立即搜索开关 */}
        <button
          type="button"
          onClick={() => setSearchNow((v) => !v)}
          className="flex w-full items-center justify-between gap-3 rounded-lg bg-white/4 px-3 py-2 text-left text-sm"
        >
          <span className="flex items-center gap-1.5 text-muted-foreground">
            <Search className="size-3.5" />
            添加后立即搜索片源
          </span>
          <span className={cn("relative h-5 w-9 shrink-0 rounded-full transition-colors", searchNow ? "bg-primary" : "bg-white/15")}>
            <span className={cn("absolute top-0.5 size-4 rounded-full bg-white transition-all", searchNow ? "left-4" : "left-0.5")} />
          </span>
        </button>

        {/* 操作按钮 */}
        <div className="flex flex-wrap items-center gap-2 pt-0.5">
          <Button size="sm" className="gap-1.5" onClick={requestConfirm} disabled={effectiveIds.length === 0}>
            <Check className="size-3.5" />
            确认执行{partial ? ` (${effectiveIds.length})` : ""}
          </Button>
          <Button size="sm" variant="secondary" className="gap-1.5" onClick={() => setPartial((v) => !v)}>
            <ListChecks className="size-3.5" />
            {partial ? "全选" : "仅选择部分"}
          </Button>
          <Button size="sm" variant="ghost" onClick={onCancel}>
            取消
          </Button>
        </div>
      </div>

      {/* 危险操作二次确认 */}
      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        title="确认批量下载？"
        description={`即将创建 ${effectiveIds.length} 个 4K 下载任务，预计占用约 ${formatBytes(estimated)} 存储空间。`}
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirmOpen(false)}>
            再想想
          </Button>
          <Button variant="destructive" className="gap-1.5" onClick={doConfirm}>
            <AlertTriangle className="size-4" />
            确认执行
          </Button>
        </div>
      </Dialog>
    </div>
  )
}
