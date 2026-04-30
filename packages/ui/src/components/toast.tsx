import * as ToastPrimitives from "@radix-ui/react-toast";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils.js";

export const ToastProvider = ToastPrimitives.Provider;

export type ToastViewportProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Viewport
>;

export const ToastViewport = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Viewport>,
  ToastViewportProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Viewport
    className={cn(
      "fixed top-0 z-50 flex max-h-screen w-full flex-col-reverse gap-3 p-4 outline-hidden sm:right-0 sm:top-auto sm:bottom-0 sm:max-w-[28rem]",
      className,
    )}
    data-slot="toast-viewport"
    ref={ref}
    {...props}
  />
));

ToastViewport.displayName = ToastPrimitives.Viewport.displayName;

export const toastVariants = cva(
  "group pointer-events-auto relative grid gap-2 overflow-hidden rounded-2xl border px-4 py-4 shadow-lg backdrop-blur-sm transition-[opacity,transform] data-[state=closed]:translate-y-2 data-[state=closed]:opacity-0 data-[state=open]:translate-y-0 data-[state=open]:opacity-100 data-[swipe=cancel]:translate-x-0 data-[swipe=end]:translate-x-[var(--radix-toast-swipe-end-x)] data-[swipe=move]:translate-x-[var(--radix-toast-swipe-move-x)] data-[swipe=move]:transition-none",
  {
    variants: {
      variant: {
        info: "border-primary/25 bg-background/95 text-foreground",
        success: "border-primary/30 bg-secondary text-foreground",
        warning: "border-accent-foreground/20 bg-accent text-accent-foreground",
        blocked:
          "border-destructive/25 bg-destructive/10 text-foreground shadow-[0_0_0_1px_hsl(var(--destructive)/0.08)]",
      },
    },
    defaultVariants: {
      variant: "info",
    },
  },
);

export interface ToastProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Root>,
    VariantProps<typeof toastVariants> {}

export const Toast = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Root>,
  ToastProps
>(({ className, variant, ...props }, ref) => (
  <ToastPrimitives.Root
    className={cn(toastVariants({ className, variant }))}
    data-slot="toast"
    data-variant={variant ?? "info"}
    ref={ref}
    {...props}
  />
));

Toast.displayName = ToastPrimitives.Root.displayName;

export interface ToastTitleProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Title> {}

export const ToastTitle = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Title>,
  ToastTitleProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Title
    className={cn("text-sm font-semibold tracking-tight", className)}
    data-slot="toast-title"
    ref={ref}
    {...props}
  />
));

ToastTitle.displayName = ToastPrimitives.Title.displayName;

export interface ToastDescriptionProps
  extends React.ComponentPropsWithoutRef<typeof ToastPrimitives.Description> {}

export const ToastDescription = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Description>,
  ToastDescriptionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Description
    className={cn(
      "text-sm leading-6 text-muted-foreground data-[variant=warning]:text-accent-foreground/80 data-[variant=blocked]:text-foreground/80",
      className,
    )}
    data-slot="toast-description"
    ref={ref}
    {...props}
  />
));

ToastDescription.displayName = ToastPrimitives.Description.displayName;

export type ToastActionProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Action
>;

export const ToastAction = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Action>,
  ToastActionProps
>(({ className, ...props }, ref) => (
  <ToastPrimitives.Action
    className={cn(
      "inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-border bg-background px-3 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden group-data-[variant=blocked]:border-destructive/25 group-data-[variant=blocked]:bg-destructive/6 group-data-[variant=warning]:border-accent-foreground/15 group-data-[variant=warning]:bg-background/60",
      className,
    )}
    data-slot="toast-action"
    ref={ref}
    {...props}
  />
));

ToastAction.displayName = ToastPrimitives.Action.displayName;

export type ToastCloseProps = React.ComponentPropsWithoutRef<
  typeof ToastPrimitives.Close
>;

export const ToastClose = React.forwardRef<
  React.ElementRef<typeof ToastPrimitives.Close>,
  ToastCloseProps
>(({ children, className, ...props }, ref) => (
  <ToastPrimitives.Close
    className={cn(
      "absolute top-3 right-3 inline-flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-background/70 hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-hidden",
      className,
    )}
    data-slot="toast-close"
    ref={ref}
    {...props}
  >
    {children ?? <span aria-hidden="true">x</span>}
    <span className="sr-only">Dismiss notification</span>
  </ToastPrimitives.Close>
));

ToastClose.displayName = ToastPrimitives.Close.displayName;
