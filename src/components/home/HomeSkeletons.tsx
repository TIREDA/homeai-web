import { Skeleton } from "@/components/ui/skeleton"

/** Hero 区骨架 */
export function HeroSkeleton() {
  return (
    <div className="relative aspect-[16/9] max-h-[62vh] w-full overflow-hidden rounded-3xl border border-white/8 sm:aspect-[21/9]">
      <Skeleton className="absolute inset-0 rounded-none" />
      <div className="absolute inset-x-0 bottom-0 flex flex-col gap-3 p-6 sm:p-10">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-4 w-full max-w-md" />
        <div className="mt-2 flex gap-3">
          <Skeleton className="h-10 w-28 rounded-lg" />
          <Skeleton className="h-10 w-28 rounded-lg" />
        </div>
      </div>
    </div>
  )
}

/** 海报横向行骨架 */
export function RowSkeleton({ cards = 6 }: { cards?: number }) {
  return (
    <div>
      <Skeleton className="mb-3 h-6 w-32" />
      <div className="flex gap-3 overflow-hidden">
        {Array.from({ length: cards }).map((_, i) => (
          <div key={i} className="w-[38vw] shrink-0 sm:w-44 lg:w-48">
            <Skeleton className="aspect-[2/3] w-full rounded-xl" />
            <Skeleton className="mt-2 h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  )
}

/** 继续观看行骨架 */
export function ContinueWatchingSkeleton({ cards = 4 }: { cards?: number }) {
  return (
    <div className="flex gap-3 overflow-hidden">
      {Array.from({ length: cards }).map((_, i) => (
        <Skeleton key={i} className="aspect-video w-[70vw] shrink-0 rounded-xl sm:w-72" />
      ))}
    </div>
  )
}

/** 下载任务骨架 */
export function DownloadSkeleton({ cards = 2 }: { cards?: number }) {
  return (
    <div className="grid gap-3 md:grid-cols-2">
      {Array.from({ length: cards }).map((_, i) => (
        <Skeleton key={i} className="h-28 w-full rounded-xl" />
      ))}
    </div>
  )
}
