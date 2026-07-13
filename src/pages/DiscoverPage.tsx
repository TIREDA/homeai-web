import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Film, Search } from "lucide-react"
import { MovieCard } from "@/components/media/MovieCard"
import { EmptyState, ErrorState } from "@/components/common/StateViews"
import { Button } from "@/components/ui/button"
import { useDiscoverMovies, useMovieSearch } from "@/hooks/queries"

const categories = [{ value: "trending", label: "趋势" }, { value: "popular", label: "热门" }, { value: "top_rated", label: "高分" }, { value: "now_playing", label: "正在上映" }] as const

export function DiscoverPage() {
  const navigate = useNavigate()
  const [category, setCategory] = useState<"trending" | "popular" | "top_rated" | "now_playing">("trending")
  const [keyword, setKeyword] = useState("")
  const discover = useDiscoverMovies({ category, page: 1, pageSize: 20 })
  const search = useMovieSearch({ keyword, page: 1, pageSize: 20 })
  const result = keyword.trim() ? search : discover
  const movies = result.data?.items ?? []

  return <div className="space-y-6 pb-16">
    <div><h1 className="text-2xl font-bold tracking-tight">发现</h1><p className="mt-1 text-sm text-muted-foreground">浏览 TMDB 电影，或按片名搜索。</p></div>
    <div className="relative max-w-xl"><Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" /><input value={keyword} onChange={(event) => setKeyword(event.target.value)} type="search" placeholder="搜索电影…" className="h-10 w-full rounded-xl border border-white/8 bg-white/[0.04] pl-9 pr-3 text-sm outline-none focus:border-primary/40" /></div>
    {!keyword.trim() && <div className="flex flex-wrap gap-2">{categories.map((item) => <Button key={item.value} size="sm" variant={category === item.value ? "default" : "secondary"} onClick={() => setCategory(item.value)}>{item.label}</Button>)}</div>}
    {result.isLoading ? <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">{Array.from({ length: 10 }, (_, index) => <div key={index} className="aspect-[2/3] animate-pulse rounded-xl bg-white/5" />)}</div> : result.isError ? <ErrorState error={result.error} onRetry={() => result.refetch()} /> : movies.length === 0 ? <EmptyState icon={Film} title={keyword.trim() ? "没有匹配的电影" : "暂无电影"} description="调整搜索条件后重试。" /> : <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">{movies.map((movie) => <MovieCard key={movie.tmdbId} movie={movie} onSelect={(selected) => navigate(`/movies/${selected.tmdbId}`)} />)}</div>}
  </div>
}