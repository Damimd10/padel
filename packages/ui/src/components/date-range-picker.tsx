import { format } from "date-fns";
import * as React from "react";
import type { DateRange } from "react-day-picker";
import { cn } from "../lib/utils.js";
import { Button, type ButtonProps } from "./button.js";
import { Calendar, type CalendarProps } from "./calendar.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

function CalendarIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      aria-hidden="true"
      fill="none"
      height="16"
      viewBox="0 0 24 24"
      width="16"
      {...props}
    >
      <path
        d="M8 2v4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <path
        d="M16 2v4"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
      <rect
        height="18"
        rx="2"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        width="18"
        x="3"
        y="4"
      />
      <path
        d="M3 10h18"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
      />
    </svg>
  );
}

function useControllableRangeState(
  value: DateRange | undefined,
  defaultValue: DateRange | undefined,
  onValueChange?: (value: DateRange | undefined) => void,
) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const selectedRange = isControlled ? value : internalValue;

  const setSelectedRange = React.useCallback(
    (nextValue: DateRange | undefined) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [selectedRange, setSelectedRange] as const;
}

function formatRangeValue(value: DateRange | undefined, placeholder: string) {
  if (!value?.from) {
    return placeholder;
  }

  if (!value.to) {
    return format(value.from, "LLL dd, y");
  }

  return `${format(value.from, "LLL dd, y")} - ${format(value.to, "LLL dd, y")}`;
}

function formatRangeSubmissionValue(date: Date | undefined) {
  return date ? format(date, "yyyy-MM-dd") : "";
}

export interface DateRangePickerProps
  extends Omit<
    ButtonProps,
    "children" | "defaultValue" | "onChange" | "value"
  > {
  calendarProps?: Omit<
    CalendarProps,
    "defaultMonth" | "mode" | "numberOfMonths" | "onSelect" | "selected"
  >;
  defaultValue?: DateRange;
  fromName?: string;
  numberOfMonths?: number;
  onValueChange?: (value: DateRange | undefined) => void;
  placeholder?: string;
  popoverContentProps?: Omit<
    React.ComponentPropsWithoutRef<typeof PopoverContent>,
    "children"
  >;
  readOnly?: boolean;
  toName?: string;
  value?: DateRange;
}

export const DateRangePicker = React.forwardRef<
  HTMLButtonElement,
  DateRangePickerProps
>(
  (
    {
      calendarProps,
      className,
      defaultValue,
      disabled = false,
      form,
      fromName,
      id,
      numberOfMonths = 2,
      onValueChange,
      placeholder = "Pick a date range",
      popoverContentProps,
      readOnly = false,
      toName,
      value,
      variant = "outline",
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [selectedRange, setSelectedRange] = useControllableRangeState(
      value,
      defaultValue,
      onValueChange,
    );

    return (
      <Popover
        onOpenChange={setOpen}
        open={disabled || readOnly ? false : open}
      >
        {fromName ? (
          <input
            disabled={disabled}
            form={form}
            name={fromName}
            type="hidden"
            value={formatRangeSubmissionValue(selectedRange?.from)}
          />
        ) : null}
        {toName ? (
          <input
            disabled={disabled}
            form={form}
            name={toName}
            type="hidden"
            value={formatRangeSubmissionValue(selectedRange?.to)}
          />
        ) : null}
        <PopoverTrigger asChild>
          <Button
            {...props}
            className={cn(
              "w-full justify-start px-3 text-left font-normal",
              !selectedRange?.from && "text-muted-foreground",
              className,
            )}
            data-slot="date-range-picker"
            disabled={disabled || readOnly}
            id={id}
            ref={ref}
            variant={variant}
          >
            <CalendarIcon />
            <span>{formatRangeValue(selectedRange, placeholder)}</span>
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          className="w-auto overflow-hidden bg-popover p-0 text-popover-foreground"
          {...popoverContentProps}
        >
          <Calendar
            defaultMonth={selectedRange?.from}
            mode="range"
            numberOfMonths={numberOfMonths}
            onSelect={(nextRange: DateRange | undefined) => {
              setSelectedRange(nextRange);

              if (nextRange?.from && nextRange.to) {
                setOpen(false);
              }
            }}
            selected={selectedRange}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DateRangePicker.displayName = "DateRangePicker";
