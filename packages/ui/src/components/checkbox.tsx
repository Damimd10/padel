import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import * as React from "react";
import { cn } from "../lib/utils.js";

export const checkboxRootClassName =
  "peer h-4 w-4 shrink-0 rounded-[0.35rem] border border-input bg-background shadow-xs transition-colors outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[state=checked]:bg-primary data-[invalid=true]:border-[hsl(var(--destructive))] data-[invalid=true]:focus-visible:ring-[hsl(var(--destructive))]";

export const checkboxIndicatorClassName =
  "flex items-center justify-center text-primary-foreground";

export type CheckboxProps = React.ComponentPropsWithoutRef<
  typeof CheckboxPrimitive.Root
> & {
  invalid?: boolean;
};

export const Checkbox = React.forwardRef<
  React.ElementRef<typeof CheckboxPrimitive.Root>,
  CheckboxProps
>(({ className, invalid = false, ...props }, ref) => (
  <CheckboxPrimitive.Root
    className={cn(checkboxRootClassName, className)}
    data-invalid={invalid ? "true" : undefined}
    data-slot="checkbox"
    ref={ref}
    {...props}
  >
    <CheckboxPrimitive.Indicator
      className={checkboxIndicatorClassName}
      data-slot="checkbox-indicator"
    >
      <svg
        aria-hidden="true"
        className="h-3.5 w-3.5"
        fill="none"
        viewBox="0 0 14 14"
      >
        <path
          d="M3 7.5 5.5 10 11 4.5"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
        />
      </svg>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
));

Checkbox.displayName = CheckboxPrimitive.Root.displayName;
