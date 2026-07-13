import { useRef, useState } from "react"
import { Send, Square, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { ASSISTANT_CAPABILITIES } from "@/mocks/assistantScenarios"

interface ChatComposerProps {
  generating: boolean
  onSend: (text: string) => void
  onStop: () => void
}

/** 输入区快捷命令 */
const COMMANDS = [
  { label: "查看失败任务", prompt: "查看下载失败的任务" },
  { label: "检查 1080P", prompt: "检查哪些电影只有 1080P" },
  { label: "推荐未看", prompt: "推荐 Emby 中还没看过的电影" },
] as const

export function ChatComposer({ generating, onSend, onStop }: ChatComposerProps) {
  const [value, setValue] = useState("")
  const ref = useRef<HTMLTextAreaElement>(null)

  const submit = () => {
    const q = value.trim()
    if (!q || generating) return
    onSend(q)
    setValue("")
    if (ref.current) ref.current.style.height = "auto"
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      submit()
    }
  }

  const autoGrow = () => {
    const el = ref.current
    if (!el) return
    el.style.height = "auto"
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`
  }

  return (
    <div className="border-t border-white/8 bg-background/80 px-4 py-3 backdrop-blur sm:px-6">
      <div className="mx-auto w-full max-w-3xl space-y-2">
        {/* AI 可执行动作提示 */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
            <Sparkles className="size-3 text-primary" />
            AI 可执行：
          </span>
          {ASSISTANT_CAPABILITIES.map((cap) => (
            <span
              key={cap}
              className="rounded-full border border-white/8 bg-white/4 px-2 py-0.5 text-[11px] text-muted-foreground"
            >
              {cap}
            </span>
          ))}
        </div>

        {/* 快捷命令 */}
        <div className="flex flex-wrap gap-1.5">
          {COMMANDS.map((c) => (
            <button
              key={c.label}
              type="button"
              disabled={generating}
              onClick={() => onSend(c.prompt)}
              className="rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground disabled:opacity-50"
            >
              {c.label}
            </button>
          ))}
        </div>

        {/* 输入框 */}
        <div className="flex items-end gap-2 rounded-2xl border border-white/12 bg-surface/70 p-2 focus-within:border-primary/40">
          <textarea
            ref={ref}
            value={value}
            rows={1}
            onChange={(e) => {
              setValue(e.target.value)
              autoGrow()
            }}
            onKeyDown={onKeyDown}
            placeholder="描述你想看的内容，或让我帮你搜索、下载…（Enter 发送，Shift+Enter 换行）"
            aria-label="向 AI 助手输入消息"
            className="max-h-40 min-h-9 flex-1 resize-none bg-transparent px-2 py-1.5 text-sm leading-relaxed placeholder:text-muted-foreground/60 focus-visible:outline-none"
          />
          {generating ? (
            <button
              type="button"
              onClick={onStop}
              className="grid size-9 shrink-0 place-items-center rounded-xl bg-white/10 text-foreground transition-colors hover:bg-white/15"
              aria-label="停止生成"
            >
              <Square className="size-4 fill-current" />
            </button>
          ) : (
            <button
              type="button"
              onClick={submit}
              disabled={!value.trim()}
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-xl transition-colors",
                value.trim()
                  ? "bg-primary text-primary-foreground hover:bg-primary/85"
                  : "bg-white/8 text-muted-foreground",
              )}
              aria-label="发送"
            >
              <Send className="size-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
