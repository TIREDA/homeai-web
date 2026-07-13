/**
 * 统一 API 客户端。
 *
 * 通过环境变量 `VITE_USE_MOCK` 在两种模式间切换：
 *   - mock 模式（仅在 `VITE_USE_MOCK=true` 时）：数据来自本地 mock，用 `mockRequest` 模拟网络延迟；
 *   - 真实模式：调用 `VITE_API_BASE_URL` 指向的 Spring Boot 后端。
 *
 * 各 api 模块统一用 `request(mockFactory, { path })` 封装：
 * mock 模式下执行 `mockFactory()`，真实模式下走 `http<T>(path)`，
 * 因此接入后端时业务层（hooks / 组件）无需改动。
 */
import { ApiError } from "@/types/api"
import type { ApiResponse } from "@/types/api"

/** 后端 API 根地址（真实模式使用） */
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "/api/v1"

/** 是否使用本地 mock 数据；默认真实 API。 */
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === "true"

/** 真实请求的可选配置 */
export interface RequestConfig {
  /** 真实后端路径，例如 "/movies"（会拼接到 API_BASE_URL 后） */
  path: string
  /** HTTP 方法，默认 GET */
  method?: string
  /** 请求体（对象会自动序列化为 JSON） */
  body?: unknown
  /** 查询参数 */
  query?: object
  /** mock 模式下的模拟延迟（毫秒） */
  delay?: number
}

/**
 * 统一请求入口。
 * @param mockFactory mock 模式下返回数据的工厂函数
 * @param config      真实模式下的请求配置
 */
export function request<T>(mockFactory: () => T, config: RequestConfig): Promise<T> {
  if (USE_MOCK) {
    return mockRequest(mockFactory(), config.delay)
  }
  return http<T>(config)
}

/** 模拟一次成功的后端请求（带延迟，便于观察 loading 态） */
export function mockRequest<T>(data: T, delay = 400): Promise<T> {
  return new Promise((resolve) => {
    setTimeout(() => resolve(structuredCloneSafe(data)), delay)
  })
}

function structuredCloneSafe<T>(data: T): T {
  if (typeof structuredClone === "function") return structuredClone(data)
  return JSON.parse(JSON.stringify(data)) as T
}

function buildUrl(path: string, query?: RequestConfig["query"]): string {
  const url = `${API_BASE_URL}${path}`
  if (!query) return url
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query)) {
    if (value !== undefined) params.set(key, String(value))
  }
  const qs = params.toString()
  return qs ? `${url}?${qs}` : url
}

/**
 * 真实 REST 请求封装（接入 Spring Boot 时启用）。
 * 自动拆包 `ApiResponse<T>` 信封，失败时抛出 `ApiError`。
 */
export async function http<T>(config: RequestConfig): Promise<T> {
  const { path, method = "GET", body, query } = config

  let res: Response
  try {
    res = await fetch(buildUrl(path, query), {
      method,
      headers: { "Content-Type": "application/json" },
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch (err) {
    throw new ApiError("网络错误：无法连接到服务器", { status: 0, cause: err })
  }

  let payload: ApiResponse<T>
  try {
    payload = (await res.json()) as ApiResponse<T>
  } catch {
    throw new ApiError(`请求失败：${res.status} ${res.statusText}`, { status: res.status })
  }

  const isSuccess = res.ok && payload.code === 0
  if (!isSuccess) {
    throw new ApiError(payload.message || `请求失败：${res.status} ${res.statusText}`, {
      status: res.status,
      code: payload.code,
      requestId: payload.requestId,
    })
  }
  return payload.data
}
