import type { LibrarySummary, ServiceHealth } from "@/types/media"

const TB = 1024 * 1024 * 1024 * 1024

export const LIBRARY_SUMMARY: LibrarySummary = {
  totalMovies: 1284,
  total4k: 342,
  totalHdr: 268,
  totalStorageBytes: 40 * TB,
  usedStorageBytes: 27.6 * TB,
}

export const SERVICES: ServiceHealth[] = [
  { key: "tmdb", name: "TMDB", online: true, latencyMs: 132, detail: "元数据刮削正常" },
  { key: "emby", name: "Emby", online: true, latencyMs: 24, detail: "媒体库已同步" },
  { key: "radarr", name: "Radarr", online: true, latencyMs: 41, detail: "5 个监控任务" },
  { key: "prowlarr", name: "Prowlarr", online: true, latencyMs: 88, detail: "12 个索引器在线" },
  {
    key: "qbittorrent",
    name: "qBittorrent",
    online: false,
    latencyMs: 0,
    detail: "连接超时，请检查客户端",
  },
]
