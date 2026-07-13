import type { ContinueWatching } from "@/types/media"
import { MOVIES_BY_ID } from "./movies"

function from(movieId: number, extra: Omit<ContinueWatching, "id" | "movieId" | "title" | "originalTitle" | "backdropUrl" | "releaseYear">): ContinueWatching {
  const movie = MOVIES_BY_ID.get(movieId)
  return {
    id: `cw-${movieId}`,
    movieId,
    title: movie?.title ?? "未知影片",
    originalTitle: movie?.originalTitle ?? "",
    backdropUrl: movie?.backdropUrl ?? "",
    releaseYear: movie?.releaseYear ?? 0,
    ...extra,
  }
}

/** 继续观看列表（对应 GET /api/home/continue-watching） */
export const CONTINUE_WATCHING: ContinueWatching[] = [
  from(1, { progress: 68, remainingMinutes: 47, watcher: "爸爸" }),
  from(3, { progress: 32, remainingMinutes: 112, watcher: "全家" }),
  from(7, { progress: 85, remainingMinutes: 16, watcher: "朵朵" }),
  from(5, { progress: 12, remainingMinutes: 86, watcher: "妈妈" }),
]
