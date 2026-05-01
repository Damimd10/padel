<<<<<<< HEAD
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";
import { cn } from "../lib/utils.js";
import {
  EmptyState,
  EmptyStateDescription,
  EmptyStateEyebrow,
  EmptyStateTitle,
} from "./empty-state.js";

const tableRowVariants = cva(
  "border-b border-border/70 transition-colors last:border-b-0 focus-within:relative focus-within:z-10 focus-within:shadow-[inset_0_0_0_2px_hsl(var(--ring)/0.2)]",
  {
    variants: {
      state: {
        default: "bg-transparent text-foreground",
        selected:
          "bg-secondary/70 text-secondary-foreground shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.2)]",
        warning:
          "bg-accent/55 text-foreground shadow-[inset_4px_0_0_0_hsl(var(--accent-foreground)/0.28)]",
        invalid:
          "bg-destructive/6 text-foreground shadow-[inset_4px_0_0_0_hsl(var(--destructive)/0.5)]",
        completed:
          "bg-primary/6 text-foreground shadow-[inset_4px_0_0_0_hsl(var(--primary)/0.3)]",
      },
    },
    defaultVariants: {
      state: "default",
    },
  },
);

export type TableRowState = NonNullable<
  VariantProps<typeof tableRowVariants>["state"]
>;

export interface TableProps
  extends React.TableHTMLAttributes<HTMLTableElement> {}

export const Table = React.forwardRef<HTMLTableElement, TableProps>(
  ({ className, ...props }, ref) => (
    <table
      className={cn(
        "w-full min-w-[40rem] border-separate border-spacing-0 text-left text-sm leading-5",
        className,
      )}
      data-slot="table"
      ref={ref}
      {...props}
    />
  ),
);

Table.displayName = "Table";

export interface TableHeaderProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  TableHeaderProps
>(({ className, ...props }, ref) => (
  <thead
    className={cn("[&_tr]:border-b [&_tr]:border-border/80", className)}
    data-slot="table-header"
    ref={ref}
    {...props}
  />
));

TableHeader.displayName = "TableHeader";

export interface TableBodyProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  TableBodyProps
>(({ className, ...props }, ref) => (
  <tbody
    className={cn("[&_tr:last-child]:border-b-0", className)}
    data-slot="table-body"
    ref={ref}
    {...props}
  />
));

TableBody.displayName = "TableBody";

export interface TableFooterProps
  extends React.HTMLAttributes<HTMLTableSectionElement> {}

export const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  TableFooterProps
>(({ className, ...props }, ref) => (
  <tfoot
    className={cn(
      "bg-muted/40 font-medium text-foreground [&>tr]:border-t [&>tr]:border-border/80",
      className,
    )}
    data-slot="table-footer"
    ref={ref}
    {...props}
  />
));

TableFooter.displayName = "TableFooter";

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement>,
    VariantProps<typeof tableRowVariants> {}

export const TableRow = React.forwardRef<HTMLTableRowElement, TableRowProps>(
  ({ className, state, ...props }, ref) => (
    <tr
      aria-selected={
        props["aria-selected"] ?? (state === "selected" || undefined)
      }
      className={cn(tableRowVariants({ className, state }))}
      data-slot="table-row"
      data-state={state ?? "default"}
      ref={ref}
      {...props}
    />
  ),
);

TableRow.displayName = "TableRow";

export interface TableHeadProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableHead = React.forwardRef<HTMLTableCellElement, TableHeadProps>(
  ({ className, scope, ...props }, ref) => (
    <th
      className={cn(
        "h-12 border-b border-border/70 px-4 py-3 text-left align-middle text-[0.72rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase",
        className,
      )}
      data-slot="table-head"
      ref={ref}
      scope={scope ?? "col"}
      {...props}
    />
  ),
);

TableHead.displayName = "TableHead";

export interface TableRowHeaderProps
  extends React.ThHTMLAttributes<HTMLTableCellElement> {}

export const TableRowHeader = React.forwardRef<
  HTMLTableCellElement,
  TableRowHeaderProps
>(({ className, scope, ...props }, ref) => (
  <th
    className={cn(
      "border-b border-border/70 px-4 py-3.5 text-left align-middle font-medium text-foreground",
      className,
    )}
    data-slot="table-row-header"
    ref={ref}
    scope={scope ?? "row"}
    {...props}
  />
));

TableRowHeader.displayName = "TableRowHeader";

export interface TableCellProps
  extends React.TdHTMLAttributes<HTMLTableCellElement> {}

export const TableCell = React.forwardRef<HTMLTableCellElement, TableCellProps>(
  ({ className, ...props }, ref) => (
    <td
      className={cn(
        "border-b border-border/70 px-4 py-3.5 align-middle text-foreground",
        className,
      )}
      data-slot="table-cell"
      ref={ref}
      {...props}
    />
  ),
);

TableCell.displayName = "TableCell";

export interface TableCaptionProps
  extends React.HTMLAttributes<HTMLTableCaptionElement> {}

export const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  TableCaptionProps
>(({ className, ...props }, ref) => (
  <caption
    className={cn(
      "caption-bottom px-4 pt-3 text-left text-sm leading-6 text-muted-foreground",
      className,
    )}
    data-slot="table-caption"
    ref={ref}
    {...props}
  />
));

TableCaption.displayName = "TableCaption";

export interface TableEmptyStateProps
  extends Omit<
    React.TdHTMLAttributes<HTMLTableCellElement>,
    "children" | "title"
  > {
  colSpan: number;
  description?: React.ReactNode;
  eyebrow?: React.ReactNode;
  title: React.ReactNode;
}

export const TableEmptyState = React.forwardRef<
  HTMLTableCellElement,
  TableEmptyStateProps
>(({ className, colSpan, description, eyebrow, title, ...props }, ref) => (
  <td
    className={cn("px-4 py-6", className)}
    colSpan={colSpan}
    data-slot="table-empty-state"
    ref={ref}
    {...props}
  >
    <EmptyState className="mx-auto max-w-2xl" size="compact">
      {eyebrow ? <EmptyStateEyebrow>{eyebrow}</EmptyStateEyebrow> : null}
      <EmptyStateTitle>{title}</EmptyStateTitle>
      {description ? (
        <EmptyStateDescription>{description}</EmptyStateDescription>
      ) : null}
    </EmptyState>
  </td>
));

TableEmptyState.displayName = "TableEmptyState";
=======
import type * as React from "react";
import { cn } from "../lib/utils.js";

const tableRowStateClassNames = {
  default: "hover:bg-muted/45",
  selected: "bg-secondary/80 text-secondary-foreground",
  warning: "bg-accent/45 text-accent-foreground",
  danger:
    "bg-destructive/8 text-foreground shadow-[inset_4px_0_0_hsl(var(--destructive))]",
} as const;

export type TableRowState = keyof typeof tableRowStateClassNames;

export function TableContainer({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "overflow-hidden rounded-[1.5rem] border border-border/80 bg-card/90 shadow-sm",
        className,
      )}
      data-slot="table-container"
      {...props}
    />
  );
}

export function Table({
  className,
  ...props
}: React.TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="overflow-x-auto" data-slot="table-scroll">
      <table
        className={cn("min-w-full border-collapse text-left", className)}
        data-slot="table"
        {...props}
      />
    </div>
  );
}

export function TableHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return (
    <thead
      className={cn("bg-muted/55", className)}
      data-slot="table-header"
      {...props}
    />
  );
}

export function TableBody({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn(className)} data-slot="table-body" {...props} />;
}

export interface TableRowProps
  extends React.HTMLAttributes<HTMLTableRowElement> {
  state?: TableRowState;
}

export function TableRow({
  className,
  state = "default",
  ...props
}: TableRowProps) {
  return (
    <tr
      className={cn(
        "border-t border-border/70 transition-colors duration-150 first:border-t-0",
        tableRowStateClassNames[state],
        className,
      )}
      data-slot="table-row"
      data-state={state}
      {...props}
    />
  );
}

export function TableHead({
  className,
  ...props
}: React.ThHTMLAttributes<HTMLTableCellElement>) {
  return (
    <th
      className={cn(
        "px-4 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground",
        className,
      )}
      data-slot="table-head"
      {...props}
    />
  );
}

export function TableCell({
  className,
  ...props
}: React.TdHTMLAttributes<HTMLTableCellElement>) {
  return (
    <td
      className={cn("px-4 py-4 align-top text-sm leading-6", className)}
      data-slot="table-cell"
      {...props}
    />
  );
}

export function TableCaption({
  className,
  ...props
}: React.HTMLAttributes<HTMLTableCaptionElement>) {
  return (
    <caption
      className={cn(
        "border-t border-border/70 px-4 py-3 text-sm text-muted-foreground caption-bottom",
        className,
      )}
      data-slot="table-caption"
      {...props}
    />
  );
}
>>>>>>> 20be765 (feat: add competition operations overview scaffold)
