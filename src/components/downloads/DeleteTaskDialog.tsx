import { useEffect, useState } from "react"
import { AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import type { DeleteTaskOptions, DownloadTaskDetail } from "@/types/media"
import { Dialog } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface DeleteTaskDialogProps {
  task: DownloadTaskDetail | null
  open: boolean
  onClose: () => void
  onConfirm: (task: DownloadTaskDetail, options: DeleteTaskOptions) => void
}

const DEFAULT_OPTIONS: DeleteTaskOptions = {
  removeFromQb: true,
  deleteFiles: false,
  removeFromRadarr: false,
}

export function DeleteTaskDialog({ task, open, onClose, onConfirm }: DeleteTaskDialogProps) {
  const [options, setOptions] = useState<DeleteTaskOptions>(DEFAULT_OPTIONS)

  // 每次打开重置选项
  useEffect(() => {
    if (open) setOptions(DEFAULT_OPTIONS)
  }, [open])

  if (!task) return null

  // 删除文件必须先从 qBittorrent 删除任务
  const toggleDeleteFiles = (checked: boolean) =>
    setOptions((o) => ({ ...o, deleteFiles: checked, removeFromQb: checked ? true : o.removeFromQb }))

  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="删除下载任务"
      description={`「${task.title}」`}
    >
      <div className="space-y-4">
        <div className="flex items-start gap-3 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
          <AlertTriangle className="mt-0.5 size-4 shrink-0 text-red-300" />
          <p className="text-xs leading-relaxed text-red-200/90">
            此操作不可撤销。默认仅移除 HomeAI 的任务记录，你可以按需勾选下方更彻底的清理选项。
          </p>
        </div>

        <div className="space-y-2">
          <BaseOption />
          <OptionCheckbox
            label="从 qBittorrent 删除任务"
            description="停止做种并从下载客户端移除该种子。"
            checked={options.removeFromQb}
            disabled={options.deleteFiles}
            onChange={(c) => setOptions((o) => ({ ...o, removeFromQb: c }))}
          />
          <OptionCheckbox
            label="同时删除已下载文件"
            description="从磁盘彻底删除已下载的媒体文件，无法恢复。"
            danger
            checked={options.deleteFiles}
            onChange={toggleDeleteFiles}
          />
          <OptionCheckbox
            label="从 Radarr 移除电影"
            description="取消监控并从 Radarr 媒体管理中移除该影片。"
            checked={options.removeFromRadarr}
            onChange={(c) => setOptions((o) => ({ ...o, removeFromRadarr: c }))}
          />
        </div>

        <div className="flex gap-2 pt-1">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            取消
          </Button>
          <Button variant="destructive" className="flex-1" onClick={() => onConfirm(task, options)}>
            确认删除
          </Button>
        </div>
      </div>
    </Dialog>
  )
}

/** 始终执行的基础操作 */
function BaseOption() {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-white/8 bg-white/[0.03] p-3">
      <span className="mt-0.5 grid size-4 shrink-0 place-items-center rounded border border-white/20 bg-white/10 text-[10px] text-muted-foreground">
        ✓
      </span>
      <div>
        <p className="text-sm font-medium text-foreground">删除 HomeAI 任务记录</p>
        <p className="mt-0.5 text-xs text-muted-foreground">
          始终执行：从下载中心列表移除此任务记录。
        </p>
      </div>
    </div>
  )
}

function OptionCheckbox({
  label,
  description,
  checked,
  disabled,
  danger,
  onChange,
}: {
  label: string
  description: string
  checked: boolean
  disabled?: boolean
  danger?: boolean
  onChange: (checked: boolean) => void
}) {
  return (
    <label
      className={cn(
        "flex cursor-pointer items-start gap-3 rounded-xl border p-3 transition-colors",
        disabled && "cursor-not-allowed opacity-60",
        checked
          ? danger
            ? "border-red-500/30 bg-red-500/8"
            : "border-primary/30 bg-primary/8"
          : "border-white/8 bg-surface/40 hover:border-white/15",
      )}
    >
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className={cn(
          "mt-0.5 size-4 shrink-0 rounded border-white/20 bg-transparent",
          danger ? "accent-red-500" : "accent-primary",
        )}
      />
      <div>
        <p className={cn("text-sm font-medium", danger ? "text-red-200" : "text-foreground")}>
          {label}
        </p>
        <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
      </div>
    </label>
  )
}
