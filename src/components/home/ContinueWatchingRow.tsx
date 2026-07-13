import type { ContinueWatching } from "@/types/media"
import { ContinueWatchingCard } from "./ContinueWatchingCard"
import { SectionHeader } from "./SectionHeader"

export function ContinueWatchingRow({ items }: { items: ContinueWatching[] }) {
  if (items.length === 0) return null

  return (
    <section>
      <SectionHeader title="继续观看" subtitle="接着上次的进度" />
      <div className="no-scrollbar flex snap-x snap-mandatory gap-3 overflow-x-auto pb-1">
        {items.map((item) => (
          <ContinueWatchingCard
            key={item.id}
            item={item}
            className="w-[70vw] shrink-0 snap-start sm:w-72"
          />
        ))}
      </div>
    </section>
  )
}
