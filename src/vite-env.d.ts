/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** 后端 API 根地址，例如 https://homeai.example.com/api */
  readonly VITE_API_BASE_URL?: string
  /**
   * 是否使用本地 mock 数据。
   * "true" 走内置 mock，"false" 走真实后端（Spring Boot）。
   * 未设置时默认为 mock 模式，便于本地开发与预览。
   */
  readonly VITE_USE_MOCK?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
