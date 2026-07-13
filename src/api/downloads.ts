import type { DownloadTask } from "@/types/media"
import { DOWNLOAD_TASKS } from "@/mocks/downloads"
import { request } from "./client"

/** 下载任务列表 */
export function fetchDownloads(): Promise<DownloadTask[]> {
  return request(() => DOWNLOAD_TASKS, { path: "/downloads" })
}

/** 提交 4K 下载请求 */
export function requestDownload(movieId: number): Promise<{ ok: boolean }> {
  return request(() => ({ ok: true }), {
    path: "/downloads",
    method: "POST",
    body: { movieId },
    delay: 500,
  })
}
