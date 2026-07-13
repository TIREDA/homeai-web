import { CheckCircle2, XCircle, Loader2, Plug } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { SettingField } from "./SettingField"
import type {
  ConnectionTestResult,
  SectionDef,
  SectionErrors,
  SectionValues,
  FieldValue,
} from "@/types/settings"

interface SettingSectionProps {
  section: SectionDef
  values: SectionValues
  errors: SectionErrors
  testing: boolean
  result?: ConnectionTestResult
  onChange: (key: string, value: FieldValue) => void
  onTest: () => void
}

export function SettingSection({
  section,
  values,
  errors,
  testing,
  result,
  onChange,
  onTest,
}: SettingSectionProps) {
  const Icon = section.icon

  return (
    <section
      id={`section-${section.id}`}
      className="scroll-mt-24 rounded-2xl border border-white/8 bg-surface/40 p-5 sm:p-6"
    >
      {/* 分组标题 */}
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
            <Icon className="size-5" />
          </span>
          <div>
            <h2 className="text-base font-semibold tracking-tight">{section.name}</h2>
            <p className="mt-0.5 text-sm text-muted-foreground">{section.description}</p>
          </div>
        </div>
      </div>

      {/* 字段网格 */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {section.fields.map((field) => (
          <div key={field.key} className={cn(field.type === "switch" && "sm:col-span-2")}>
            <SettingField
              field={field}
              value={values[field.key]}
              error={errors[field.key]}
              onChange={(v) => onChange(field.key, v)}
            />
          </div>
        ))}
      </div>

      {/* 连接测试 */}
      {section.testable && (
        <div className="mt-5 flex flex-col gap-3 border-t border-white/8 pt-4 sm:flex-row sm:items-center sm:justify-between">
          <TestResult testing={testing} result={result} />
          <Button
            variant="secondary"
            size="sm"
            className="gap-1.5 self-start sm:self-auto"
            onClick={onTest}
            disabled={testing}
          >
            {testing ? (
              <Loader2 className="size-3.5 animate-spin" />
            ) : (
              <Plug className="size-3.5" />
            )}
            {testing ? "测试中…" : "测试连接"}
          </Button>
        </div>
      )}
    </section>
  )
}

function TestResult({
  testing,
  result,
}: {
  testing: boolean
  result?: ConnectionTestResult
}) {
  if (testing) {
    return <p className="text-xs text-muted-foreground">正在建立连接并验证凭据…</p>
  }
  if (!result) {
    return <p className="text-xs text-muted-foreground">尚未测试连接。</p>
  }

  if (result.status === "success") {
    return (
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
        <span className="flex items-center gap-1 font-medium text-emerald-300">
          <CheckCircle2 className="size-3.5" />
          {result.message}
        </span>
        {result.version && (
          <span className="text-muted-foreground">
            版本 <span className="text-foreground/80">{result.version}</span>
          </span>
        )}
        <span className="text-muted-foreground">
          耗时 <span className="tabular-nums text-foreground/80">{result.latencyMs}ms</span>
        </span>
      </div>
    )
  }

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
      <span className="flex items-center gap-1 font-medium text-red-400">
        <XCircle className="size-3.5" />
        {result.message}
      </span>
      <span className="text-muted-foreground">
        耗时 <span className="tabular-nums text-foreground/80">{result.latencyMs}ms</span>
      </span>
    </div>
  )
}
