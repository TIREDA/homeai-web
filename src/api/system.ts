import type { LibrarySummary, ServiceHealth } from "@/types/media"
import { LIBRARY_SUMMARY, SERVICES } from "@/mocks/system"
import { request } from "./client"

/** 媒体库统计 */
export function fetchLibrarySummary(): Promise<LibrarySummary> {
  return request(() => LIBRARY_SUMMARY, { path: "/library/summary", delay: 300 })
}

/** 各服务健康状态 */
export function fetchServiceHealth(): Promise<ServiceHealth[]> {
  return request(() => SERVICES, { path: "/system/health", delay: 300 })
}
