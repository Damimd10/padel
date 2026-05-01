import type * as React from "react";
import { cn } from "../lib/utils.js";

const summaryToneClassNames = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-primary",
  warning: "text-accent-foreground",
  danger: "text-destructive",
} as const;

const summaryColumnClassNames = {
  1: "grid-cols-1",
  2: "grid-cols-1 md:grid-cols-2",
  3: "grid-cols-1 md:grid-cols-3",
} as const;

export type SummaryTone = keyof typeof summaryToneClassNames;

export interface KeyValueSummaryItem {
  id?: string;
  label: React.ReactNode;
  value?: React.ReactNode;
  description?: React.ReactNode;
  tone?: SummaryTone;
}

export interface KeyValueSummaryBlockProps
  extends React.HTMLAttributes<HTMLElement> {
  columns?: keyof typeof summaryColumnClassNames;
  description?: React.ReactNode;
  emptyValue?: React.ReactNode;
  heading?: React.ReactNode;
  items: KeyValueSummaryItem[];
}

export function KeyValueSummaryBlock({
  className,
  columns = 2,
  description,
  emptyValue = "--",
  heading,
  items,
  ...props
}: KeyValueSummaryBlockProps) {
  return (
    <section
      className={cn(
        "rounded-2xl border border-border/80 bg-card text-card-foreground shadow-sm",
        className,
      )}
      data-slot="key-value-summary-block"
      {...props}
    >
      {heading || description ? (
        <header
          className="border-b border-border/70 px-5 py-4"
          data-slot="key-value-summary-header"
        >
          {heading ? (
            <h3 className="text-sm font-semibold tracking-[0.08em] uppercase">
              {heading}
            </h3>
          ) : null}
          {description ? (
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              {description}
            </p>
          ) : null}
        </header>
      ) : null}
      <dl
        className={cn("grid gap-4 px-5 py-4", summaryColumnClassNames[columns])}
        data-slot="key-value-summary-grid"
      >
        {items.map((item, index) => {
          const tone = item.tone ?? "default";

          return (
            <div
              className="grid gap-1"
              data-slot="key-value-summary-item"
              key={item.id ?? index}
            >
              <dt className="text-xs font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {item.label}
              </dt>
              <dd
                className={cn(
                  "text-base font-semibold leading-6",
                  summaryToneClassNames[tone],
                )}
              >
                {item.value ?? emptyValue}
              </dd>
              {item.description ? (
                <dd className="text-sm leading-6 text-muted-foreground">
                  {item.description}
                </dd>
              ) : null}
            </div>
          );
        })}
      </dl>
    </section>
  );
}
