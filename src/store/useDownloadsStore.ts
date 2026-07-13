import { create } from "zustand"

import type { DeleteTaskOptions, DownloadTaskDetail } from "@/types/media"
import { DOWNLOAD_TASKS_DETAIL } from "@/mocks/downloadTasks"

const MB = 1024 * 1024

interface DownloadsState {
  tasks: DownloadTaskDetail[]
  /** 是否已完成首次加载（用于骨架屏） */
  loaded: boolean
  /** 加载是否失败 */
  error: boolean
  /** 模拟异步加载 */
  load: () => void
  /** mock 定时器每秒推进 */
  tick: () => void
  pause: (id: string) => void
  resume: (id: string) => void
  retry: (id: string) => void
  remove: (id: string, options: DeleteTaskOptions) => void
}

/** 深拷贝一份种子数据，避免 mock 常量被直接修改 */
function seed(): DownloadTaskDetail[] {
  return DOWNLOAD_TASKS_DETAIL.map((t) => ({ ...t, timeline: t.timeline.map((e) => ({ ...e })) }))
}

function nowIso() {
  return new Date().toISOString()
}

export const useDownloadsStore = create<DownloadsState>((set, get) => ({
  tasks: [],
  loaded: false,
  error: false,

  load: () => {
    set({ loaded: false, error: false })
    // 模拟网络延迟
    setTimeout(() => {
      set({ tasks: seed(), loaded: true })
    }, 700)
  },

  tick: () => {
    set((state) => ({
      tasks: state.tasks.map((task) => {
        // 下载中：推进进度
        if (task.status === "downloading" && task.qbStatus === "downloading") {
          // 波动的下载速度 18~34 MB/s
          const speed = (18 + Math.random() * 16) * MB
          const upload = (1 + Math.random() * 4) * MB
          const nextDownloaded = Math.min(task.sizeBytes, task.downloadedBytes + speed)
          const progress = Math.min(100, (nextDownloaded / task.sizeBytes) * 100)
          const remaining = task.sizeBytes - nextDownloaded
          const eta = speed > 0 ? Math.round(remaining / speed) : null

          if (progress >= 100) {
            return {
              ...task,
              progress: 100,
              downloadedBytes: task.sizeBytes,
              downloadSpeed: 0,
              uploadSpeed: upload,
              etaSeconds: 0,
              status: "importing",
              qbStatus: "seeding",
              radarrImportStatus: "importing",
              timeline: [
                ...task.timeline,
                { key: "completed", label: "下载完成", timestamp: nowIso() },
                { key: "importing", label: "Radarr 正在导入", timestamp: nowIso() },
              ],
            }
          }

          return {
            ...task,
            progress: Math.round(progress * 10) / 10,
            downloadedBytes: nextDownloaded,
            downloadSpeed: speed,
            uploadSpeed: upload,
            etaSeconds: eta,
          }
        }

        // 等待导入：几秒后完成导入
        if (task.status === "importing") {
          if (Math.random() < 0.15) {
            return {
              ...task,
              status: "in_library",
              qbStatus: "completed",
              radarrImportStatus: "imported",
              timeline: [
                ...task.timeline,
                { key: "imported", label: "已导入 Emby 媒体库", timestamp: nowIso() },
              ],
            }
          }
          return task
        }

        // 正在搜索：几秒后转为下载中
        if (task.status === "searching") {
          if (Math.random() < 0.2) {
            const size = (40 + Math.random() * 30) * 1024 * MB
            return {
              ...task,
              status: "downloading",
              qbStatus: "downloading",
              sizeBytes: size,
              downloadedBytes: 0,
              progress: 0,
              downloadDir: `/downloads/incomplete/${task.title}`,
              releaseTitle: `${task.title}.2160p.WEB-DL.HDR.H.265-HomeAI`,
              timeline: [
                ...task.timeline,
                { key: "grabbed", label: "Radarr 抓取资源", timestamp: nowIso() },
                { key: "downloading", label: "qBittorrent 开始下载", timestamp: nowIso() },
              ],
            }
          }
          return task
        }

        // 队列等待：转为下载中
        if (task.status === "queued") {
          if (Math.random() < 0.18) {
            return {
              ...task,
              status: "downloading",
              qbStatus: "downloading",
              timeline: [
                ...task.timeline,
                { key: "downloading", label: "qBittorrent 开始下载", timestamp: nowIso() },
              ],
            }
          }
          return task
        }

        return task
      }),
    }))
  },

  pause: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "queued",
              qbStatus: "paused",
              downloadSpeed: 0,
              uploadSpeed: 0,
              etaSeconds: null,
              timeline: [...t.timeline, { key: "paused", label: "任务已暂停", timestamp: nowIso() }],
            }
          : t,
      ),
    })),

  resume: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "downloading",
              qbStatus: "downloading",
              timeline: [
                ...t.timeline,
                { key: "resumed", label: "任务已恢复", timestamp: nowIso() },
              ],
            }
          : t,
      ),
    })),

  retry: (id) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === id
          ? {
              ...t,
              status: "searching",
              qbStatus: "searching",
              errorMessage: undefined,
              progress: 0,
              downloadedBytes: 0,
              downloadSpeed: 0,
              uploadSpeed: 0,
              etaSeconds: null,
              seeders: 0,
              radarrImportStatus: "not_started",
              releaseTitle: "正在重新搜索片源…",
              timeline: [
                ...t.timeline,
                { key: "searching", label: "重新搜索片源", timestamp: nowIso() },
              ],
            }
          : t,
      ),
    })),

  remove: (id, _options) =>
    set((state) => ({
      tasks: state.tasks.filter((t) => t.id !== id),
    })),
}))
