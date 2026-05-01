import type { Meta, StoryObj } from "@storybook/react";
import { KeyValueSummaryBlock } from "./components/key-value-summary-block.js";

const meta: Meta<typeof KeyValueSummaryBlock> = {
  title: "Shared/Data Display/Key-Value Summary Block",
  component: KeyValueSummaryBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Grouped summary facts for admin-heavy panels where labels and values need stronger hierarchy than an inline metadata strip.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <KeyValueSummaryBlock
      className="w-[760px] max-w-full"
      description="Use shared summary blocks for presentational facts, then compose workflow actions around them in app space."
      heading="Competition overview"
      items={[
        {
          label: "Registration status",
          value: "Review in progress",
          description:
            "Three participants still need manual category confirmation.",
          tone: "warning",
        },
        {
          label: "Approved pairs",
          value: "18",
          description: "Ready for draw generation once waivers are complete.",
        },
        {
          label: "Payment exceptions",
          value: "2",
          description: "Flagged for organizer follow-up.",
          tone: "danger",
        },
        {
          label: "Last reviewed",
          value: "Today, 14:10",
          description: "Synced from the review queue summary.",
          tone: "muted",
        },
      ]}
    />
  ),
};

export const ThreeColumnLayout: Story = {
  render: () => (
    <KeyValueSummaryBlock
      className="w-[860px] max-w-full"
      columns={3}
      heading="Operations footprint"
      items={[
        { label: "Main draw", value: "16 pairs" },
        { label: "Qualifying", value: "8 pairs" },
        { label: "Reserve list", value: "5 pairs" },
        { label: "Guaranteed courts", value: "4" },
        { label: "Confirmed officials", value: "3" },
        { label: "Medical support", value: "Pending", tone: "warning" },
      ]}
    />
  ),
};

export const MissingValueState: Story = {
  render: () => (
    <KeyValueSummaryBlock
      className="w-[720px] max-w-full"
      heading="Registration exception"
      items={[
        { label: "Review owner", value: "Lucia Perez" },
        { label: "Escalation reason" },
        { label: "Supporting evidence", value: "Awaiting player response" },
      ]}
    />
  ),
};
