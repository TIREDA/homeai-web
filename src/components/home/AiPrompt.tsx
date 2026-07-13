import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Sparkles, Send, Shuffle, Users, Rocket, Clapperboard } from "lucide-react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const QUICK_PROMPTS = [
  { icon: Shuffle, label: "随机推荐", prompt: "随便帮我挑一部今晚适合看的电影" },
  { icon: Users, label: "家庭观影", prompt: "推荐一部全家一起看、适合孩子的高分电影" },
  { icon: Rocket, label: "高分科幻", prompt: "推荐近三年评分高于 7.5 的科幻电影" },
  { icon: Clapperboard, label: "补齐导演合集", prompt: "帮我补齐诺兰导演还没入库的作品" },
] as const

export function AiPrompt() {
  const [value, setValue] = useState("")
  const navigate = useNavigate()

  const submit = (text: string) => {
    const q = text.trim()
    if (!q) return
    navigate(`/assistant?q=${encodeURIComponent(q)}`)
  }

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault()
      submit(value)
    }
  }

  return (
    <section
      aria-label="AI 观影助手"
      className="relative overflow-hidden rounded-2xl border border-white/10 bg-surface/70 p-4 sm:p-5"
    >
      <div className="pointer-events-none absolute -right-16 -top-16 size-48 rounded-full bg-primary/10 blur-3xl" />

      <div className="relative flex items-center gap-2 text-sm font-medium">
        <span className="grid size-7 place-items-center rounded-lg bg-primary/15 text-primary">
          <Sparkles className="size-4" />
        </span>
        今晚想看什么？
      </div>

      <div className="relative mt-3 flex flex-col gap-2 sm:flex-row">
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          placeholder="例如：推荐近三年评分高于 7.5 的科幻电影"
          aria-label="向 AI 助手描述你的观影需求"
          className={cn(
            "min-w-0 flex-1 rounded-xl border border-white/10 bg-background/60 px-4 py-2.5 text-sm",
            "placeholder:text-muted-foreground/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          )}
        />
        <Button className="gap-1.5 sm:px-5" onClick={() => submit(value)}>
          <Send className="size-4" />
          发送
        </Button>
      </div>

      <div className="relative mt-3 flex flex-wrap gap-2">
        {QUICK_PROMPTS.map(({ icon: Icon, label, prompt }) => (
          <button
            key={label}
            type="button"
            onClick={() => submit(prompt)}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-muted-foreground",
              "transition-colors hover:border-primary/40 hover:bg-primary/10 hover:text-foreground",
            )}
          >
            <Icon className="size-3.5" />
            {label}
          </button>
        ))}
      </div>
    </section>
  )
}
