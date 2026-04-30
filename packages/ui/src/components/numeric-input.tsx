import * as React from "react";
import { Input, type InputProps } from "./input.js";

export interface NumericInputProps extends Omit<InputProps, "type"> {}

function getDefaultInputMode(step: InputProps["step"]) {
  if (typeof step === "number") {
    return Number.isInteger(step) ? "numeric" : "decimal";
  }

  if (typeof step === "string") {
    return step.includes(".") ? "decimal" : "numeric";
  }

  return "numeric";
}

export const NumericInput = React.forwardRef<
  HTMLInputElement,
  NumericInputProps
>(({ inputMode, step, ...props }, ref) => (
  <Input
    inputMode={inputMode ?? getDefaultInputMode(step)}
    ref={ref}
    step={step}
    type="number"
    {...props}
  />
));

NumericInput.displayName = "NumericInput";
