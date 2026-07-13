import { Sparkles, User } from "lucide-react"

import { cn } from "@/lib/utils"
import type { AssistantBlock, ChatMessage } from "@/types/assistant"
import type { DownloadTaskDetail, Movie } from "@/types/media"
import { getTaskById } from "@/store/useAssistantStore"
import { AssistantMovieCard } from "./AssistantMovieCard"
import { ActionCard } from "./ActionCard"
import { TextBlock, DownloadTaskBlock, SystemStatusBlock, ErrorBlock } from "./InfoBlocks"

export interface MessageHandlers {
  moviesById: Map<number, Movie>
  onOpenMovie: (movie: Movie) => void
  onDownloadMovie: (movie: Movie) => void
  onPlayMovie: (movie: Movie) => void
  onRetryTask: (task: DownloadTaskDetail) => void
  onOpenTask: (task: DownloadTaskDetail) => void
  onConfirmAction: (messageId: string, block: AssistantBlock, ids: number[], searchNow: boolean) => void
  onCancelAction: (messageId: string, block: AssistantBlock) => void
}

export function MessageBubble({
  message,
  handlers,
}: {
  message: ChatMessage
  handlers: MessageHandlers
}) {
  const isUser = message.role === "user"

  return (
    <div className={cn("flex gap-3", isUser && "flex-row-reverse")}>
      {/* 头像 */}
      <div
        className={cn(
          "grid size-8 shrink-0 place-items-center rounded-full",
          isUser ? "bg-white/10 text-foreground" : "bg-primary/15 text-primary",
        )}
      >
        {isUser ? <User className="size-4" /> : <Sparkles className="size-4" />}
      </div>

      {/* 内容 */}
      <div className={cn("flex min-w-0 max-w-[calc(100%-3rem)] flex-col gap-2.5", isUser && "items-end")}>
        {isUser ? (
          <div className="rounded-2xl rounded-tr-sm bg-primary px-3.5 py-2 text-sm text-primary-foreground">
            {message.blocks.map((b) => (b.type === "text" ? <span key={b.id}>{b.text}</span> : null))}
          </div>
        ) : (
          <div className="w-full space-y-2.5">
            {message.blocks.length === 0 && message.streaming && <ThinkingDots />}
            {message.blocks.map((block) => (
              <BlockRenderer
                key={block.id}
                block={block}
                messageId={message.id}
                streaming={message.streaming}
                handlers={handlers}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function BlockRenderer({
  block,
  messageId,
  streaming,
  handlers,
}: {
  block: AssistantBlock
  messageId: string
  streaming?: boolean
  handlers: MessageHandlers
}) {
  const { moviesById } = handlers

  switch (block.type) {
    case "text":
      return <TextBlock text={block.text} streaming={streaming} />

    case "movieList": {
      const movies = block.movieIds.map((id) => moviesById.get(id)).filter(Boolean) as Movie[]
      return (
        <div>
          {block.intro && <p className="mb-2 text-sm text-foreground/90">{block.intro}</p>}
          <div className="grid gap-2 sm:grid-cols-2">
            {movies.map((m) => (
              <AssistantMovieCard
                key={m.id}
                movie={m}
                onOpen={handlers.onOpenMovie}
                onDownload={handlers.onDownloadMovie}
                onPlay={handlers.onPlayMovie}
              />
            ))}
          </div>
        </div>
      )
    }

    case "movie": {
      const m = moviesById.get(block.movieId)
      if (!m) return null
      return (
        <div className="sm:max-w-md">
          <AssistantMovieCard
            movie={m}
            onOpen={handlers.onOpenMovie}
            onDownload={handlers.onDownloadMovie}
            onPlay={handlers.onPlayMovie}
          />
        </div>
      )
    }

    case "downloadTask": {
      const task = getTaskById(block.taskId)
      if (!task) return null
      return <DownloadTaskBlock task={task} onRetry={handlers.onRetryTask} onOpen={handlers.onOpenTask} />
    }

    case "systemStatus":
      return <SystemStatusBlock title={block.title} metrics={block.metrics} />

    case "action": {
      const movies = block.movieIds.map((id) => moviesById.get(id)).filter(Boolean) as Movie[]
      return (
        <ActionCard
          block={block}
          movies={movies}
          onConfirm={(ids, searchNow) => handlers.onConfirmAction(messageId, block, ids, searchNow)}
          onCancel={() => handlers.onCancelAction(messageId, block)}
        />
      )
    }

    case "error":
      return <ErrorBlock text={block.text} hint={block.hint} />

    default:
      return null
  }
}

function ThinkingDots() {
  return (
    <div className="flex items-center gap-1 rounded-2xl rounded-tl-sm bg-surface/60 px-3.5 py-3">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-muted-foreground/70"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </div>
  )
}
