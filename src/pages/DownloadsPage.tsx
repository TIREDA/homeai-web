import { useEffect, useMemo, useState } from "react"
import { Download, Inbox } from "lucide-react"

import type { DeleteTaskOptions, DownloadTaskDetail } from "@/types/media"
import { useDownloadsStore } from "@/store/useDownloadsStore"
import { Skeleton } from "@/components/ui/skeleton"
import { EmptyState, ErrorState } from "@/components/common/StateViews"
import {
  DownloadFilterTabs,
  DOWNLOAD_FILTERS,
  type DownloadFilter,
} from "@/components/downloads/DownloadFilterTabs"
import {
  DownloadToolbar,
  type QualityFilter,
  type SortOrder,
  type ViewMode,
} from "@/components/downloads/DownloadToolbar"
import { DownloadRow } from "@/components/downloads/DownloadRow"
import { DeleteTaskDialog } from "@/components/downloads/DeleteTaskDialog"
import { TaskDetailDrawer } from "@/components/downloads/TaskDetailDrawer"

export function DownloadsPage() {
  const { tasks, loaded, error, load, tick, pause, resume, retry, remove } = useDownloadsStore()

  const [filter, setFilter] = useState<DownloadFilter>("all")
  const [search, setSearch] = useState("")
  const [quality, setQuality] = useState<QualityFilter>("all")
  const [sort, setSort] = useState<SortOrder>("newest")
  const [view, setView] = useState<ViewMode>("list")

  const [detailTask, setDetailTask] = useState<DownloadTaskDetail | null>(null)
  const [deleteTask, setDeleteTask] = useState<DownloadTaskDetail | null>(null)

  // 首次加载
  useEffect(() => {
    load()
  }, [load])

  // mock 进度定时器
  useEffect(() => {
    if (!loaded) return
    const timer = setInterval(tick, 1000)
    return () => clearInterval(timer)
  }, [loaded, tick])

  // 各筛选项计数
  const counts = useMemo(() => {
    const base = { all: tasks.length } as Record<DownloadFilter, number>
    for (const f of DOWNLOAD_FILTERS) {
      if (f.key === "all") continue
      base[f.key] = tasks.filter((t) => t.status === f.key).length
    }
    return base
  }, [tasks])

  // 应用筛选 / 搜索 / 排序
  const visibleTasks = useMemo(() => {
    let list = tasks
    if (filter !== "all") list = list.filter((t) => t.status === filter)
    if (quality !== "all") list = list.filter((t) => t.quality === quality)
    const q = search.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (t) =>
          t.title.toLowerCase().includes(q) || t.releaseTitle.toLowerCase().includes(q),
      )
    }
    const sorted = [...list]
    sorted.sort((a, b) => {
      if (sort === "progress") return b.progress - a.progress
      const ta = new Date(a.createdAt).getTime()
      const tb = new Date(b.createdAt).getTime()
      return sort === "newest" ? tb - ta : ta - tb
    })
    return sorted
  }, [tasks, filter, quality, search, sort])

  // 保持详情抽屉数据随定时器实时更新
  const liveDetail = detailTask
    ? tasks.find((t) => t.id === detailTask.id) ?? null
    : null

  const handleDelete = (task: DownloadTaskDetail, options: DeleteTaskOptions) => {
    remove(task.id, options)
    setDeleteTask(null)
    if (detailTask?.id === task.id) setDetailTask(null)
  }

  return (
    <div className="mx-auto max-w-6xl space-y-5 px-4 py-6 sm:px-6 lg:py-8">
      {/* 标题 */}
      <header className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-primary/12 text-primary">
          <Download className="size-5" />
        </span>
        <div>
          <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">下载中心</h1>
          <p className="text-sm text-muted-foreground">
            实时监控 qBittorrent 下载与 Radarr 导入状态
          </p>
        </div>
      </header>

      {/* 筛选 + 工具栏 */}
      <div className="space-y-3">
        <DownloadFilterTabs active={filter} counts={counts} onChange={setFilter} />
        <DownloadToolbar
          search={search}
          onSearchChange={setSearch}
          quality={quality}
          onQualityChange={setQuality}
          sort={sort}
          onSortChange={setSort}
          view={view}
          onViewChange={setView}
        />
      </div>

      {/* 内容区 */}
      {error ? (
        <ErrorState onRetry={load} />
      ) : !loaded ? (
        <DownloadsSkeleton />
      ) : visibleTasks.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={tasks.length === 0 ? "暂无下载任务" : "没有符合条件的任务"}
          description={
            tasks.length === 0
              ? "在电影详情页提交 4K 下载后，任务会实时显示在这里。"
              : "试试调整筛选条件或搜索关键词。"
          }
        />
      ) : (
        <div className={view === "compact" ? "space-y-2" : "space-y-3"}>
          {visibleTasks.map((task) => (
            <DownloadRow
              key={task.id}
              task={task}
              compact={view === "compact"}
              onPause={(t) => pause(t.id)}
              onResume={(t) => resume(t.id)}
              onRetry={(t) => retry(t.id)}
              onDelete={setDeleteTask}
              onDetail={setDetailTask}
            />
          ))}
        </div>
      )}

      {/* 弹层 */}
      <TaskDetailDrawer
        task={liveDetail}
        open={!!liveDetail}
        onClose={() => setDetailTask(null)}
      />
      <DeleteTaskDialog
        task={deleteTask}
        open={!!deleteTask}
        onClose={() => setDeleteTask(null)}
        onConfirm={handleDelete}
      />
    </div>
  )
}

function DownloadsSkeleton() {
  return (
    <div className="space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="flex gap-4 rounded-2xl border border-white/8 bg-surface/60 p-4">
          <Skeleton className="h-32 w-[86px] rounded-lg" />
          <div className="flex-1 space-y-3 py-1">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-3 w-2/3" />
            <div className="flex gap-2">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-1.5 w-full rounded-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  )
}
