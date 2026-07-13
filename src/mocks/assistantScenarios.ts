import type { AssistantBlock, AssistantBlockData } from "@/types/assistant"

const GB = 1024 * 1024 * 1024

let seq = 0
const bid = () => `blk-${Date.now().toString(36)}-${(seq++).toString(36)}`

/** 流式步骤：文字逐字输出，或整块插入 */
export type ResponseStep =
  | { kind: "text"; text: string }
  | { kind: "block"; block: AssistantBlock }

/** 快捷问题定义（用于快捷问题区与输入区提示） */
export const QUICK_QUESTIONS = [
  "推荐今晚适合一家人看的电影",
  "找近三年高分科幻片",
  "检查哪些电影只有 1080P",
  "帮我补齐诺兰电影",
  "查看下载失败的任务",
  "推荐 Emby 中还没看过的电影",
] as const

/** 输入区展示的「AI 可执行动作」提示 */
export const ASSISTANT_CAPABILITIES = [
  "搜索片源",
  "加入 Radarr 监控",
  "提交 4K 下载",
  "查询媒体库",
  "检查下载任务",
] as const

/** 便捷构造带 id 的块 */
function block(b: AssistantBlockData): AssistantBlock {
  return { id: bid(), ...b }
}

/**
 * 依据用户输入返回一段脚本化的流式响应。
 * 用关键词匹配到不同的演示场景，未命中则走通用推荐。
 */
export function buildResponse(prompt: string): ResponseStep[] {
  const q = prompt.toLowerCase()

  // 1. 家庭观影
  if (/家|一家|孩子|亲子|全家/.test(prompt)) {
    return [
      { kind: "text", text: "为你挑选了 3 部适合全家一起观看的高分影片，画面温暖、老少皆宜，并且都已在 Emby 中入库，点开即可播放：" },
      { kind: "block", block: block({ type: "movieList", movieIds: [7, 5, 3] }) },
      { kind: "text", text: "《提灯节》是温馨的家庭动画，评分 8.4；《深蓝之息》是适合孩子的海洋纪录片。要不要我帮你把它们加入今晚的播放列表？" },
    ]
  }

  // 2. 近三年高分科幻
  if (/科幻|sci|太空|未来/.test(prompt) || /科幻/.test(q)) {
    return [
      { kind: "text", text: "在近三年（2022 起）里，我筛选出评分 7.5 分以上的科幻影片如下：" },
      { kind: "block", block: block({ type: "movieList", movieIds: [1, 5] }) },
      { kind: "text", text: "其中《星海拓荒》已有 4K Dolby Vision 版本，是目前库内画质最好的科幻片。" },
    ]
  }

  // 3. 检查仅 1080P → 建议升级 4K（操作确认）
  if (/1080|画质|升级|4k|标清|高清/i.test(prompt)) {
    return [
      { kind: "text", text: "我扫描了媒体库，发现以下影片目前只有 1080P 版本，具备升级到 4K 的空间：" },
      { kind: "block", block: block({ type: "movieList", movieIds: [2, 5] }) },
      { kind: "text", text: "建议将它们升级到 4K HDR。下面是我准备执行的操作，请你确认：" },
      {
        kind: "block",
        block: block({
          type: "action",
          title: "准备将以下 2 部影片升级为 4K 下载",
          movieIds: [2, 5],
          qualityProfile: "Ultra-HD (2160p)",
          estimatedBytes: 58 * GB + 43 * GB,
          searchNow: true,
          danger: false,
          state: "pending",
        }),
      },
    ]
  }

  // 4. 补齐导演合集（诺兰）→ 大批量操作确认（危险）
  if (/诺兰|导演|合集|补齐|系列|nolan/i.test(prompt)) {
    return [
      { kind: "text", text: "我对比了 TMDB 的克里斯托弗·诺兰作品列表与你的媒体库，发现有 5 部尚未收藏。以下是补齐计划：" },
      {
        kind: "block",
        block: block({
          type: "action",
          title: "准备将以下 5 部影片加入 4K 下载",
          movieIds: [1, 3, 6, 8, 4],
          qualityProfile: "Ultra-HD (2160p)",
          estimatedBytes: 5 * 55 * GB,
          searchNow: true,
          danger: true,
          state: "pending",
        }),
      },
      { kind: "text", text: "这会一次性创建 5 个下载任务并占用约 275 GB 空间，属于批量操作，请谨慎确认。" },
    ]
  }

  // 5. 查看下载失败任务
  if (/失败|错误|下载不了|卡住|停滞|fail/i.test(prompt)) {
    return [
      { kind: "text", text: "当前有 1 个下载任务处于失败状态：" },
      { kind: "block", block: block({ type: "downloadTask", taskId: "hai-1007" }) },
      {
        kind: "block",
        block: block({
          type: "error",
          text: "《深蓝之息》做种者全部离线，qBittorrent 报告 “stalled (no seeds)”。",
          hint: "建议重试搜索其它片源，或更换索引器后再试。",
        }),
      },
      { kind: "text", text: "需要我帮你重新搜索这部影片的可用片源吗？" },
    ]
  }

  // 6. Emby 中还没看过的
  if (/没看|未看|看过|emby|媒体库|库存/i.test(prompt)) {
    return [
      { kind: "text", text: "根据 Emby 的播放记录，以下已入库影片你还没有看过：" },
      { kind: "block", block: block({ type: "movieList", movieIds: [3, 7, 5] }) },
      {
        kind: "block",
        block: block({
          type: "systemStatus",
          title: "媒体库概览",
          metrics: [
            { label: "已入库影片", value: "1,284 部" },
            { label: "未观看", value: "312 部", tone: "warn" },
            { label: "4K / HDR", value: "342 部", tone: "ok" },
            { label: "本月新增", value: "26 部" },
          ],
        }),
      },
    ]
  }

  // 通用 / 随机推荐
  return [
    { kind: "text", text: "好的，我根据你的媒体库和评分，为你推荐这几部值得一看的影片：" },
    { kind: "block", block: block({ type: "movieList", movieIds: [1, 7, 3, 5] }) },
    { kind: "text", text: "想让我按类型、年份或画质进一步筛选，或者直接帮你提交下载吗？" },
  ]
}

/** 会话首条欢迎语 */
export function welcomeBlocks(): AssistantBlock[] {
  return [
    block({
      type: "text",
      text: "你好，我是 HomeAI 影音助手。你可以用自然语言让我推荐影片、检查画质、补齐合集，或帮你搜索片源并提交下载。试试下面的快捷问题，或直接告诉我你想看什么。",
    }),
  ]
}
