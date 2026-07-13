import { create } from "zustand"

import type { AssistantBlock, ChatMessage, Conversation } from "@/types/assistant"
import { buildResponse, welcomeBlocks } from "@/mocks/assistantScenarios"
import { DOWNLOAD_TASKS_DETAIL } from "@/mocks/downloadTasks"

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms))
const uid = (p: string) => `${p}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`
const nowIso = () => new Date().toISOString()

/** 生成一个带欢迎语的新会话 */
function newConversation(title = "新对话"): Conversation {
  return {
    id: uid("conv"),
    title,
    createdAt: nowIso(),
    updatedAt: nowIso(),
    messages: [
      { id: uid("msg"), role: "assistant", blocks: welcomeBlocks(), createdAt: nowIso() },
    ],
  }
}

/** 预置两个历史会话，让侧边栏更真实 */
function seedConversations(): Conversation[] {
  const c1 = newConversation("适合全家看的电影")
  const c2 = newConversation("补齐诺兰作品")
  return [c1, c2]
}

interface AssistantState {
  conversations: Conversation[]
  activeId: string
  /** 当前是否正在流式生成 */
  generating: boolean

  select: (id: string) => void
  createConversation: () => void
  deleteConversation: (id: string) => void

  send: (text: string) => Promise<void>
  stop: () => void

  /** 更新某条消息中的某个块（用于操作卡片状态流转） */
  patchBlock: (messageId: string, blockId: string, patch: Partial<AssistantBlock>) => void
  /** 追加一条助手消息（用于操作执行后的结果反馈） */
  appendAssistantMessage: (blocks: AssistantBlock[]) => void
}

/** 模块级取消标记：stop 时置真，流式循环检测后中断 */
let cancelled = false

export const useAssistantStore = create<AssistantState>((set, get) => ({
  conversations: seedConversations(),
  activeId: "",
  generating: false,

  select: (id) => set({ activeId: id }),

  createConversation: () => {
    const conv = newConversation()
    set((s) => ({ conversations: [conv, ...s.conversations], activeId: conv.id }))
  },

  deleteConversation: (id) =>
    set((s) => {
      const remaining = s.conversations.filter((c) => c.id !== id)
      const list = remaining.length ? remaining : [newConversation()]
      const activeId = s.activeId === id ? list[0].id : s.activeId
      return { conversations: list, activeId }
    }),

  stop: () => {
    cancelled = true
    set({ generating: false })
    // 结束当前正在流式的消息
    set((s) => ({
      conversations: s.conversations.map((c) => ({
        ...c,
        messages: c.messages.map((m) => (m.streaming ? { ...m, streaming: false } : m)),
      })),
    }))
  },

  patchBlock: (messageId, blockId, patch) =>
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id !== s.activeId
          ? c
          : {
              ...c,
              messages: c.messages.map((m) =>
                m.id !== messageId
                  ? m
                  : {
                      ...m,
                      blocks: m.blocks.map((b) =>
                        b.id === blockId ? ({ ...b, ...patch } as AssistantBlock) : b,
                      ),
                    },
              ),
            },
      ),
    })),

  appendAssistantMessage: (blocks) => {
    const msg: ChatMessage = { id: uid("msg"), role: "assistant", blocks, createdAt: nowIso() }
    set((s) => ({
      conversations: s.conversations.map((c) =>
        c.id === s.activeId
          ? { ...c, messages: [...c.messages, msg], updatedAt: nowIso() }
          : c,
      ),
    }))
  },

  send: async (text) => {
    const content = text.trim()
    if (!content || get().generating) return

    const activeId = get().activeId
    const userMsg: ChatMessage = {
      id: uid("msg"),
      role: "user",
      blocks: [{ id: uid("blk"), type: "text", text: content }],
      createdAt: nowIso(),
    }
    const assistantId = uid("msg")
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      blocks: [],
      createdAt: nowIso(),
      streaming: true,
    }

    // 若是该会话第一条用户消息，用它作为会话标题
    set((s) => ({
      generating: true,
      conversations: s.conversations.map((c) => {
        if (c.id !== activeId) return c
        const isFirstUser = !c.messages.some((m) => m.role === "user")
        return {
          ...c,
          title: isFirstUser ? content.slice(0, 18) : c.title,
          updatedAt: nowIso(),
          messages: [...c.messages, userMsg, assistantMsg],
        }
      }),
    }))

    cancelled = false
    const steps = buildResponse(content)

    // 思考停顿
    await sleep(500)

    const updateBlocks = (mut: (blocks: AssistantBlock[]) => AssistantBlock[]) =>
      set((s) => ({
        conversations: s.conversations.map((c) =>
          c.id !== activeId
            ? c
            : {
                ...c,
                messages: c.messages.map((m) =>
                  m.id === assistantId ? { ...m, blocks: mut(m.blocks) } : m,
                ),
              },
        ),
      }))

    for (const step of steps) {
      if (cancelled) break

      if (step.kind === "text") {
        // 新建一个文字块，逐词追加
        const textBlockId = uid("blk")
        updateBlocks((blocks) => [...blocks, { id: textBlockId, type: "text", text: "" }])
        const tokens = step.text.split("")
        let buffer = ""
        for (let i = 0; i < tokens.length; i++) {
          if (cancelled) break
          buffer += tokens[i]
          if (i % 2 === 0 || i === tokens.length - 1) {
            const snapshot = buffer
            updateBlocks((blocks) =>
              blocks.map((b) =>
                b.id === textBlockId && b.type === "text" ? { ...b, text: snapshot } : b,
              ),
            )
            await sleep(18)
          }
        }
      } else {
        await sleep(320)
        if (cancelled) break
        updateBlocks((blocks) => [...blocks, step.block])
      }
    }

    // 收尾
    set((s) => ({
      generating: false,
      conversations: s.conversations.map((c) =>
        c.id !== activeId
          ? c
          : {
              ...c,
              updatedAt: nowIso(),
              messages: c.messages.map((m) =>
                m.id === assistantId ? { ...m, streaming: false } : m,
              ),
            },
      ),
    }))
  },
}))

/** 便捷：按 id 取下载任务 mock */
export function getTaskById(id: string) {
  return DOWNLOAD_TASKS_DETAIL.find((t) => t.id === id)
}
