import type { SettingsValues } from "@/types/settings"

/**
 * 设置页的 mock 默认值（仅用于演示 / mock 模式）。
 *
 * 说明：
 * - 这里的地址与凭据都是占位演示数据，不是真实环境配置；
 * - 密钥字段一律只存掩码，绝不出现真实密钥；
 * - 接入真实后端后，这些值应改由 `GET /api/settings` 返回。
 */
export const SETTINGS_DEFAULTS: SettingsValues = {
  tmdb: {
    baseUrl: "https://api.themoviedb.org/3",
    apiToken: "••••••••••••••••••••4f9c",
    language: "zh-CN",
    imageSize: "w780",
  },
  radarr: {
    baseUrl: "http://radarr.local:7878",
    apiKey: "••••••••••••••••8a2d",
    rootFolder: "/media/movies",
    qualityProfile: "ultra-hd",
    searchOnAdd: true,
  },
  emby: {
    baseUrl: "http://emby.local:8096",
    apiKey: "••••••••••••••••1c7b",
    userId: "a1b2c3d4e5f6",
    defaultLibrary: "movies-4k",
  },
  qbittorrent: {
    baseUrl: "http://qbittorrent.local:8080",
    username: "admin",
    password: "••••••••••",
    category: "radarr-movies",
  },
  ai: {
    provider: "openai",
    baseUrl: "https://api.openai.com/v1",
    apiKey: "••••••••••••••••••••sk-9f",
    model: "gpt-4o-mini",
    temperature: 0.7,
    maxTokens: 4096,
  },
  homeai: {
    defaultQuality: "4k-hdr",
    homeGenre: "mixed",
    pollInterval: 3,
    movieCacheTtl: 24,
    confirmActions: true,
    timezone: "Asia/Shanghai",
  },
}
