/**
 * 统一的后端 API 契约类型。
 *
 * 约定后端（Spring Boot）统一返回 `ApiResponse<T>` 信封结构，
 * 分页接口的 `data` 为 `PageResult<T>`。前端通过 `http` 客户端
 * 自动拆包 `data` 字段，业务层只拿到真正的数据。
 */

/** 统一响应信封 */
export interface ApiResponse<T> {
  /** 业务状态码，0 或 200 表示成功 */
  code: number
  /** 提示信息 */
  message: string
  /** 业务数据 */
  data: T
  /** 服务端时间戳（毫秒） */
  timestamp?: number
}

/** 分页结果 */
export interface PageResult<T> {
  /** 当前页数据 */
  items: T[]
  /** 当前页码，从 1 开始 */
  page: number
  /** 每页条数 */
  pageSize: number
  /** 总条数 */
  total: number
  /** 总页数 */
  totalPages: number
}

/** 分页请求参数 */
export interface PageQuery {
  page?: number
  pageSize?: number
  keyword?: string
  sort?: string
}

/**
 * 统一 API 错误。
 * 由 `http` 客户端在请求失败（网络错误 / 非 2xx / 业务码非成功）时抛出，
 * 组件与 hooks 可据此展示错误态并支持重试。
 */
export class ApiError extends Error {
  /** HTTP 状态码，网络异常时为 0 */
  readonly status: number
  /** 后端业务码（若有） */
  readonly code?: number
  /** 原始错误对象（用于调试） */
  readonly cause?: unknown

  constructor(message: string, options: { status?: number; code?: number; cause?: unknown } = {}) {
    super(message)
    this.name = "ApiError"
    this.status = options.status ?? 0
    this.code = options.code
    this.cause = options.cause
  }

  /** 是否为网络层错误（无法连接 / 超时） */
  get isNetworkError(): boolean {
    return this.status === 0
  }
}
