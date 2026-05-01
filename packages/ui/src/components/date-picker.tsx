import { format, isValid, parse, parseISO } from "date-fns";
import * as React from "react";
import { cn } from "../lib/utils.js";
import { Button } from "./button.js";
import { Calendar, type CalendarProps } from "./calendar.js";
import { Input, type InputProps } from "./input.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

const DEFAULT_DATE_FORMAT = "MMMM dd, yyyy";

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

function useControllableDateState(
  value: Date | undefined,
  defaultValue: Date | undefined,
  onValueChange?: (value: Date | undefined) => void,
) {
  const [internalValue, setInternalValue] = React.useState(defaultValue);
  const isControlled = value !== undefined;
  const selectedDate = isControlled ? value : internalValue;

  const setSelectedDate = React.useCallback(
    (nextValue: Date | undefined) => {
      if (!isControlled) {
        setInternalValue(nextValue);
      }

      onValueChange?.(nextValue);
    },
    [isControlled, onValueChange],
  );

  return [selectedDate, setSelectedDate] as const;
}

function formatDateForInput(date: Date | undefined, displayFormat: string) {
  return date ? format(date, displayFormat) : "";
}

function formatDateForSubmission(date: Date | undefined) {
  return date ? format(date, "yyyy-MM-dd") : "";
}

function parseDateFromInput(
  value: string,
  displayFormat: string,
  referenceDate: Date,
) {
  const trimmedValue = value.trim();

  if (trimmedValue.length === 0) {
    return undefined;
  }

  if (/^\d{4}-\d{2}-\d{2}$/.test(trimmedValue)) {
    const isoDate = parseISO(trimmedValue);
    return isValid(isoDate) ? isoDate : undefined;
  }

  const parsedDate = parse(trimmedValue, displayFormat, referenceDate);
  return isValid(parsedDate) ? parsedDate : undefined;
}

export interface DatePickerProps
  extends Omit<InputProps, "defaultValue" | "onChange" | "type" | "value"> {
  buttonAriaLabel?: string;
  calendarProps?: Omit<
    CalendarProps,
    "mode" | "month" | "onMonthChange" | "onSelect" | "selected"
  >;
  defaultValue?: Date;
  displayFormat?: string;
  onValueChange?: (value: Date | undefined) => void;
  popoverContentProps?: Omit<
    React.ComponentPropsWithoutRef<typeof PopoverContent>,
    "children"
  >;
  value?: Date;
}

export const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  (
    {
      buttonAriaLabel = "Select date",
      calendarProps,
      className,
      defaultValue,
      disabled = false,
      displayFormat = DEFAULT_DATE_FORMAT,
      form,
      id,
      name,
      onBlur,
      onFocus,
      onKeyDown,
      onValueChange,
      placeholder = "Pick a date",
      popoverContentProps,
      readOnly = false,
      required = false,
      value,
      ...props
    },
    ref,
  ) => {
    const [open, setOpen] = React.useState(false);
    const [selectedDate, setSelectedDate] = useControllableDateState(
      value,
      defaultValue,
      onValueChange,
    );
    const [month, setMonth] = React.useState<Date | undefined>(
      selectedDate ?? defaultValue,
    );
    const [inputValue, setInputValue] = React.useState(() =>
      formatDateForInput(selectedDate ?? defaultValue, displayFormat),
    );

    React.useEffect(() => {
      setInputValue(formatDateForInput(selectedDate, displayFormat));
      if (selectedDate) {
        setMonth(selectedDate);
      }
    }, [displayFormat, selectedDate]);

    return (
      <Popover
        onOpenChange={setOpen}
        open={disabled || readOnly ? false : open}
      >
        <div className="relative" data-slot="date-picker">
          <Input
            {...props}
            autoComplete="off"
            className={cn("pr-11", className)}
            disabled={disabled}
            id={id}
            onBlur={onBlur}
            onChange={(event) => {
              const nextInputValue = event.target.value;
              setInputValue(nextInputValue);

              const nextDate = parseDateFromInput(
                nextInputValue,
                displayFormat,
                selectedDate ?? new Date(),
              );

              if (nextInputValue.trim().length === 0) {
                setSelectedDate(undefined);
                return;
              }

              if (nextDate) {
                setSelectedDate(nextDate);
                setMonth(nextDate);
              }
            }}
            onFocus={onFocus}
            onKeyDown={(event) => {
              onKeyDown?.(event);

              if (event.defaultPrevented) {
                return;
              }

              if (event.key === "ArrowDown" && !disabled && !readOnly) {
                event.preventDefault();
                setOpen(true);
              }
            }}
            placeholder={placeholder}
            readOnly={readOnly}
            ref={ref}
            required={required}
            type="text"
            value={inputValue}
          />
          {name ? (
            <input
              disabled={disabled}
              form={form}
              name={name}
              type="hidden"
              value={formatDateForSubmission(selectedDate)}
            />
          ) : null}
          <PopoverTrigger asChild>
            <Button
              aria-label={buttonAriaLabel}
              className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2 p-0"
              disabled={disabled || readOnly}
              size="icon"
              tabIndex={-1}
              variant="ghost"
            >
              <CalendarIcon />
              <span className="sr-only">{buttonAriaLabel}</span>
            </Button>
          </PopoverTrigger>
        </div>
        <PopoverContent
          align="end"
          className="w-auto overflow-hidden bg-popover p-0 text-popover-foreground"
          sideOffset={10}
          {...popoverContentProps}
        >
          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            onSelect={(nextDate: Date | undefined) => {
              setSelectedDate(nextDate);
              setInputValue(formatDateForInput(nextDate, displayFormat));
              setOpen(false);
            }}
            selected={selectedDate}
            {...calendarProps}
          />
        </PopoverContent>
      </Popover>
    );
  },
);

DatePicker.displayName = "DatePicker";
