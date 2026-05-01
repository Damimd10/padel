import type { Meta, StoryObj } from "@storybook/react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableEmptyState,
  TableHead,
  TableHeader,
  TableRow,
  TableRowHeader,
} from "./components/table.js";

const meta: Meta<typeof Table> = {
  title: "Shared/Data Display/Table",
  component: Table,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component: `
Purpose
Semantic table foundations for dense operational views in admin-heavy workflows.

When to use
Use this shared surface when rows and columns already exist in product language and app code can shape the data before rendering.

When not to use
Do not push sorting, filtering, pagination, route state, mutations, or workflow-specific action orchestration into this API. Compose those concerns outside \`packages/ui\`.

Accessibility behavior
Tables remain real tables, column headers default to \`scope="col"\`, row headers default to \`scope="row"\`, and selected rows expose \`aria-selected\` so state is not color-only.

Composition guidance
Keep the foundation presentational. Use row-state styling and empty-state composition here, then layer query state, bulk actions, and feature-owned controls in application code.

Known misuse patterns
Avoid turning this into a generic data-grid abstraction or adding boolean flags for every workflow mode.
        `.trim(),
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="overflow-x-auto rounded-[1.6rem] border border-border/80 bg-card p-3 shadow-sm">
      <Table className="min-w-[760px]">
        <TableCaption>
          Dense operational table foundation with stable shared semantics.
        </TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Competition</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Missing items</TableHead>
            <TableHead>Last reviewed</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableRowHeader>Autumn League A</TableRowHeader>
            <TableCell>Ready for publication</TableCell>
            <TableCell>0</TableCell>
            <TableCell>Today, 14:10</TableCell>
          </TableRow>
          <TableRow>
            <TableRowHeader>Junior Open</TableRowHeader>
            <TableCell>Review in progress</TableCell>
            <TableCell>2 waivers</TableCell>
            <TableCell>12 minutes ago</TableCell>
          </TableRow>
          <TableRow>
            <TableRowHeader>Club Championship</TableRowHeader>
            <TableCell>Awaiting final seeding</TableCell>
            <TableCell>1 category confirmation</TableCell>
            <TableCell>32 minutes ago</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const RowStates: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use text inside the cells to explain operational meaning. Row color reinforces state but should never be the only signal.",
      },
    },
  },
  render: () => (
    <div className="overflow-x-auto rounded-[1.6rem] border border-border/80 bg-card p-3 shadow-sm">
      <Table className="min-w-[820px]">
        <TableHeader>
          <TableRow>
            <TableHead>Registration</TableHead>
            <TableHead>Operational state</TableHead>
            <TableHead>Reviewer note</TableHead>
            <TableHead>Next action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow state="selected">
            <TableRowHeader>Pair 04</TableRowHeader>
            <TableCell>Selected</TableCell>
            <TableCell>Included in the active bulk-approval set.</TableCell>
            <TableCell>Confirm supporting documents.</TableCell>
          </TableRow>
          <TableRow state="warning">
            <TableRowHeader>Pair 12</TableRowHeader>
            <TableCell>Warning</TableCell>
            <TableCell>Medical waiver expires before match week.</TableCell>
            <TableCell>Request updated attachment.</TableCell>
          </TableRow>
          <TableRow state="invalid">
            <TableRowHeader>Pair 18</TableRowHeader>
            <TableCell>Invalid</TableCell>
            <TableCell>
              Category assignment conflicts with age bracket.
            </TableCell>
            <TableCell>Return to organizer for correction.</TableCell>
          </TableRow>
          <TableRow state="completed">
            <TableRowHeader>Pair 21</TableRowHeader>
            <TableCell>Completed</TableCell>
            <TableCell>
              Verification and payment review are both closed.
            </TableCell>
            <TableCell>No action required.</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};

export const EmptyTable: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Use the shared empty row for absent data, but keep retry logic, filters, and loading orchestration in feature code.",
      },
    },
  },
  render: () => (
    <div className="overflow-x-auto rounded-[1.6rem] border border-border/80 bg-card p-3 shadow-sm">
      <Table className="min-w-[760px]">
        <TableHeader>
          <TableRow>
            <TableHead>Division</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Registrations</TableHead>
            <TableHead>Owner</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow>
            <TableEmptyState
              colSpan={4}
              description="This empty row documents the presentational state only. Feature modules should decide whether the absence comes from filters, permissions, or not-yet-created data."
              eyebrow="Empty table"
              title="No divisions match the current review scope"
            />
          </TableRow>
        </TableBody>
      </Table>
    </div>
  ),
};
