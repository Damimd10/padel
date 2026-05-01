import type * as React from "react";
import { cn } from "../lib/utils.js";

const progressToneClassNames = {
  default: "bg-primary",
  muted: "bg-muted-foreground",
  success: "bg-primary",
  warning: "bg-accent-foreground",
  danger: "bg-destructive",
} as const;

const progressTextToneClassNames = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-primary",
  warning: "text-accent-foreground",
  danger: "text-destructive",
} as const;

export type ProgressIndicatorTone = keyof typeof progressToneClassNames;

export interface ProgressIndicatorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  description?: React.ReactNode;
  label: React.ReactNode;
  max?: number;
  tone?: ProgressIndicatorTone;
  value: number;
  valueLabel?: React.ReactNode;
}

export function ProgressIndicator({
  className,
  description,
  label,
  max = 100,
  tone = "default",
  value,
  valueLabel,
  ...props
}: ProgressIndicatorProps) {
  const safeMax = max > 0 ? max : 100;
  const clampedValue = Math.min(Math.max(value, 0), safeMax);
  const percent = Math.round((clampedValue / safeMax) * 100);
  const resolvedValueLabel = valueLabel ?? `${percent}%`;
  const ariaValueText =
    typeof resolvedValueLabel === "string" ? resolvedValueLabel : `${percent}%`;

  return (
    <div
      className={cn(
        "grid gap-3 rounded-2xl border border-border/80 bg-card px-4 py-4 shadow-sm",
        className,
      )}
      data-slot="progress-indicator"
      {...props}
    >
      <div
        className="flex items-start justify-between gap-4"
        data-slot="progress-indicator-header"
      >
        <div className="grid gap-1">
          <div className="text-sm font-semibold">{label}</div>
          {description ? (
            <p className="text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </div>
        <div
          className={cn(
            "text-sm font-semibold whitespace-nowrap",
            progressTextToneClassNames[tone],
          )}
        >
          {resolvedValueLabel}
        </div>
      </div>
      <div
        aria-valuemax={safeMax}
        aria-valuemin={0}
        aria-valuenow={clampedValue}
        aria-valuetext={ariaValueText}
        className="h-2.5 overflow-hidden rounded-full bg-muted"
        data-slot="progress-indicator-track"
        role="progressbar"
      >
        <div
          className={cn(
            "h-full rounded-full transition-[width]",
            progressToneClassNames[tone],
          )}
          data-slot="progress-indicator-fill"
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}
