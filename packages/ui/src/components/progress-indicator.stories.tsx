import type { Meta, StoryObj } from "@storybook/react";
import { ProgressIndicator } from "./progress-indicator.js";

const meta: Meta<typeof ProgressIndicator> = {
  title: "Shared/Data Display/Progress Indicator",
  component: ProgressIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Accessible shared progress feedback for operational workflows. Keep state calculation in feature code and pass already-shaped progress facts into the primitive.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const NumericProgress: Story = {
  render: () => (
    <ProgressIndicator
      className="w-[420px]"
      description="Nine of twelve registrations have a final review decision."
      label="Registration review"
      max={12}
      value={9}
      valueLabel="9 of 12 reviewed"
    />
  ),
};

export const WarningState: Story = {
  render: () => (
    <ProgressIndicator
      className="w-[420px]"
      description="Scheduling cannot finish until every result is validated."
      label="Result validation"
      max={18}
      tone="warning"
      value={12}
      valueLabel="6 matches still pending"
    />
  ),
};

export const CompleteState: Story = {
  render: () => (
    <ProgressIndicator
      className="w-[420px]"
      description="This shared primitive can sit inside richer app-level completion panels later."
      label="Division setup"
      max={5}
      tone="success"
      value={5}
      valueLabel="All 5 divisions confirmed"
    />
  ),
};
