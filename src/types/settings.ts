import type { LucideIcon } from "lucide-react"

/** 设置项字段类型 */
export type FieldType = "text" | "secret" | "select" | "switch" | "number"

/** 单个设置字段的定义 */
export interface FieldDef {
  key: string
  label: string
  type: FieldType
  placeholder?: string
  /** select 类型的选项 */
  options?: { value: string; label: string }[]
  /** number 类型的范围与单位 */
  min?: number
  max?: number
  step?: number
  unit?: string
  /** 是否必填（保存前校验） */
  required?: boolean
  /** 字段说明 */
  hint?: string
  /** 是否为 URL（保存前做格式校验） */
  isUrl?: boolean
}

/** 设置分组的定义 */
export interface SectionDef {
  id: string
  name: string
  icon: LucideIcon
  description: string
  /** 是否提供“测试连接”按钮 */
  testable: boolean
  fields: FieldDef[]
}

/** 单个字段的值类型 */
export type FieldValue = string | number | boolean

/** 一个分组的值 */
export type SectionValues = Record<string, FieldValue>

/** 全部设置的值：sectionId -> 字段值 */
export type SettingsValues = Record<string, SectionValues>

/** 连通性测试结果 */
export interface ConnectionTestResult {
  status: "success" | "error"
  /** 耗时（毫秒） */
  latencyMs: number
  /** 成功时返回的服务版本 */
  version?: string
  /** 成功/失败信息 */
  message: string
  /** 测试完成的时间戳 */
  testedAt: number
}

/** 每个分组的字段级校验错误：fieldKey -> 错误信息 */
export type SectionErrors = Record<string, string>
