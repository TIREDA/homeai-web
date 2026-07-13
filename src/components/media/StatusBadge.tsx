import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { QUALITY_META, STATUS_META } from "@/lib/status"
import type { MediaStatus, QualityTag } from "@/types/media"

export function StatusBadge({ status, className }: { status: MediaStatus; className?: string }) {
  const meta = STATUS_META[status]
  return (
    <Badge className={cn(meta.className, className)}>
      {meta.active && (
        <span className="relative flex size-1.5">
          <span className="absolute inline-flex size-full animate-ping rounded-full bg-current opacity-60" />
          <span className="relative inline-flex size-1.5 rounded-full bg-current" />
        </span>
      )}
      {meta.label}
    </Badge>
  )
}

export function QualityBadge({ quality, className }: { quality: QualityTag; className?: string }) {
  const meta = QUALITY_META[quality]
  return <Badge className={cn(meta.className, className)}>{meta.label}</Badge>
}
