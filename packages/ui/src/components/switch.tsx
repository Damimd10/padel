import * as SwitchPrimitive from "@radix-ui/react-switch";
import * as React from "react";
import { cn } from "../lib/utils.js";

export const switchRootClassName =
  "peer inline-flex h-6 w-11 shrink-0 items-center rounded-full border border-transparent bg-muted shadow-xs outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[invalid=true]:ring-2 data-[invalid=true]:ring-[hsl(var(--destructive))]";

export const switchThumbClassName =
  "block h-5 w-5 rounded-full bg-background shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0";

export type SwitchProps = React.ComponentPropsWithoutRef<
  typeof SwitchPrimitive.Root
> & {
  invalid?: boolean;
};

export const Switch = React.forwardRef<
  React.ElementRef<typeof SwitchPrimitive.Root>,
  SwitchProps
>(({ className, invalid = false, ...props }, ref) => (
  <SwitchPrimitive.Root
    className={cn(switchRootClassName, className)}
    data-invalid={invalid ? "true" : undefined}
    data-slot="switch"
    ref={ref}
    {...props}
  >
    <SwitchPrimitive.Thumb
      className={switchThumbClassName}
      data-slot="switch-thumb"
    />
  </SwitchPrimitive.Root>
));

Switch.displayName = SwitchPrimitive.Root.displayName;
