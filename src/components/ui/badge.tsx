import type { HTMLAttributes } from "react"
import { cn } from "@/lib/utils"

/** 通用徽标：默认样式，可通过 className 覆盖语义化配色 */
export function Badge({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-medium leading-none whitespace-nowrap",
        className,
      )}
      {...props}
    />
  )
}
