import { Routes, Route } from "react-router-dom"
import { Compass, Library } from "lucide-react"

import { AppLayout } from "@/components/layout/AppLayout"
import { HomePage } from "@/pages/HomePage"
import { MovieDetailPage } from "@/pages/MovieDetailPage"
import { DownloadsPage } from "@/pages/DownloadsPage"
import { AssistantPage } from "@/pages/AssistantPage"
import { SettingsPage } from "@/pages/SettingsPage"
import { PlaceholderPage } from "@/pages/PlaceholderPage"

export default function App() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<HomePage />} />
        <Route path="movies/:tmdbId" element={<MovieDetailPage />} />
        <Route
          path="discover"
          element={
            <PlaceholderPage
              icon={Compass}
              title="发现"
              description="浏览 TMDB 热门榜单与个性化推荐，一键将想看的影片加入 Radarr 监控队列。"
            />
          }
        />
        <Route
          path="library"
          element={
            <PlaceholderPage
              icon={Library}
              title="媒体库"
              description="Emby 中已入库的全部影片，按画质、类型、入库时间筛选与管理。"
            />
          }
        />
        <Route path="downloads" element={<DownloadsPage />} />
        <Route path="assistant" element={<AssistantPage />} />
        <Route path="settings" element={<SettingsPage />} />
        <Route
          path="*"
          element={
            <PlaceholderPage
              icon={Compass}
              title="页面未找到"
              description="你访问的页面不存在，请从左侧导航重新选择。"
            />
          }
        />
      </Route>
    </Routes>
  )
}
