import { MOVIES } from "@/mocks/movies"
import { CONTINUE_WATCHING } from "@/mocks/continueWatching"
import type { ContinueWatching, MediaRow } from "@/types/media"
import { buildMovieDetail } from "@/mocks/movieDetails"
import type { PageQuery, PageResult } from "@/types/api"
import type { CastMember, Genre, MediaStatus, Movie, MovieDetail, QualityTag } from "@/types/media"
import { http, mockRequest, request, USE_MOCK } from "./client"

interface BackendMovieSummary {
  tmdbId: number
  title: string
  originalTitle: string
  overview: string
  posterUrl: string
  backdropUrl: string
  releaseYear: number | null
  runtimeMinutes: number | null
  voteAverage: number
  genres: Genre[]
  status: string
  qualities: string[]
}

interface BackendMovieDetail extends BackendMovieSummary {
  tagline: string | null
  inEmby: boolean
  inRadarr: boolean
  monitored: boolean
  mediaFile: null
  rootFolder: string | null
  lastSyncedAt: string | null
  cast: Array<{ id: number; name: string; character: string | null; profileUrl: string | null; order: number }>
  activeDownloadId: string | null
  downloadProgress: number | null
}

export interface DiscoverMoviesQuery extends PageQuery {
  category?: "trending" | "popular" | "top_rated" | "now_playing"
  genreId?: number
  year?: number
  rating?: number
}

const statusByApiValue: Record<string, MediaStatus> = {
  NOT_COLLECTED: "not_collected",
  IN_RADARR: "in_radarr",
  SEARCHING: "searching",
  QUEUED: "queued",
  DOWNLOADING: "downloading",
  IMPORTING: "importing",
  IN_LIBRARY: "in_library",
  FAILED: "failed",
}

const qualityByApiValue: Record<string, QualityTag> = {
  "1080P": "1080p",
  "4K": "4k",
  HDR: "hdr",
  "DOLBY_VISION": "dolby_vision",
  "DOLBY VISION": "dolby_vision",
}

function toMovie(movie: BackendMovieSummary): Movie {
  return {
    // `id` 是旧页面的兼容字段，始终与公开的 tmdbId 相同。
    id: movie.tmdbId,
    tmdbId: movie.tmdbId,
    title: movie.title,
    originalTitle: movie.originalTitle,
    overview: movie.overview,
    posterUrl: movie.posterUrl,
    backdropUrl: movie.backdropUrl,
    releaseYear: movie.releaseYear ?? 0,
    runtimeMinutes: movie.runtimeMinutes ?? 0,
    voteAverage: movie.voteAverage,
    genres: movie.genres,
    status: statusByApiValue[movie.status] ?? "not_collected",
    qualities: movie.qualities.map((quality) => qualityByApiValue[quality]).filter((quality): quality is QualityTag => Boolean(quality)),
    favorited: false,
  }
}

function toMovieDetail(movie: BackendMovieDetail): MovieDetail {
  const cast: CastMember[] = movie.cast.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.character || "演员",
    profileUrl: member.profileUrl || undefined,
    kind: "cast",
  }))

  return {
    ...toMovie(movie),
    tagline: movie.tagline || undefined,
    inEmby: movie.inEmby,
    inRadarr: movie.inRadarr,
    monitored: movie.monitored,
    mediaFile: null,
    rootFolder: movie.rootFolder || "—",
    lastSyncedAt: movie.lastSyncedAt || new Date(0).toISOString(),
    cast,
    activeDownloadId: movie.activeDownloadId || undefined,
    downloadProgress: movie.downloadProgress ?? undefined,
  }
}

function mockPage(items: Movie[], query: PageQuery = {}): PageResult<Movie> {
  const page = query.page ?? 1
  const pageSize = query.pageSize ?? 20
  const keyword = query.keyword?.trim().toLocaleLowerCase() ?? ""
  const matched = keyword ? items.filter((movie) => `${movie.title} ${movie.originalTitle}`.toLocaleLowerCase().includes(keyword)) : items
  return { items: matched.slice((page - 1) * pageSize, page * pageSize), page, pageSize, total: matched.length, totalPages: Math.ceil(matched.length / pageSize) }
}

export function fetchMovieSearch(query: PageQuery = {}): Promise<PageResult<Movie>> {
  if (USE_MOCK) return mockRequest(mockPage(MOVIES, query))
  return http<PageResult<BackendMovieSummary>>({ path: "/movies", query }).then((page) => ({ ...page, items: page.items.map(toMovie) }))
}

export function fetchDiscoverMovies(query: DiscoverMoviesQuery = {}): Promise<PageResult<Movie>> {
  if (USE_MOCK) return mockRequest(mockPage(MOVIES, query))
  return http<PageResult<BackendMovieSummary>>({ path: "/discover/movies", query }).then((page) => ({ ...page, items: page.items.map(toMovie) }))
}

/** 兼容尚未纳入本任务的页面；真实模式仍通过分页 API 获取电影。 */
export function fetchMovies(): Promise<Movie[]> {
  return fetchMovieSearch().then((page) => page.items)
}

export function fetchMovieDetail(tmdbId: number): Promise<MovieDetail | undefined> {
  if (USE_MOCK) return mockRequest(buildMovieDetail(tmdbId), 450)
  return http<BackendMovieDetail>({ path: `/movies/${tmdbId}` }).then(toMovieDetail)
}

/** 首页电影行复用 Task003 发现接口，不依赖 Dashboard 聚合。 */
export async function fetchHomeRows(): Promise<MediaRow[]> {
  const [popular, topRated] = await Promise.all([
    fetchDiscoverMovies({ category: "popular", page: 1, pageSize: 20 }),
    fetchDiscoverMovies({ category: "top_rated", page: 1, pageSize: 20 }),
  ])

  return [
    { id: "popular", title: "热门电影", subtitle: "来自 TMDB", movies: popular.items },
    { id: "top-rated", title: "高分电影", subtitle: "来自 TMDB", movies: topRated.items },
  ]
}

export function fetchFeatured(): Promise<Movie[]> {
  return fetchDiscoverMovies({ category: "trending", page: 1, pageSize: 20 })
    .then((page) => page.items)
}

export function fetchContinueWatching(): Promise<ContinueWatching[]> {
  return request(() => CONTINUE_WATCHING, { path: "/media/continue-watching", delay: 400 })
}