import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils.js";

export const emptyStateVariants = cva(
  "grid gap-4 rounded-[1.4rem] border border-dashed px-6 py-7 text-center shadow-sm",
  {
    variants: {
      variant: {
        info: "border-primary/25 bg-primary/6 text-foreground",
        success: "border-primary/25 bg-secondary text-foreground",
        warning: "border-accent-foreground/20 bg-accent text-accent-foreground",
        blocked:
          "border-destructive/25 bg-destructive/8 text-foreground shadow-[0_0_0_1px_hsl(var(--destructive)/0.08)]",
      },
      size: {
        default: "max-w-xl",
        compact: "max-w-md px-5 py-6",
      },
    },
    defaultVariants: {
      variant: "info",
      size: "default",
    },
  },
);

export interface EmptyStateProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof emptyStateVariants> {}

export const EmptyState = React.forwardRef<HTMLDivElement, EmptyStateProps>(
  ({ className, size, variant, ...props }, ref) => (
    <div
      className={cn(emptyStateVariants({ className, size, variant }))}
      data-slot="empty-state"
      data-variant={variant ?? "info"}
      ref={ref}
      {...props}
    />
  ),
);

EmptyState.displayName = "EmptyState";

export interface EmptyStateEyebrowProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const EmptyStateEyebrow = React.forwardRef<
  HTMLParagraphElement,
  EmptyStateEyebrowProps
>(({ className, ...props }, ref) => (
  <p
    className={cn(
      "mx-auto w-fit rounded-full bg-background/70 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-muted-foreground",
      className,
    )}
    data-slot="empty-state-eyebrow"
    ref={ref}
    {...props}
  />
));

EmptyStateEyebrow.displayName = "EmptyStateEyebrow";

export interface EmptyStateTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {}

export const EmptyStateTitle = React.forwardRef<
  HTMLHeadingElement,
  EmptyStateTitleProps
>(({ className, ...props }, ref) => (
  <h3
    className={cn("text-xl font-semibold tracking-tight", className)}
    data-slot="empty-state-title"
    ref={ref}
    {...props}
  />
));

EmptyStateTitle.displayName = "EmptyStateTitle";

export interface EmptyStateDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const EmptyStateDescription = React.forwardRef<
  HTMLParagraphElement,
  EmptyStateDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    className={cn(
      "mx-auto max-w-prose text-sm leading-6 text-muted-foreground data-[variant=warning]:text-accent-foreground/80 data-[variant=blocked]:text-foreground/80",
      className,
    )}
    data-slot="empty-state-description"
    ref={ref}
    {...props}
  />
));

EmptyStateDescription.displayName = "EmptyStateDescription";

export interface EmptyStateActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const EmptyStateActions = React.forwardRef<
  HTMLDivElement,
  EmptyStateActionsProps
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex flex-wrap items-center justify-center gap-3 pt-1",
      className,
    )}
    data-slot="empty-state-actions"
    ref={ref}
    {...props}
  />
));

EmptyStateActions.displayName = "EmptyStateActions";
