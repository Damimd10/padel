import type * as React from "react";
import { cn } from "../lib/utils.js";

const metadataToneClassNames = {
  default: "text-foreground",
  muted: "text-muted-foreground",
  success: "text-primary",
  warning: "text-accent-foreground",
  danger: "text-destructive",
} as const;

export type InlineMetadataTone = keyof typeof metadataToneClassNames;

export interface InlineMetadataItem {
  id?: string;
  label: React.ReactNode;
  value?: React.ReactNode;
  hint?: React.ReactNode;
  tone?: InlineMetadataTone;
  emphasize?: boolean;
}

export interface InlineMetadataListProps
  extends React.HTMLAttributes<HTMLDListElement> {
  emptyValue?: React.ReactNode;
  items: InlineMetadataItem[];
}

export function InlineMetadataList({
  className,
  emptyValue = "--",
  items,
  ...props
}: InlineMetadataListProps) {
  return (
    <dl
      className={cn(
        "flex flex-wrap gap-x-6 gap-y-4 rounded-2xl border border-border/70 bg-card/70 px-4 py-3",
        className,
      )}
      data-slot="inline-metadata-list"
      {...props}
    >
      {items.map((item, index) => {
        const tone = item.tone ?? "default";

        return (
          <div
            className="grid min-w-[7rem] gap-1"
            data-slot="inline-metadata-item"
            key={item.id ?? index}
          >
            <dt className="text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
              {item.label}
            </dt>
            <dd
              className={cn(
                "text-sm leading-5",
                metadataToneClassNames[tone],
                item.emphasize ? "text-base font-semibold" : "font-medium",
              )}
            >
              {item.value ?? emptyValue}
            </dd>
            {item.hint ? (
              <dd className="text-xs leading-5 text-muted-foreground">
                {item.hint}
              </dd>
            ) : null}
          </div>
        );
      })}
    </dl>
  );
}
