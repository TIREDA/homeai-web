/**
 * HomeAI 领域模型
 * 这些类型对应后续 Spring Boot REST API 的响应结构，
 * mock 数据与真实接口共用同一套类型定义。
 */

/** 影片在整个系统中的聚合状态（TMDB / Radarr / qBittorrent / Emby） */
export type MediaStatus =
  | "not_collected" // 未收藏
  | "in_radarr" // 已加入 Radarr
  | "searching" // 正在搜索
  | "queued" // 等待下载
  | "downloading" // 正在下载
  | "importing" // 等待导入
  | "in_library" // 已入库
  | "failed" // 下载失败

/** 影片当前可用的画质标签 */
export type QualityTag = "1080p" | "4k" | "hdr" | "dolby_vision"

export interface Genre {
  id: number
  name: string
}

/** 影片核心模型（聚合 TMDB 元数据与本地库状态） */
export interface Movie {
  id: number
  tmdbId: number
  title: string
  originalTitle: string
  overview: string
  /** 2:3 竖版海报 */
  posterUrl: string
  /** 16:9 横版剧照 / 背景 */
  backdropUrl: string
  releaseYear: number
  runtimeMinutes: number
  /** TMDB 评分 0-10 */
  voteAverage: number
  genres: Genre[]
  status: MediaStatus
  /** 本地已具备的画质，可能为空 */
  qualities: QualityTag[]
  /** 是否在关注 / 收藏列表 */
  favorited: boolean
}

/** 首页 / 发现页的横向内容行 */
export interface MediaRow {
  id: string
  title: string
  subtitle?: string
  movies: Movie[]
}

/** qBittorrent 下载任务 */
export interface DownloadTask {
  id: string
  movieId: number
  title: string
  posterUrl: string
  quality: QualityTag
  /** 0-100 */
  progress: number
  /** 字节每秒 */
  downloadSpeed: number
  /** 剩余秒数，null 表示未知 */
  etaSeconds: number | null
  sizeBytes: number
  downloadedBytes: number
  seeders: number
  leechers: number
  status: MediaStatus
}

/** qBittorrent 客户端状态 */
export type QbStatus =
  | "searching" // 正在搜索片源
  | "queued" // 队列等待
  | "downloading" // 下载中
  | "stalled" // 无速度 / 卡住
  | "paused" // 已暂停
  | "seeding" // 做种中
  | "completed" // 已完成
  | "error" // 客户端报错

/** Radarr 导入状态 */
export type RadarrImportStatus =
  | "not_started" // 尚未开始
  | "pending" // 等待导入
  | "importing" // 正在导入
  | "imported" // 已导入媒体库
  | "failed" // 导入失败

/** 任务状态变化时间线节点 */
export interface TaskEvent {
  /** 时间线状态键 */
  key: string
  label: string
  /** ISO 时间 */
  timestamp: string
  /** 是否为异常节点 */
  error?: boolean
}

/** 下载任务完整详情（聚合 qBittorrent + Radarr + HomeAI 记录） */
export interface DownloadTaskDetail extends DownloadTask {
  /** 完整资源标题（原始种子名） */
  releaseTitle: string
  /** 上传速度 字节/秒 */
  uploadSpeed: number
  /** 任务创建时间 ISO */
  createdAt: string
  /** qBittorrent 状态 */
  qbStatus: QbStatus
  /** Radarr 导入状态 */
  radarrImportStatus: RadarrImportStatus
  /** qBittorrent 种子 Hash */
  hash: string
  /** Radarr Movie ID */
  radarrMovieId: number
  /** TMDB ID */
  tmdbId: number
  /** 索引器 */
  indexer: string
  /** qBittorrent 下载目录 */
  downloadDir: string
  /** Radarr 媒体目标目录 */
  targetDir: string
  /** 状态变化时间线 */
  timeline: TaskEvent[]
  /** 错误信息（失败时） */
  errorMessage?: string
}

/** 删除下载任务的选项 */
export interface DeleteTaskOptions {
  /** 从 qBittorrent 删除任务 */
  removeFromQb: boolean
  /** 同时删除已下载文件 */
  deleteFiles: boolean
  /** 从 Radarr 移除电影 */
  removeFromRadarr: boolean
}

/** 继续观看条目（来自 Emby 播放进度） */
export interface ContinueWatching {
  id: string
  movieId: number
  title: string
  originalTitle: string
  /** 16:9 横版缩略图 */
  backdropUrl: string
  releaseYear: number
  /** 0-100 播放进度 */
  progress: number
  /** 剩余分钟 */
  remainingMinutes: number
  /** 正在观看的家庭成员 */
  watcher: string
}

/** 视频分辨率标签 */
export type Resolution = "2160p" | "1080p" | "720p"
/** 片源类型 */
export type ReleaseSource = "Remux" | "BluRay" | "WEB-DL" | "WEBRip" | "HDTV"
/** 视频编码 */
export type VideoCodec = "HEVC" | "H264" | "AV1"
/** HDR 格式 */
export type HdrFormat = "SDR" | "HDR10" | "HDR10+" | "Dolby Vision"

/** 演员 / 主创 */
export interface CastMember {
  id: number
  name: string
  /** 角色名或职务（导演 / 编剧） */
  role: string
  /** 头像图片，可能为空（用首字母占位） */
  profileUrl?: string
  kind: "cast" | "crew"
}

/** 本地媒体文件信息（来自 Emby / Radarr） */
export interface MediaFileInfo {
  quality: string
  resolution: Resolution
  videoCodec: VideoCodec
  hdrFormat: HdrFormat
  audioFormat: string
  sizeBytes: number
  filePath: string
  runtimeMinutes: number
}

/** 可用下载资源（来自 Prowlarr / Radarr 搜索结果） */
export interface ReleaseResource {
  id: string
  /** 完整资源标题（原始种子名） */
  title: string
  resolution: Resolution
  source: ReleaseSource
  videoCodec: VideoCodec
  hdrFormat: HdrFormat
  audioFormat: string
  sizeBytes: number
  seeders: number
  leechers: number
  indexer: string
  /** Radarr Custom Format 评分 */
  customFormatScore: number
  /** 是否被 Radarr 拒绝 */
  rejected: boolean
  /** 拒绝原因（rejected 为 true 时提供） */
  rejectionReasons?: string[]
  /** 发布时间 ISO */
  publishedAt: string
}

/** Radarr 质量配置档 */
export interface QualityProfile {
  id: string
  name: string
  /** 目标画质说明 */
  cutoff: string
}

/** 电影完整详情（聚合 TMDB / Radarr / Emby / qBittorrent） */
export interface MovieDetail extends Movie {
  tagline?: string
  /** Emby 中是否已存在可播放文件 */
  inEmby: boolean
  /** 是否已加入 Radarr */
  inRadarr: boolean
  /** Radarr 是否监控 */
  monitored: boolean
  /** 本地文件信息，未入库时为 null */
  mediaFile: MediaFileInfo | null
  /** Radarr 根目录 */
  rootFolder: string
  /** 最后同步时间 ISO */
  lastSyncedAt: string
  cast: CastMember[]
  /** 若正在下载，关联的下载任务 id */
  activeDownloadId?: string
  /** 当前正在下载的进度 0-100 */
  downloadProgress?: number
}

/** 下载确认配置（提交到 Radarr / qBittorrent 前的确认信息） */
export interface DownloadConfirmConfig {
  movieTitle: string
  qualityProfile: string
  rootFolder: string
  searchNow: boolean
  estimatedMinBytes: number
  estimatedMaxBytes: number
}

/** 媒体库统计（来自 Emby） */
export interface LibrarySummary {
  totalMovies: number
  total4k: number
  totalHdr: number
  totalStorageBytes: number
  usedStorageBytes: number
}

/** 服务健康状态（系统设置页使用） */
export interface ServiceHealth {
  key: "tmdb" | "emby" | "radarr" | "prowlarr" | "qbittorrent"
  name: string
  online: boolean
  latencyMs: number
  detail: string
}

/** AI 助手对话消息 */
export interface AssistantMessage {
  id: string
  role: "user" | "assistant"
  content: string
  createdAt: string
}
