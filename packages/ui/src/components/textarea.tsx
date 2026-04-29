import * as React from "react";
import { cn } from "../lib/utils.js";

export type TextareaProps = React.ComponentPropsWithoutRef<"textarea">;

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => (
    <textarea
      className={cn(
        "flex min-h-28 w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[border-color,box-shadow,color] outline-hidden placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default read-only:bg-muted/40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:ring-offset-0",
        className,
      )}
      data-slot="textarea"
      ref={ref}
      {...props}
    />
  ),
);

Textarea.displayName = "Textarea";
