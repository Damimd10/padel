import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import * as React from "react";
import { cn } from "../lib/utils.js";

export const radioGroupRootClassName = "grid gap-3";

export const radioGroupItemRootClassName =
  "peer aspect-square h-4 w-4 shrink-0 rounded-full border border-input bg-background shadow-xs outline-hidden transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:border-primary data-[invalid=true]:border-[hsl(var(--destructive))] data-[invalid=true]:focus-visible:ring-[hsl(var(--destructive))]";

export const radioGroupItemIndicatorClassName =
  "flex items-center justify-center";

export type RadioGroupProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Root
> & {
  invalid?: boolean;
};

export const RadioGroup = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Root>,
  RadioGroupProps
>(({ className, invalid = false, ...props }, ref) => (
  <RadioGroupPrimitive.Root
    className={cn(radioGroupRootClassName, className)}
    data-invalid={invalid ? "true" : undefined}
    data-slot="radio-group"
    ref={ref}
    {...props}
  />
));

RadioGroup.displayName = RadioGroupPrimitive.Root.displayName;

export type RadioGroupItemProps = React.ComponentPropsWithoutRef<
  typeof RadioGroupPrimitive.Item
> & {
  invalid?: boolean;
};

export const RadioGroupItem = React.forwardRef<
  React.ElementRef<typeof RadioGroupPrimitive.Item>,
  RadioGroupItemProps
>(({ className, invalid = false, ...props }, ref) => (
  <RadioGroupPrimitive.Item
    className={cn(radioGroupItemRootClassName, className)}
    data-invalid={invalid ? "true" : undefined}
    data-slot="radio-group-item"
    ref={ref}
    {...props}
  >
    <RadioGroupPrimitive.Indicator
      className={radioGroupItemIndicatorClassName}
      data-slot="radio-group-indicator"
    >
      <span className="block h-2 w-2 rounded-full bg-primary" />
    </RadioGroupPrimitive.Indicator>
  </RadioGroupPrimitive.Item>
));

RadioGroupItem.displayName = RadioGroupPrimitive.Item.displayName;
