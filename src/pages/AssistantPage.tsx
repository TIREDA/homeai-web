import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Sparkles, PanelLeftOpen, X, CheckCircle2 } from "lucide-react"

import { cn } from "@/lib/utils"
import { useMovies } from "@/hooks/queries"
import { useAssistantStore } from "@/store/useAssistantStore"
import type { AssistantBlock } from "@/types/assistant"
import type { DownloadTaskDetail, Movie } from "@/types/media"
import { QUICK_QUESTIONS } from "@/mocks/assistantScenarios"
import { ConversationSidebar } from "@/components/assistant/ConversationSidebar"
import { ChatComposer } from "@/components/assistant/ChatComposer"
import { MessageBubble, type MessageHandlers } from "@/components/assistant/MessageBubble"

const GB = 1024 * 1024 * 1024
let toastSeq = 0

export function AssistantPage() {
  const navigate = useNavigate()
  const [params, setParams] = useSearchParams()
  const { data: movies } = useMovies()

  const {
    conversations,
    activeId,
    generating,
    select,
    createConversation,
    deleteConversation,
    send,
    stop,
    patchBlock,
    appendAssistantMessage,
  } = useAssistantStore()

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [toasts, setToasts] = useState<{ id: number; text: string }[]>([])
  const scrollRef = useRef<HTMLDivElement>(null)

  const moviesById = useMemo(
    () => new Map((movies ?? []).map((m) => [m.id, m])),
    [movies],
  )

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0]

  // 初始化选中第一个会话
  useEffect(() => {
    if (!activeId && conversations.length) select(conversations[0].id)
  }, [activeId, conversations, select])

  // 处理来自首页的 ?q= 自动提问（仅一次）
  const consumedQuery = useRef(false)
  useEffect(() => {
    if (consumedQuery.current || !activeId) return
    const q = params.get("q")
    if (q) {
      consumedQuery.current = true
      void send(q)
      params.delete("q")
      setParams(params, { replace: true })
    }
  }, [activeId, params, send, setParams])

  // 自动滚动到底部
  useEffect(() => {
    const el = scrollRef.current
    if (el) el.scrollTop = el.scrollHeight
  }, [active?.messages])

  const pushToast = (text: string) => {
    const id = toastSeq++
    setToasts((t) => [...t, { id, text }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2600)
  }

  const handlers: MessageHandlers = {
    moviesById,
    onOpenMovie: (m) => navigate(`/movies/${m.tmdbId}`),
    onPlayMovie: (m) => pushToast(`正在 Emby 中播放《${m.title}》`),
    onDownloadMovie: (m) => {
      // 追加一条带单片操作确认卡片的助手消息，走统一确认流程
      const block: AssistantBlock = {
        id: `blk-dl-${Date.now().toString(36)}`,
        type: "action",
        title: `准备将《${m.title}》加入 4K 下载`,
        movieIds: [m.id],
        qualityProfile: "Ultra-HD (2160p)",
        estimatedBytes: 55 * GB,
        searchNow: true,
        danger: false,
        state: "pending",
      }
      appendAssistantMessage([
        { id: `blk-t-${Date.now().toString(36)}`, type: "text", text: "好的，请确认下面的下载配置：" },
        block,
      ])
    },
    onRetryTask: (t: DownloadTaskDetail) => pushToast(`已重新搜索《${t.title}》的片源`),
    onOpenTask: () => navigate("/downloads"),
    onConfirmAction: (messageId, block, ids, searchNow) => {
      if (block.type !== "action") return
      patchBlock(messageId, block.id, {
        state: "executed",
        executedMovieIds: ids,
        searchNow,
      } as Partial<AssistantBlock>)
      const names = ids.map((id) => moviesById.get(id)?.title).filter(Boolean)
      pushToast(`已创建 ${ids.length} 个下载任务`)
      appendAssistantMessage([
        {
          id: `blk-done-${Date.now().toString(36)}`,
          type: "text",
          text: `已为你创建 ${ids.length} 个 4K 下载任务${
            names.length ? `：${names.join("、")}` : ""
          }${searchNow ? "，正在搜索片源" : ""}。可在下载中心查看进度。`,
        },
      ])
    },
    onCancelAction: (messageId, block) => {
      patchBlock(messageId, block.id, { state: "cancelled" } as Partial<AssistantBlock>)
    },
  }

  const showWelcome = active && active.messages.filter((m) => m.role === "user").length === 0

  return (
    <div className="flex h-[calc(100dvh-7rem)] gap-4 sm:h-[calc(100dvh-8rem)]">
      {/* 桌面端会话列表 */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <ConversationSidebar
          conversations={conversations}
          activeId={activeId}
          onSelect={select}
          onCreate={createConversation}
          onDelete={deleteConversation}
        />
      </aside>

      {/* 主对话区域 */}
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden rounded-2xl border border-white/8 bg-surface/40">
        {/* 头部 */}
        <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
          <button
            type="button"
            onClick={() => setDrawerOpen(true)}
            aria-label="打开会话列表"
            className="grid size-9 place-items-center rounded-lg text-muted-foreground hover:bg-white/5 hover:text-foreground lg:hidden"
          >
            <PanelLeftOpen className="size-5" />
          </button>
          <span className="grid size-8 place-items-center rounded-lg bg-primary/15 text-primary">
            <Sparkles className="size-4" />
          </span>
          <div className="min-w-0">
            <h1 className="truncate text-sm font-semibold">{active?.title ?? "AI 影音助手"}</h1>
            <p className="text-xs text-muted-foreground">
              {generating ? "正在生成回复…" : "在线 · 可搜索、匹配片源并提交下载"}
            </p>
          </div>
        </div>

        {/* 消息列表 */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
          <div className="mx-auto w-full max-w-3xl space-y-6">
            {active?.messages.map((m) => (
              <MessageBubble key={m.id} message={m} handlers={handlers} />
            ))}

            {showWelcome && <QuickQuestions onPick={(q) => void send(q)} disabled={generating} />}
          </div>
        </div>

        {/* 输入区 */}
        <ChatComposer generating={generating} onSend={(t) => void send(t)} onStop={stop} />
      </div>

      {/* 移动端抽屉 */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <button
            type="button"
            aria-label="关闭会话列表"
            onClick={() => setDrawerOpen(false)}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          <div className="absolute left-0 top-0 h-full w-72 border-r border-white/10 bg-background p-3 animate-in slide-in-from-left">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold">会话</span>
              <button
                type="button"
                aria-label="关闭"
                onClick={() => setDrawerOpen(false)}
                className="grid size-8 place-items-center rounded-lg text-muted-foreground hover:bg-white/10"
              >
                <X className="size-4" />
              </button>
            </div>
            <ConversationSidebar
              className="h-[calc(100%-2.5rem)]"
              conversations={conversations}
              activeId={activeId}
              onSelect={(id) => {
                select(id)
                setDrawerOpen(false)
              }}
              onCreate={() => {
                createConversation()
                setDrawerOpen(false)
              }}
              onDelete={deleteConversation}
            />
          </div>
        </div>
      )}

      {/* Toast */}
      <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className="flex items-center gap-2 rounded-full border border-white/10 bg-surface px-4 py-2 text-sm shadow-lg shadow-black/40 animate-in fade-in slide-in-from-bottom-2"
          >
            <CheckCircle2 className="size-4 text-emerald-300" />
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}

function QuickQuestions({ onPick, disabled }: { onPick: (q: string) => void; disabled: boolean }) {
  return (
    <div className="pt-2">
      <p className="mb-2.5 px-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
        快捷问题
      </p>
      <div className="grid gap-2 sm:grid-cols-2">
        {QUICK_QUESTIONS.map((q) => (
          <button
            key={q}
            type="button"
            disabled={disabled}
            onClick={() => onPick(q)}
            className={cn(
              "flex items-center gap-2 rounded-xl border border-white/10 bg-background/40 px-3.5 py-3 text-left text-sm transition-colors",
              "hover:border-primary/40 hover:bg-primary/8 disabled:opacity-50",
            )}
          >
            <span className="grid size-6 shrink-0 place-items-center rounded-md bg-primary/12 text-primary">
              <Sparkles className="size-3.5" />
            </span>
            <span className="text-foreground/90">{q}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
