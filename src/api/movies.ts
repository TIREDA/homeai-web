import type {
  ContinueWatching,
  MediaRow,
  Movie,
  MovieDetail,
  QualityProfile,
  ReleaseResource,
} from "@/types/media"
import { MOVIES, MOVIES_BY_ID } from "@/mocks/movies"
import { CONTINUE_WATCHING } from "@/mocks/continueWatching"
import { buildMovieDetail, buildReleases, QUALITY_PROFILES } from "@/mocks/movieDetails"
import { request } from "./client"

const pick = (...ids: number[]) =>
  ids.map((id) => MOVIES_BY_ID.get(id)).filter((m): m is Movie => Boolean(m))

function homeRows(): MediaRow[] {
  return [
    {
      id: "recommended",
      title: "为你推荐",
      subtitle: "基于家庭观影偏好",
      movies: pick(1, 7, 3, 5, 2, 8),
    },
    {
      id: "trending",
      title: "本周热门",
      movies: pick(2, 8, 6, 1, 4, 3),
    },
    {
      id: "recently-added",
      title: "最近入库",
      subtitle: "Emby 媒体库更新",
      movies: pick(5, 7, 1, 3),
    },
    {
      id: "upgrade-4k",
      title: "待补 4K / Dolby Vision",
      subtitle: "可升级到更高画质",
      movies: pick(2, 4, 5, 6),
    },
  ]
}

/** 首页内容行 */
export function fetchHomeRows(): Promise<MediaRow[]> {
  return request(homeRows, { path: "/home/rows" })
}

/** 精选轮播（首页 Hero） */
export function fetchFeatured(): Promise<Movie[]> {
  return request(() => pick(1, 2, 3), { path: "/home/featured", delay: 300 })
}

/** 继续观看 */
export function fetchContinueWatching(): Promise<ContinueWatching[]> {
  return request(() => CONTINUE_WATCHING, { path: "/home/continue-watching", delay: 400 })
}

/** 全部影片 */
export function fetchMovies(): Promise<Movie[]> {
  return request(() => MOVIES, { path: "/movies" })
}

/** 单部影片详情 */
export function fetchMovie(id: number): Promise<Movie | undefined> {
  return request(() => MOVIES_BY_ID.get(id), { path: `/movies/${id}` })
}

/** 按 TMDB ID 获取聚合详情 */
export function fetchMovieDetail(tmdbId: number): Promise<MovieDetail | undefined> {
  return request(() => buildMovieDetail(tmdbId), { path: `/movies/${tmdbId}`, delay: 450 })
}

/** 获取可用下载资源 */
export function fetchReleases(tmdbId: number): Promise<ReleaseResource[]> {
  return request(() => buildReleases(tmdbId), { path: `/movies/${tmdbId}/releases`, delay: 700 })
}

/** Radarr 质量配置档 */
export function fetchQualityProfiles(): Promise<QualityProfile[]> {
  return request(() => QUALITY_PROFILES, { path: "/settings/quality-profiles", delay: 200 })
}
