import * as React from "react";
import { cn } from "../lib/utils.js";

export type InputProps = React.ComponentPropsWithoutRef<"input">;

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type = "text", ...props }, ref) => (
    <input
      className={cn(
        "flex h-10 w-full min-w-0 rounded-md border border-input bg-background px-3 py-2 text-sm shadow-xs transition-[border-color,box-shadow,color] outline-hidden placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 read-only:cursor-default read-only:bg-muted/40 aria-invalid:border-destructive aria-invalid:ring-2 aria-invalid:ring-destructive/20 aria-invalid:ring-offset-0",
        className,
      )}
      data-slot="input"
      ref={ref}
      type={type}
      {...props}
    />
  ),
);

Input.displayName = "Input";
