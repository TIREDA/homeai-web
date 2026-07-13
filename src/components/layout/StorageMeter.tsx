import { HardDrive } from "lucide-react"

import { useLibrarySummary } from "@/hooks/queries"
import { formatBytes } from "@/lib/format"

/** 侧边栏底部的 NAS 存储占用指示 */
export function StorageMeter() {
  const { data } = useLibrarySummary()
  const used = data?.usedStorageBytes ?? 0
  const total = data?.totalStorageBytes ?? 1
  const percent = Math.min(100, Math.round((used / total) * 100))

  return (
    <div className="rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <div className="mb-2 flex items-center gap-2 text-xs font-medium text-muted-foreground">
        <HardDrive className="size-3.5" />
        NAS 存储
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-white/10">
        <div
          className="h-full rounded-full bg-primary transition-all duration-700"
          style={{ width: `${percent}%` }}
        />
      </div>
      <p className="mt-2 text-[11px] text-muted-foreground">
        {data ? `${formatBytes(used, 0)} / ${formatBytes(total, 0)} · 已用 ${percent}%` : "读取中…"}
      </p>
    </div>
  )
}
