import * as React from "react";
import { cn } from "../lib/utils.js";
import { Label, type LabelProps } from "./label.js";

type FieldControlProps = {
  id?: string;
  disabled?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean | "true" | "false";
  "aria-required"?: boolean | "true" | "false";
};

export interface FieldProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement<FieldControlProps>;
  description?: React.ReactNode;
  error?: React.ReactNode;
  id?: string;
  label?: React.ReactNode;
  labelProps?: Omit<LabelProps, "children" | "htmlFor">;
  required?: boolean;
}

function joinIds(...values: Array<string | undefined>) {
  const joined = values.filter(Boolean).join(" ");
  return joined.length > 0 ? joined : undefined;
}

export const Field = React.forwardRef<HTMLDivElement, FieldProps>(
  (
    {
      children,
      className,
      description,
      error,
      id,
      label,
      labelProps,
      required = false,
      ...props
    },
    ref,
  ) => {
    const reactId = React.useId();
    const control = React.Children.only(children);
    const controlId = control.props.id ?? id ?? reactId.replace(/:/g, "");
    const descriptionId = description ? `${controlId}-description` : undefined;
    const errorId = error ? `${controlId}-error` : undefined;
    const invalid =
      control.props["aria-invalid"] === true ||
      control.props["aria-invalid"] === "true" ||
      Boolean(error);

    const controlProps: FieldControlProps = {
      id: controlId,
      "aria-describedby": joinIds(
        control.props["aria-describedby"],
        descriptionId,
        errorId,
      ),
      "aria-invalid": invalid || undefined,
      "aria-required":
        required || control.props["aria-required"] === true
          ? true
          : control.props["aria-required"],
    };

    return (
      <div
        className={cn("grid gap-2", className)}
        data-invalid={invalid || undefined}
        ref={ref}
        {...props}
      >
        {label ? (
          <Label
            data-invalid={invalid || undefined}
            htmlFor={controlId}
            {...labelProps}
          >
            {label}
            {required ? (
              <span aria-hidden="true" className="text-destructive">
                *
              </span>
            ) : null}
          </Label>
        ) : null}
        {React.cloneElement(control, controlProps)}
        {description ? (
          <p
            className="text-sm leading-6 text-muted-foreground"
            data-slot="field-description"
            id={descriptionId}
          >
            {description}
          </p>
        ) : null}
        {error ? (
          <p
            className="text-sm font-medium leading-6 text-destructive"
            data-slot="field-error"
            id={errorId}
            role="alert"
          >
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);

Field.displayName = "Field";
