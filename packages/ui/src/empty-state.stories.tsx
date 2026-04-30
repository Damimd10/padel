import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "./components/button.js";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateEyebrow,
  EmptyStateTitle,
} from "./components/empty-state.js";

const meta = {
  title: "Shared/Feedback/Empty State",
  component: EmptyState,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Empty-state surface for workflow gaps, not generic decoration. Use it when a section has no records, when a process has not started yet, or when a blocked prerequisite leaves the user with nothing useful to scan. Keep routing and data-fetch ownership outside the shared component and compose local actions into the provided action slot.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "blocked"],
    },
    size: {
      control: "select",
      options: ["default", "compact"],
    },
  },
  render: (args) => (
    <EmptyState {...args}>
      <EmptyStateEyebrow>Category scheduling</EmptyStateEyebrow>
      <EmptyStateTitle>No approved pairs available yet</EmptyStateTitle>
      <EmptyStateDescription data-variant={args.variant}>
        Empty states should explain why the section is empty and what the
        operator can do next, especially in dense administrative workflows.
      </EmptyStateDescription>
      <EmptyStateActions>
        <Button variant="outline">Review registrations</Button>
        <Button variant="ghost">Open import guide</Button>
      </EmptyStateActions>
    </EmptyState>
  ),
} satisfies Meta<typeof EmptyState>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: "info",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Warning empty states are useful when a list is empty because a review or setup step remains incomplete, but the workflow is not fully blocked.",
      },
    },
  },
};

export const Blocked: Story = {
  args: {
    variant: "blocked",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Blocked empty states should make the missing prerequisite explicit rather than leaving the user with a blank surface and no explanation.",
      },
    },
  },
};

export const Compact: Story = {
  args: {
    size: "compact",
    variant: "success",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Compact mode works inside cards, side panels, and dense operational modules where the default layout would be too spacious.",
      },
    },
  },
};
