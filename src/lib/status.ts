import type { MediaStatus, QbStatus, QualityTag, RadarrImportStatus } from "@/types/media"

export interface StatusMeta {
  label: string
  /** tailwind 类：文本 + 背景 + 边框，语义化颜色，适配深色主题 */
  className: string
  /** 是否为进行中的动态状态（可用于脉冲动画） */
  active?: boolean
}

/** 聚合状态的中文标签与配色 */
export const STATUS_META: Record<MediaStatus, StatusMeta> = {
  not_collected: {
    label: "未收藏",
    className: "text-muted-foreground bg-white/5 border-white/10",
  },
  in_radarr: {
    label: "已加入 Radarr",
    className: "text-sky-300 bg-sky-500/15 border-sky-500/25",
  },
  searching: {
    label: "正在搜索",
    className: "text-violet-200 bg-violet-500/15 border-violet-500/25",
    active: true,
  },
  queued: {
    label: "等待下载",
    className: "text-slate-200 bg-slate-500/20 border-slate-400/25",
  },
  downloading: {
    label: "正在下载",
    className: "text-primary bg-primary/15 border-primary/30",
    active: true,
  },
  importing: {
    label: "等待导入",
    className: "text-amber-200 bg-amber-500/15 border-amber-500/25",
    active: true,
  },
  in_library: {
    label: "已入库",
    className: "text-emerald-300 bg-emerald-500/15 border-emerald-500/25",
  },
  failed: {
    label: "下载失败",
    className: "text-red-300 bg-red-500/15 border-red-500/25",
  },
}

/** 画质标签的中文标签与配色 */
export const QUALITY_META: Record<QualityTag, StatusMeta> = {
  "1080p": {
    label: "已有 1080P",
    className: "text-slate-100 bg-white/10 border-white/15",
  },
  "4k": {
    label: "已有 4K",
    className: "text-emerald-200 bg-emerald-500/15 border-emerald-500/25",
  },
  hdr: {
    label: "HDR",
    className: "text-cyan-200 bg-cyan-500/15 border-cyan-500/25",
  },
  dolby_vision: {
    label: "Dolby Vision",
    className: "text-indigo-200 bg-indigo-500/15 border-indigo-500/30",
  },
}

/**
 * qBittorrent 状态标签与配色。
 * 配色克制：仅用中性灰 + 主色，异常状态才用红/琥珀。
 */
export const QB_STATUS_META: Record<QbStatus, StatusMeta> = {
  searching: { label: "搜索中", className: "text-muted-foreground bg-white/5 border-white/10" },
  queued: { label: "排队中", className: "text-slate-200 bg-white/5 border-white/10" },
  downloading: { label: "下载中", className: "text-primary bg-primary/12 border-primary/25" },
  stalled: { label: "已停滞", className: "text-amber-200/90 bg-amber-500/10 border-amber-500/20" },
  paused: { label: "已暂停", className: "text-muted-foreground bg-white/5 border-white/10" },
  seeding: { label: "做种中", className: "text-emerald-200/90 bg-emerald-500/10 border-emerald-500/20" },
  completed: { label: "已完成", className: "text-slate-200 bg-white/5 border-white/10" },
  error: { label: "错误", className: "text-red-300 bg-red-500/10 border-red-500/25" },
}

/** Radarr 导入状态标签与配色 */
export const RADARR_STATUS_META: Record<RadarrImportStatus, StatusMeta> = {
  not_started: { label: "未导入", className: "text-muted-foreground bg-white/5 border-white/10" },
  pending: { label: "等待导入", className: "text-slate-200 bg-white/5 border-white/10" },
  importing: {
    label: "导入中",
    className: "text-amber-200/90 bg-amber-500/10 border-amber-500/20",
    active: true,
  },
  imported: {
    label: "已导入",
    className: "text-emerald-200/90 bg-emerald-500/10 border-emerald-500/20",
  },
  failed: { label: "导入失败", className: "text-red-300 bg-red-500/10 border-red-500/25" },
}

/** 简短画质角标（海报角标用） */
export const QUALITY_SHORT: Record<QualityTag, string> = {
  "1080p": "1080P",
  "4k": "4K",
  hdr: "HDR",
  dolby_vision: "DV",
}
