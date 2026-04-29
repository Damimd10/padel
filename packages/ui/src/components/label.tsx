import * as LabelPrimitive from "@radix-ui/react-label";
import * as React from "react";
import { cn } from "../lib/utils.js";

export type LabelProps = React.ComponentPropsWithoutRef<
  typeof LabelPrimitive.Root
>;

export const Label = React.forwardRef<
  React.ElementRef<typeof LabelPrimitive.Root>,
  LabelProps
>(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    className={cn(
      "flex items-center gap-1 text-sm font-medium leading-none select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 data-[invalid=true]:text-destructive",
      className,
    )}
    data-slot="label"
    ref={ref}
    {...props}
  />
));

Label.displayName = LabelPrimitive.Root.displayName;
