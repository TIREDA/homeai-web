import type { ConnectionTestResult, SectionValues } from "@/types/settings"
import { USE_MOCK, http } from "./client"

/** 各服务测试成功时返回的 mock 版本号 */
const MOCK_VERSIONS: Record<string, string> = {
  tmdb: "API v3",
  radarr: "5.4.6.8723",
  emby: "4.8.10.0",
  qbittorrent: "4.6.5",
  ai: "gpt-4o-mini-2024",
}

function mockTest(sectionId: string, values: SectionValues): Promise<ConnectionTestResult> {
  const latencyMs = Math.round(120 + Math.random() * 480)

  return new Promise((resolve) => {
    setTimeout(() => {
      const baseUrl = String(values.baseUrl ?? "")
      const missingUrl = !baseUrl.trim()
      // 缺少 Base URL，或 20% 概率模拟网络失败
      const failed = missingUrl || Math.random() < 0.2

      if (failed) {
        resolve({
          status: "error",
          latencyMs,
          message: missingUrl
            ? "未配置 Base URL，无法建立连接"
            : "连接超时：无法访问服务，请检查地址与密钥",
          testedAt: Date.now(),
        })
      } else {
        resolve({
          status: "success",
          latencyMs,
          version: MOCK_VERSIONS[sectionId] ?? "unknown",
          message: "连接成功",
          testedAt: Date.now(),
        })
      }
    }, latencyMs)
  })
}

/**
 * 连通性测试（对应 POST /api/settings/:section/test）。
 * mock 模式下依据字段返回成功/失败；真实模式下调用后端。
 */
export function testConnection(
  sectionId: string,
  values: SectionValues,
): Promise<ConnectionTestResult> {
  if (USE_MOCK) {
    return mockTest(sectionId, values)
  }
  return http<ConnectionTestResult>({
    path: `/settings/${sectionId}/test`,
    method: "POST",
    body: values,
  })
}
