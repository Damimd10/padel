import * as React from "react";
import { Input, type InputProps } from "./input.js";

export interface DateInputProps extends Omit<InputProps, "type"> {}

export const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (props, ref) => <Input ref={ref} type="date" {...props} />,
);

DateInput.displayName = "DateInput";
