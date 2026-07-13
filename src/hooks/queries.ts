import { useQuery } from "@tanstack/react-query"

import { fetchContinueWatching, fetchDiscoverMovies, fetchFeatured, fetchHomeRows, fetchMovieSearch, fetchMovies, fetchMovieDetail } from "@/api/movies"
import type { DiscoverMoviesQuery } from "@/api/movies"
import type { PageQuery } from "@/types/api"
import { fetchDownloads } from "@/api/downloads"
import { fetchLibrarySummary, fetchServiceHealth } from "@/api/system"

export const queryKeys = {
  homeRows: ["home", "rows"] as const,
  featured: ["home", "featured"] as const,
  continueWatching: ["home", "continue-watching"] as const,
  movies: (query: PageQuery = {}) => ["movies", query] as const,
  discoverMovies: (query: DiscoverMoviesQuery = {}) => ["discover", "movies", query] as const,
  movieDetail: (tmdbId: number) => ["movies", "detail", tmdbId] as const,
  downloads: ["downloads"] as const,
  librarySummary: ["library", "summary"] as const,
  serviceHealth: ["system", "health"] as const,
}


export function useHomeRows() {
  return useQuery({ queryKey: queryKeys.homeRows, queryFn: fetchHomeRows })
}

export function useFeatured() {
  return useQuery({ queryKey: queryKeys.featured, queryFn: fetchFeatured })
}

export function useContinueWatching() {
  return useQuery({ queryKey: queryKeys.continueWatching, queryFn: fetchContinueWatching })
}
export function useMovies() {
  return useQuery({ queryKey: queryKeys.movies(), queryFn: fetchMovies })
}

export function useMovieSearch(query: PageQuery) {
  return useQuery({
    queryKey: queryKeys.movies(query),
    queryFn: () => fetchMovieSearch(query),
    enabled: Boolean(query.keyword?.trim()),
  })
}

export function useDiscoverMovies(query: DiscoverMoviesQuery) {
  return useQuery({ queryKey: queryKeys.discoverMovies(query), queryFn: () => fetchDiscoverMovies(query) })
}

export function useMovieDetail(tmdbId: number) {
  return useQuery({
    queryKey: queryKeys.movieDetail(tmdbId),
    queryFn: () => fetchMovieDetail(tmdbId),
    enabled: Number.isSafeInteger(tmdbId) && tmdbId > 0,
  })
}

export function useDownloads() {
  return useQuery({ queryKey: queryKeys.downloads, queryFn: fetchDownloads })
}

export function useLibrarySummary() {
  return useQuery({ queryKey: queryKeys.librarySummary, queryFn: fetchLibrarySummary })
}

export function useServiceHealth() {
  return useQuery({ queryKey: queryKeys.serviceHealth, queryFn: fetchServiceHealth })
}
