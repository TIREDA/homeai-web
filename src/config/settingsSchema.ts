import { Clapperboard, Film, PlayCircle, Download, Sparkles, SlidersHorizontal } from "lucide-react"

import type { SectionDef } from "@/types/settings"

/**
 * 系统设置的 schema 定义。
 * 页面完全由此配置驱动渲染，新增字段只需在此追加。
 */
export const SETTINGS_SECTIONS: SectionDef[] = [
  {
    id: "tmdb",
    name: "TMDB",
    icon: Clapperboard,
    description: "电影元数据与海报来源，用于搜索、匹配影片信息。",
    testable: true,
    fields: [
      {
        key: "baseUrl",
        label: "Base URL",
        type: "text",
        placeholder: "https://api.themoviedb.org/3",
        required: true,
        isUrl: true,
      },
      { key: "apiToken", label: "API Token", type: "secret", required: true },
      {
        key: "language",
        label: "默认语言",
        type: "select",
        options: [
          { value: "zh-CN", label: "简体中文" },
          { value: "zh-TW", label: "繁体中文" },
          { value: "en-US", label: "English (US)" },
          { value: "ja-JP", label: "日本語" },
        ],
      },
      {
        key: "imageSize",
        label: "图片尺寸",
        type: "select",
        options: [
          { value: "w500", label: "w500（标准）" },
          { value: "w780", label: "w780（高清）" },
          { value: "original", label: "original（原图）" },
        ],
        hint: "海报与背景图的下载分辨率。",
      },
    ],
  },
  {
    id: "radarr",
    name: "Radarr",
    icon: Film,
    description: "电影自动化管理：监控、搜索片源并推送到下载器。",
    testable: true,
    fields: [
      {
        key: "baseUrl",
        label: "Base URL",
        type: "text",
        placeholder: "http://radarr.local:7878",
        required: true,
        isUrl: true,
      },
      { key: "apiKey", label: "API Key", type: "secret", required: true },
      {
        key: "rootFolder",
        label: "根目录",
        type: "text",
        placeholder: "/media/movies",
        required: true,
        hint: "Radarr 存放影片的根目录路径。",
      },
      {
        key: "qualityProfile",
        label: "默认质量配置",
        type: "select",
        options: [
          { value: "any", label: "Any" },
          { value: "hd-1080p", label: "HD-1080p" },
          { value: "ultra-hd", label: "Ultra-HD (4K)" },
          { value: "remux-2160p", label: "Remux-2160p" },
        ],
      },
      {
        key: "searchOnAdd",
        label: "添加后立即搜索",
        type: "switch",
        hint: "加入监控后自动搜索并下载最佳片源。",
      },
    ],
  },
  {
    id: "emby",
    name: "Emby",
    icon: PlayCircle,
    description: "媒体库与播放服务，展示已入库影片并提供在线播放。",
    testable: true,
    fields: [
      {
        key: "baseUrl",
        label: "Base URL",
        type: "text",
        placeholder: "http://emby.local:8096",
        required: true,
        isUrl: true,
      },
      { key: "apiKey", label: "API Key", type: "secret", required: true },
      {
        key: "userId",
        label: "User ID",
        type: "text",
        placeholder: "a1b2c3d4e5f6",
        required: true,
        hint: "用于读取播放进度与继续观看列表的用户标识。",
      },
      {
        key: "defaultLibrary",
        label: "默认媒体库",
        type: "select",
        options: [
          { value: "movies", label: "电影" },
          { value: "movies-4k", label: "4K 电影" },
          { value: "family", label: "家庭影院" },
        ],
      },
    ],
  },
  {
    id: "qbittorrent",
    name: "qBittorrent",
    icon: Download,
    description: "BT 下载客户端，接收 Radarr 推送的下载任务。",
    testable: true,
    fields: [
      {
        key: "baseUrl",
        label: "Base URL",
        type: "text",
        placeholder: "http://qbittorrent.local:8080",
        required: true,
        isUrl: true,
      },
      { key: "username", label: "用户名", type: "text", placeholder: "admin", required: true },
      { key: "password", label: "密码", type: "secret", required: true },
      {
        key: "category",
        label: "分类名称",
        type: "text",
        placeholder: "radarr-movies",
        hint: "下载任务归属的分类，便于分目录管理。",
      },
    ],
  },
  {
    id: "ai",
    name: "AI 模型",
    icon: Sparkles,
    description: "驱动 AI 影音助手的大语言模型服务。",
    testable: true,
    fields: [
      {
        key: "provider",
        label: "Provider",
        type: "select",
        options: [
          { value: "openai", label: "OpenAI" },
          { value: "anthropic", label: "Anthropic" },
          { value: "deepseek", label: "DeepSeek" },
          { value: "openai-compatible", label: "OpenAI 兼容" },
        ],
      },
      {
        key: "baseUrl",
        label: "Base URL",
        type: "text",
        placeholder: "https://api.openai.com/v1",
        required: true,
        isUrl: true,
      },
      { key: "apiKey", label: "API Key", type: "secret", required: true },
      {
        key: "model",
        label: "Model",
        type: "text",
        placeholder: "gpt-4o-mini",
        required: true,
      },
      {
        key: "temperature",
        label: "Temperature",
        type: "number",
        min: 0,
        max: 2,
        step: 0.1,
        hint: "越高越有创造性，越低越稳定。",
      },
      {
        key: "maxTokens",
        label: "Max Tokens",
        type: "number",
        min: 256,
        max: 32768,
        step: 256,
        unit: "tokens",
      },
    ],
  },
  {
    id: "homeai",
    name: "HomeAI 设置",
    icon: SlidersHorizontal,
    description: "应用级偏好，影响下载、推荐与界面行为。",
    testable: false,
    fields: [
      {
        key: "defaultQuality",
        label: "默认下载质量",
        type: "select",
        options: [
          { value: "1080p", label: "1080P" },
          { value: "4k", label: "4K" },
          { value: "4k-hdr", label: "4K HDR" },
        ],
      },
      {
        key: "homeGenre",
        label: "首页推荐类型",
        type: "select",
        options: [
          { value: "mixed", label: "综合推荐" },
          { value: "action", label: "动作" },
          { value: "scifi", label: "科幻" },
          { value: "animation", label: "动画" },
          { value: "family", label: "家庭" },
        ],
      },
      {
        key: "pollInterval",
        label: "下载轮询间隔",
        type: "number",
        min: 1,
        max: 60,
        step: 1,
        unit: "秒",
        hint: "下载中心刷新任务进度的频率。",
      },
      {
        key: "movieCacheTtl",
        label: "电影缓存时间",
        type: "number",
        min: 1,
        max: 168,
        step: 1,
        unit: "小时",
        hint: "TMDB 元数据的本地缓存有效期。",
      },
      {
        key: "confirmActions",
        label: "启用操作确认",
        type: "switch",
        hint: "执行下载、删除等操作前弹出二次确认。",
      },
      {
        key: "timezone",
        label: "时区",
        type: "select",
        options: [
          { value: "Asia/Shanghai", label: "Asia/Shanghai (UTC+8)" },
          { value: "Asia/Tokyo", label: "Asia/Tokyo (UTC+9)" },
          { value: "America/Los_Angeles", label: "America/Los_Angeles (UTC-8)" },
          { value: "Europe/London", label: "Europe/London (UTC+0)" },
        ],
      },
    ],
  },
]

/** 判断字段是否为密钥字段（保存/展示时特殊处理） */
export function isSecretField(sectionId: string, key: string): boolean {
  const section = SETTINGS_SECTIONS.find((s) => s.id === sectionId)
  return section?.fields.find((f) => f.key === key)?.type === "secret"
}
