import { useState } from "react"
import { Eye, EyeOff, ChevronDown, AlertCircle } from "lucide-react"

import { cn } from "@/lib/utils"
import type { FieldDef, FieldValue } from "@/types/settings"

interface SettingFieldProps {
  field: FieldDef
  value: FieldValue
  error?: string
  onChange: (value: FieldValue) => void
}

const inputBase =
  "w-full rounded-lg border bg-surface/60 px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground/60 outline-none transition-colors focus:border-primary/50 focus:bg-surface"

export function SettingField({ field, value, error, onChange }: SettingFieldProps) {
  const [revealed, setRevealed] = useState(false)

  const borderClass = error ? "border-red-500/50" : "border-white/10"

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between gap-2">
        <label className="text-sm font-medium text-foreground">
          {field.label}
          {field.required && <span className="ml-1 text-red-400">*</span>}
        </label>
        {field.unit && field.type === "number" && (
          <span className="text-xs text-muted-foreground">{field.unit}</span>
        )}
      </div>

      {/* 文本 / URL */}
      {field.type === "text" && (
        <input
          type="text"
          value={String(value ?? "")}
          placeholder={field.placeholder}
          onChange={(e) => onChange(e.target.value)}
          className={cn(inputBase, borderClass)}
          aria-invalid={!!error}
        />
      )}

      {/* 密钥：默认隐藏，可切换显隐 */}
      {field.type === "secret" && (
        <div className="relative">
          <input
            type={revealed ? "text" : "password"}
            value={String(value ?? "")}
            placeholder={field.placeholder ?? "••••••••"}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputBase, borderClass, "pr-10 font-mono")}
            aria-invalid={!!error}
            autoComplete="off"
          />
          <button
            type="button"
            onClick={() => setRevealed((v) => !v)}
            aria-label={revealed ? "隐藏密钥" : "显示密钥"}
            className="absolute right-1 top-1/2 grid size-8 -translate-y-1/2 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-white/10 hover:text-foreground"
          >
            {revealed ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      )}

      {/* 数字 */}
      {field.type === "number" && (
        <input
          type="number"
          value={value === "" || value === undefined ? "" : Number(value)}
          min={field.min}
          max={field.max}
          step={field.step}
          onChange={(e) => onChange(e.target.value === "" ? "" : Number(e.target.value))}
          className={cn(inputBase, borderClass, "tabular-nums")}
          aria-invalid={!!error}
        />
      )}

      {/* 下拉选择 */}
      {field.type === "select" && (
        <div className="relative">
          <select
            value={String(value ?? "")}
            onChange={(e) => onChange(e.target.value)}
            className={cn(inputBase, borderClass, "appearance-none pr-9")}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-surface text-foreground">
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        </div>
      )}

      {/* 开关 */}
      {field.type === "switch" && (
        <button
          type="button"
          role="switch"
          aria-checked={Boolean(value)}
          onClick={() => onChange(!value)}
          className="flex w-full items-center justify-between gap-3 rounded-lg border border-white/10 bg-surface/60 px-3 py-2 text-left text-sm"
        >
          <span className="text-muted-foreground">{value ? "已启用" : "已关闭"}</span>
          <span
            className={cn(
              "relative h-5 w-9 shrink-0 rounded-full transition-colors",
              value ? "bg-primary" : "bg-white/15",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-4 rounded-full bg-white transition-all",
                value ? "left-4" : "left-0.5",
              )}
            />
          </span>
        </button>
      )}

      {/* 错误信息 */}
      {error ? (
        <p className="flex items-center gap-1 text-xs text-red-400">
          <AlertCircle className="size-3" />
          {error}
        </p>
      ) : (
        field.hint && <p className="text-xs text-muted-foreground">{field.hint}</p>
      )}
    </div>
  )
}
