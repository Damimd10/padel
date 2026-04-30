import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils.js";

export const inlineAlertVariants = cva(
  "grid gap-3 rounded-xl border px-4 py-4 shadow-sm",
  {
    variants: {
      variant: {
        info: "border-primary/25 bg-primary/8 text-foreground",
        success: "border-primary/35 bg-secondary text-foreground",
        warning: "border-accent-foreground/20 bg-accent text-accent-foreground",
        blocked:
          "border-destructive/25 bg-destructive/10 text-foreground shadow-[0_0_0_1px_hsl(var(--destructive)/0.08)]",
      },
      density: {
        default: "sm:grid-cols-[auto_1fr]",
        compact: "gap-2 px-3 py-3",
      },
    },
    defaultVariants: {
      variant: "info",
      density: "default",
    },
  },
);

const inlineAlertStatusText = {
  blocked: "Blocked",
  info: "Info",
  success: "Success",
  warning: "Warning",
} as const;

export interface InlineAlertProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof inlineAlertVariants> {
  role?: "alert" | "status";
}

export const InlineAlert = React.forwardRef<HTMLDivElement, InlineAlertProps>(
  ({ className, density, role, variant, ...props }, ref) => {
    const resolvedVariant = variant ?? "info";
    const resolvedRole =
      role ??
      (resolvedVariant === "warning" || resolvedVariant === "blocked"
        ? "alert"
        : "status");

    return (
      <div
        className={cn(inlineAlertVariants({ className, density, variant }))}
        data-slot="inline-alert"
        data-variant={resolvedVariant}
        ref={ref}
        role={resolvedRole}
        {...props}
      />
    );
  },
);

InlineAlert.displayName = "InlineAlert";

export interface InlineAlertTitleProps
  extends React.HTMLAttributes<HTMLHeadingElement> {
  variant?: VariantProps<typeof inlineAlertVariants>["variant"];
}

export const InlineAlertTitle = React.forwardRef<
  HTMLHeadingElement,
  InlineAlertTitleProps
>(({ children, className, variant = "info", ...props }, ref) => {
  const resolvedVariant = variant ?? "info";

  return (
    <h3
      className={cn(
        "flex items-center gap-2 text-sm font-semibold tracking-tight",
        className,
      )}
      data-slot="inline-alert-title"
      ref={ref}
      {...props}
    >
      <span
        aria-hidden="true"
        className={cn(
          "inline-flex min-w-16 rounded-full px-2 py-1 text-[0.65rem] font-semibold uppercase tracking-[0.18em]",
          resolvedVariant === "info" && "bg-primary/14 text-primary",
          resolvedVariant === "success" && "bg-primary text-primary-foreground",
          resolvedVariant === "warning" &&
            "bg-accent-foreground/10 text-accent-foreground",
          resolvedVariant === "blocked" &&
            "bg-destructive text-destructive-foreground",
        )}
      >
        {inlineAlertStatusText[resolvedVariant]}
      </span>
      <span>{children}</span>
    </h3>
  );
});

InlineAlertTitle.displayName = "InlineAlertTitle";

export interface InlineAlertDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {}

export const InlineAlertDescription = React.forwardRef<
  HTMLParagraphElement,
  InlineAlertDescriptionProps
>(({ className, ...props }, ref) => (
  <p
    className={cn(
      "text-sm leading-6 text-muted-foreground data-[variant=warning]:text-accent-foreground/80 data-[variant=blocked]:text-foreground/80",
      className,
    )}
    data-slot="inline-alert-description"
    ref={ref}
    {...props}
  />
));

InlineAlertDescription.displayName = "InlineAlertDescription";

export interface InlineAlertActionsProps
  extends React.HTMLAttributes<HTMLDivElement> {}

export const InlineAlertActions = React.forwardRef<
  HTMLDivElement,
  InlineAlertActionsProps
>(({ className, ...props }, ref) => (
  <div
    className={cn(
      "flex flex-wrap items-center gap-2 pt-1 sm:col-start-2",
      className,
    )}
    data-slot="inline-alert-actions"
    ref={ref}
    {...props}
  />
));

InlineAlertActions.displayName = "InlineAlertActions";
