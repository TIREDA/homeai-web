import { useQuery } from "@tanstack/react-query"

import {
  fetchContinueWatching,
  fetchFeatured,
  fetchHomeRows,
  fetchMovies,
  fetchMovieDetail,
  fetchReleases,
  fetchQualityProfiles,
} from "@/api/movies"
import { fetchDownloads } from "@/api/downloads"
import { fetchLibrarySummary, fetchServiceHealth } from "@/api/system"

export const queryKeys = {
  homeRows: ["home", "rows"] as const,
  featured: ["home", "featured"] as const,
  continueWatching: ["home", "continue-watching"] as const,
  movies: ["movies"] as const,
  movieDetail: (tmdbId: number) => ["movies", "detail", tmdbId] as const,
  releases: (tmdbId: number) => ["movies", "releases", tmdbId] as const,
  qualityProfiles: ["settings", "quality-profiles"] as const,
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
  return useQuery({ queryKey: queryKeys.movies, queryFn: fetchMovies })
}

export function useMovieDetail(tmdbId: number) {
  return useQuery({
    queryKey: queryKeys.movieDetail(tmdbId),
    queryFn: () => fetchMovieDetail(tmdbId),
    enabled: Number.isFinite(tmdbId),
  })
}

export function useReleases(tmdbId: number, enabled: boolean) {
  return useQuery({
    queryKey: queryKeys.releases(tmdbId),
    queryFn: () => fetchReleases(tmdbId),
    enabled: enabled && Number.isFinite(tmdbId),
  })
}

export function useQualityProfiles() {
  return useQuery({ queryKey: queryKeys.qualityProfiles, queryFn: fetchQualityProfiles })
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
