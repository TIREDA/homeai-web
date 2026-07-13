/**
 * AI 影音助手的消息模型。
 * AI 消息不是纯 Markdown，而是由结构化「块」组成，
 * 每种块都有明确的类型与专属渲染组件。
 */

/** 系统状态块中的单条指标 */
export interface StatusMetric {
  label: string
  value: string
  tone?: "ok" | "warn" | "error" | "muted"
}

/** 操作确认卡片的执行状态 */
export type ActionState = "pending" | "executed" | "cancelled"

/**
 * 结构化内容块的数据部分（不含 id）。
 * 单独抽出为联合类型，便于构造函数按判别式收窄类型。
 */
export type AssistantBlockData =
  | { type: "text"; text: string }
  /** 电影列表（网格卡片） */
  | { type: "movieList"; intro?: string; movieIds: number[] }
  /** 单部影片的详细卡片 */
  | { type: "movie"; movieId: number }
  /** 下载任务卡片 */
  | { type: "downloadTask"; taskId: string }
  /** 系统 / 媒体库状态卡片 */
  | { type: "systemStatus"; title: string; metrics: StatusMetric[] }
  /**
   * 操作确认卡片：明确区分「建议执行」与「已执行」。
   * pending 时可交互（确认 / 部分选择 / 取消），executed 后展示结果。
   */
  | {
      type: "action"
      title: string
      movieIds: number[]
      qualityProfile: string
      /** 预计总容量（字节） */
      estimatedBytes: number
      /** 是否为危险操作（需二次确认） */
      danger?: boolean
      searchNow: boolean
      state: ActionState
      /** 实际执行的影片（部分选择时为子集） */
      executedMovieIds?: number[]
    }
  /** 错误提示块 */
  | { type: "error"; text: string; hint?: string }

/** 助手消息中的结构化内容块（带唯一 id） */
export type AssistantBlock = { id: string } & AssistantBlockData

/** 一条对话消息 */
export interface ChatMessage {
  id: string
  role: "user" | "assistant"
  blocks: AssistantBlock[]
  createdAt: string
  /** 是否正在流式输出 */
  streaming?: boolean
}

/** 一个会话 */
export interface Conversation {
  id: string
  title: string
  createdAt: string
  updatedAt: string
  messages: ChatMessage[]
}
