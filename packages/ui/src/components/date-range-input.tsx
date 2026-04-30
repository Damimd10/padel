import * as React from "react";
import { cn } from "../lib/utils.js";
import { DateInput, type DateInputProps } from "./date-input.js";
import { Label } from "./label.js";

type RangeFieldProps = Omit<DateInputProps, "type">;

function isAriaTrue(
  value: boolean | "true" | "false" | "grammar" | "spelling" | undefined,
) {
  return value === true || value === "true";
}

export interface DateRangeInputProps
  extends Omit<
    React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
    "children" | "defaultValue" | "onChange"
  > {
  disabled?: boolean;
  endLabel?: React.ReactNode;
  endProps?: RangeFieldProps;
  readOnly?: boolean;
  required?: boolean;
  separator?: React.ReactNode;
  startLabel?: React.ReactNode;
  startProps?: RangeFieldProps;
}

export const DateRangeInput = React.forwardRef<
  HTMLFieldSetElement,
  DateRangeInputProps
>(
  (
    {
      className,
      disabled = false,
      endLabel = "End date",
      endProps,
      id,
      readOnly = false,
      required = false,
      separator = "to",
      startLabel = "Start date",
      startProps,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-labelledby": ariaLabelledBy,
      "aria-required": ariaRequired,
      ...props
    },
    ref,
  ) => {
    const startId = startProps?.id ?? (id ? `${id}-start` : undefined);
    const endId = endProps?.id ?? (id ? `${id}-end` : undefined);
    const invalid = isAriaTrue(ariaInvalid);
    const isRequired = required || isAriaTrue(ariaRequired);

    return (
      <fieldset
        aria-describedby={ariaDescribedBy}
        aria-invalid={invalid || undefined}
        aria-labelledby={ariaLabelledBy}
        aria-required={isRequired || undefined}
        className={cn("grid gap-3", className)}
        data-slot="date-range-input"
        ref={ref}
        {...props}
      >
        <div className="grid gap-3 md:grid-cols-[1fr_auto_1fr] md:items-end">
          <div className="grid gap-2">
            <Label htmlFor={startId}>{startLabel}</Label>
            <DateInput
              {...startProps}
              aria-describedby={ariaDescribedBy}
              aria-invalid={invalid || startProps?.["aria-invalid"]}
              disabled={disabled || startProps?.disabled}
              id={startId}
              readOnly={readOnly || startProps?.readOnly}
              required={isRequired || startProps?.required}
            />
          </div>
          <span
            aria-hidden="true"
            className="hidden text-sm font-medium text-muted-foreground md:inline-flex md:pb-2"
          >
            {separator}
          </span>
          <div className="grid gap-2">
            <Label htmlFor={endId}>{endLabel}</Label>
            <DateInput
              {...endProps}
              aria-describedby={ariaDescribedBy}
              aria-invalid={invalid || endProps?.["aria-invalid"]}
              disabled={disabled || endProps?.disabled}
              id={endId}
              readOnly={readOnly || endProps?.readOnly}
              required={isRequired || endProps?.required}
            />
          </div>
        </div>
      </fieldset>
    );
  },
);

DateRangeInput.displayName = "DateRangeInput";
