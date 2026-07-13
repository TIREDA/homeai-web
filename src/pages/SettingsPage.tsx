import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { CheckCircle2, Save, RotateCcw, AlertTriangle } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Dialog } from "@/components/ui/dialog"
import { SettingSection } from "@/components/settings/SettingSection"
import { SETTINGS_SECTIONS } from "@/config/settingsSchema"
import { SETTINGS_DEFAULTS } from "@/mocks/settings"
import { testConnection } from "@/api/settings"
import type {
  ConnectionTestResult,
  FieldValue,
  SectionErrors,
  SettingsValues,
} from "@/types/settings"

/** 深拷贝设置值，避免可变引用 */
function clone(values: SettingsValues): SettingsValues {
  return JSON.parse(JSON.stringify(values))
}

/** 校验单个分组，返回字段级错误 */
function validateSection(sectionId: string, values: SettingsValues): SectionErrors {
  const section = SETTINGS_SECTIONS.find((s) => s.id === sectionId)
  if (!section) return {}
  const errors: SectionErrors = {}
  const sectionValues = values[sectionId] ?? {}

  for (const field of section.fields) {
    const raw = sectionValues[field.key]
    const str = typeof raw === "string" ? raw.trim() : raw

    if (field.required && (str === "" || str === undefined || str === null)) {
      errors[field.key] = `${field.label} 不能为空`
      continue
    }
    if (field.isUrl && typeof str === "string" && str !== "") {
      if (!/^https?:\/\/.+/i.test(str)) {
        errors[field.key] = "请输入以 http:// 或 https:// 开头的有效地址"
      }
    }
    if (field.type === "number" && (raw === "" || raw === undefined)) {
      errors[field.key] = `${field.label} 不能为空`
    }
    if (field.type === "number" && typeof raw === "number") {
      if (field.min !== undefined && raw < field.min) {
        errors[field.key] = `不能小于 ${field.min}`
      } else if (field.max !== undefined && raw > field.max) {
        errors[field.key] = `不能大于 ${field.max}`
      }
    }
  }
  return errors
}

let toastSeq = 0

export function SettingsPage() {
  const [values, setValues] = useState<SettingsValues>(() => clone(SETTINGS_DEFAULTS))
  const [saved, setSaved] = useState<SettingsValues>(() => clone(SETTINGS_DEFAULTS))
  const [errors, setErrors] = useState<Record<string, SectionErrors>>({})
  const [testing, setTesting] = useState<Record<string, boolean>>({})
  const [results, setResults] = useState<Record<string, ConnectionTestResult>>({})
  const [activeSection, setActiveSection] = useState(SETTINGS_SECTIONS[0].id)
  const [toasts, setToasts] = useState<{ id: number; text: string; kind: "ok" | "err" }[]>([])
  const [leaveGuard, setLeaveGuard] = useState<null | (() => void)>(null)

  const scrollRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const dirty = useMemo(
    () => JSON.stringify(values) !== JSON.stringify(saved),
    [values, saved],
  )
  const dirtyRef = useRef(dirty)
  dirtyRef.current = dirty

  // 拦截应用内导航（侧边栏 / 顶栏链接），未保存时弹确认
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!dirtyRef.current) return
      const anchor = (e.target as HTMLElement).closest("a[href]") as HTMLAnchorElement | null
      if (!anchor) return
      const href = anchor.getAttribute("href")
      if (!href || !href.startsWith("/") || href.startsWith("/settings")) return
      e.preventDefault()
      e.stopPropagation()
      setLeaveGuard(() => () => navigate(href))
    }
    document.addEventListener("click", onClick, true)
    return () => document.removeEventListener("click", onClick, true)
  }, [navigate])

  const pushToast = useCallback((text: string, kind: "ok" | "err" = "ok") => {
    const id = toastSeq++
    setToasts((t) => [...t, { id, text, kind }])
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 2800)
  }, [])

  // 未保存修改时，浏览器级离开提醒
  useEffect(() => {
    if (!dirty) return
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault()
      e.returnValue = ""
    }
    window.addEventListener("beforeunload", handler)
    return () => window.removeEventListener("beforeunload", handler)
  }, [dirty])

  const handleChange = useCallback((sectionId: string, key: string, value: FieldValue) => {
    setValues((prev) => ({
      ...prev,
      [sectionId]: { ...prev[sectionId], [key]: value },
    }))
    // 编辑时清除该字段的错误
    setErrors((prev) => {
      if (!prev[sectionId]?.[key]) return prev
      const next = { ...prev[sectionId] }
      delete next[key]
      return { ...prev, [sectionId]: next }
    })
  }, [])

  const handleTest = useCallback(
    async (sectionId: string) => {
      setTesting((t) => ({ ...t, [sectionId]: true }))
      const result = await testConnection(sectionId, values[sectionId] ?? {})
      setResults((r) => ({ ...r, [sectionId]: result }))
      setTesting((t) => ({ ...t, [sectionId]: false }))
    },
    [values],
  )

  const runSave = useCallback(() => {
    // 保存前校验全部分组
    const allErrors: Record<string, SectionErrors> = {}
    let firstErrorSection: string | null = null
    for (const section of SETTINGS_SECTIONS) {
      const sectionErrors = validateSection(section.id, values)
      if (Object.keys(sectionErrors).length > 0) {
        allErrors[section.id] = sectionErrors
        if (!firstErrorSection) firstErrorSection = section.id
      }
    }
    setErrors(allErrors)

    if (firstErrorSection) {
      pushToast("请修正标红的字段后再保存", "err")
      document
        .getElementById(`section-${firstErrorSection}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
      return false
    }

    setSaved(clone(values))
    pushToast("设置已保存")
    return true
  }, [values, pushToast])

  const handleReset = useCallback(() => {
    setValues(clone(saved))
    setErrors({})
    pushToast("已放弃未保存的修改")
  }, [saved, pushToast])

  // 分组导航：滚动定位 + 若有未保存修改则拦截确认
  const goToSection = useCallback(
    (id: string) => {
      setActiveSection(id)
      document
        .getElementById(`section-${id}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" })
    },
    [],
  )

  // 观察滚动位置，高亮当前分组
  useEffect(() => {
    const root = scrollRef.current
    if (!root) return
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id.replace("section-", ""))
          }
        }
      },
      { root, rootMargin: "-20% 0px -70% 0px", threshold: 0 },
    )
    SETTINGS_SECTIONS.forEach((s) => {
      const el = document.getElementById(`section-${s.id}`)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  return (
    <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
      {/* 左侧分组导航（桌面） */}
      <nav className="hidden shrink-0 lg:block lg:w-52">
        <div className="sticky top-24 space-y-1">
          <p className="mb-3 px-3 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            设置分组
          </p>
          {SETTINGS_SECTIONS.map((s) => {
            const Icon = s.icon
            const hasError = errors[s.id] && Object.keys(errors[s.id]).length > 0
            return (
              <button
                key={s.id}
                type="button"
                onClick={() => goToSection(s.id)}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm transition-colors",
                  activeSection === s.id
                    ? "bg-primary/10 text-foreground"
                    : "text-muted-foreground hover:bg-white/5 hover:text-foreground",
                )}
              >
                <Icon className="size-4 shrink-0" />
                <span className="flex-1 truncate">{s.name}</span>
                {hasError && <span className="size-1.5 rounded-full bg-red-400" />}
              </button>
            )
          })}
        </div>
      </nav>

      {/* 主内容 */}
      <div ref={scrollRef} className="min-w-0 flex-1">
        <header className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">系统设置</h1>
          <p className="mt-1 text-sm text-muted-foreground text-pretty">
            配置 TMDB、Radarr、Emby、qBittorrent、AI 模型与应用偏好。密钥默认隐藏，保存前会自动校验。
          </p>
        </header>

        <div className="space-y-5 pb-28">
          {SETTINGS_SECTIONS.map((section) => (
            <SettingSection
              key={section.id}
              section={section}
              values={values[section.id] ?? {}}
              errors={errors[section.id] ?? {}}
              testing={!!testing[section.id]}
              result={results[section.id]}
              onChange={(key, value) => handleChange(section.id, key, value)}
              onTest={() => handleTest(section.id)}
            />
          ))}
        </div>
      </div>

      {/* 底部保存栏：仅在有未保存修改时出现 */}
      {dirty && (
        <div className="fixed inset-x-0 bottom-0 z-30 border-t border-white/10 bg-surface/95 backdrop-blur-md animate-in slide-in-from-bottom-2">
          <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <AlertTriangle className="size-4 text-amber-400" />
              <span className="hidden sm:inline">有未保存的修改</span>
              <span className="sm:hidden">未保存</span>
            </p>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" className="gap-1.5" onClick={handleReset}>
                <RotateCcw className="size-3.5" />
                放弃
              </Button>
              <Button size="sm" className="gap-1.5" onClick={runSave}>
                <Save className="size-3.5" />
                保存设置
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* 离开确认弹窗（分组内导航拦截） */}
      <Dialog
        open={!!leaveGuard}
        onClose={() => setLeaveGuard(null)}
        title="放弃未保存的修改？"
        description="你有尚未保存的设置修改，离开后这些修改将丢失。"
      >
        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setLeaveGuard(null)}>
            继续编辑
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              leaveGuard?.()
              setLeaveGuard(null)
            }}
          >
            放弃并离开
          </Button>
        </div>
      </Dialog>

      {/* Toast */}
      <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 flex -translate-x-1/2 flex-col items-center gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={cn(
              "flex items-center gap-2 rounded-full border px-4 py-2 text-sm shadow-lg shadow-black/40 animate-in fade-in slide-in-from-bottom-2",
              t.kind === "ok"
                ? "border-white/10 bg-surface text-foreground"
                : "border-red-500/30 bg-red-500/10 text-red-200",
            )}
          >
            {t.kind === "ok" ? (
              <CheckCircle2 className="size-4 text-emerald-400" />
            ) : (
              <AlertTriangle className="size-4 text-red-400" />
            )}
            {t.text}
          </div>
        ))}
      </div>
    </div>
  )
}
