import type { LucideIcon } from "lucide-react"
import { AlertTriangle, Inbox, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { ApiError } from "@/types/api"

interface EmptyStateProps { icon?: LucideIcon; title: string; description?: string; className?: string }
export function EmptyState({ icon: Icon = Inbox, title, description, className }: EmptyStateProps) {
  return <div className={"flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/10 bg-surface/40 px-6 py-10 text-center " + (className ?? "")}><span className="grid size-11 place-items-center rounded-full bg-white/5 text-muted-foreground"><Icon className="size-5" /></span><p className="text-sm font-medium text-foreground">{title}</p>{description && <p className="max-w-sm text-xs text-muted-foreground">{description}</p>}</div>
}

interface ErrorStateProps { title?: string; description?: string; onRetry?: () => void; className?: string; error?: unknown }
export function ErrorState({ title = "加载失败", description = "无法连接到媒体服务，请稍后重试。", onRetry, className, error }: ErrorStateProps) {
  const apiError = error instanceof ApiError ? error : undefined
  const errorDescription = apiError ? `${apiError.message}${apiError.requestId ? `（请求 ID：${apiError.requestId}）` : ""}` : description
  return <div className={"flex flex-col items-center justify-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/5 px-6 py-10 text-center " + (className ?? "")}><span className="grid size-11 place-items-center rounded-full bg-red-500/10 text-red-300"><AlertTriangle className="size-5" /></span><div><p className="text-sm font-medium text-foreground">{title}</p><p className="mt-0.5 max-w-sm text-xs text-muted-foreground">{errorDescription}</p></div>{onRetry && <Button size="sm" variant="secondary" className="gap-1.5" onClick={onRetry}><RefreshCw className="size-3.5" />重试</Button>}</div>
}
