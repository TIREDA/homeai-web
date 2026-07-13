import type { DownloadTask } from "@/types/media"
import { MOVIES_BY_ID } from "./movies"

const GB = 1024 * 1024 * 1024
const MB = 1024 * 1024

function poster(id: number) {
  return MOVIES_BY_ID.get(id)?.posterUrl ?? ""
}

export const DOWNLOAD_TASKS: DownloadTask[] = [
  {
    id: "qb-1001",
    movieId: 2,
    title: "霓虹雨夜",
    posterUrl: poster(2),
    quality: "4k",
    progress: 61,
    downloadSpeed: 28.4 * MB,
    etaSeconds: 640,
    sizeBytes: 58 * GB,
    downloadedBytes: 35 * GB,
    seeders: 42,
    leechers: 6,
    status: "downloading",
  },
  {
    id: "qb-1002",
    movieId: 3,
    title: "群山之王（4K 补片）",
    posterUrl: poster(3),
    quality: "dolby_vision",
    progress: 14,
    downloadSpeed: 12.1 * MB,
    etaSeconds: 2360,
    sizeBytes: 74 * GB,
    downloadedBytes: 10 * GB,
    seeders: 18,
    leechers: 3,
    status: "downloading",
  },
  {
    id: "qb-1003",
    movieId: 8,
    title: "极速海岸",
    posterUrl: poster(8),
    quality: "4k",
    progress: 100,
    downloadSpeed: 0,
    etaSeconds: 0,
    sizeBytes: 49 * GB,
    downloadedBytes: 49 * GB,
    seeders: 65,
    leechers: 1,
    status: "importing",
  },
  {
    id: "qb-1004",
    movieId: 6,
    title: "长廊尽头",
    posterUrl: poster(6),
    quality: "4k",
    progress: 0,
    downloadSpeed: 0,
    etaSeconds: null,
    sizeBytes: 51 * GB,
    downloadedBytes: 0,
    seeders: 0,
    leechers: 0,
    status: "queued",
  },
  {
    id: "qb-1005",
    movieId: 5,
    title: "深蓝之息（4K HDR）",
    posterUrl: poster(5),
    quality: "hdr",
    progress: 88,
    downloadSpeed: 0,
    etaSeconds: null,
    sizeBytes: 43 * GB,
    downloadedBytes: 38 * GB,
    seeders: 0,
    leechers: 0,
    status: "failed",
  },
]
