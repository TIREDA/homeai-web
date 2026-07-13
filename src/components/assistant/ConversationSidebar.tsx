import { Plus, MessageSquare, Trash2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { formatRelativeTime } from "@/lib/format"
import type { Conversation } from "@/types/assistant"

interface ConversationSidebarProps {
  conversations: Conversation[]
  activeId: string
  onSelect: (id: string) => void
  onCreate: () => void
  onDelete: (id: string) => void
  className?: string
}

export function ConversationSidebar({
  conversations,
  activeId,
  onSelect,
  onCreate,
  onDelete,
  className,
}: ConversationSidebarProps) {
  return (
    <div className={cn("flex h-full flex-col gap-3", className)}>
      <button
        type="button"
        onClick={onCreate}
        className="flex items-center justify-center gap-1.5 rounded-xl border border-white/10 bg-primary/10 px-3 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-primary/15"
      >
        <Plus className="size-4" />
        新建对话
      </button>

      <div className="px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        最近会话
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-0.5">
        {conversations.map((c) => {
          const active = c.id === activeId
          const lastUser = [...c.messages].reverse().find((m) => m.role === "user")
          const preview = lastUser?.blocks.find((b) => b.type === "text")
          return (
            <div
              key={c.id}
              className={cn(
                "group relative flex cursor-pointer items-start gap-2 rounded-xl border px-2.5 py-2 transition-colors",
                active
                  ? "border-primary/30 bg-primary/10"
                  : "border-transparent hover:border-white/10 hover:bg-white/5",
              )}
              onClick={() => onSelect(c.id)}
            >
              <MessageSquare
                className={cn("mt-0.5 size-4 shrink-0", active ? "text-primary" : "text-muted-foreground")}
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">{c.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {preview && preview.type === "text" ? preview.text : "开始一段新的对话"}
                </p>
                <p className="mt-0.5 text-[10px] text-muted-foreground/70">
                  {formatRelativeTime(c.updatedAt)}
                </p>
              </div>
              <button
                type="button"
                aria-label={`删除会话 ${c.title}`}
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(c.id)
                }}
                className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-all hover:bg-red-500/15 hover:text-red-300 group-hover:opacity-100"
              >
                <Trash2 className="size-3.5" />
              </button>
            </div>
          )
        })}
      </nav>
    </div>
  )
}
