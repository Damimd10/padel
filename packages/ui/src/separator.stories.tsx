import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "./components/separator.js";

const meta: Meta<typeof Separator> = {
  title: "Shared/Layout/Separator",
  component: Separator,
  tags: ["autodocs"],
  args: {
    decorative: true,
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "inline-radio",
      options: ["horizontal", "vertical"],
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A low-emphasis divider for grouping related content. Prefer decorative usage unless the separator conveys document structure.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Horizontal: Story = {
  render: (args) => (
    <div className="w-80 space-y-3">
      <p className="text-sm font-medium">Court assignments</p>
      <Separator {...args} />
      <p className="text-sm text-muted-foreground">
        Use separators to clarify relationships, not to compensate for missing
        spacing.
      </p>
    </div>
  ),
};

export const Vertical: Story = {
  args: {
    orientation: "vertical",
  },
  render: (args) => (
    <div className="flex h-12 items-center gap-4">
      <span className="text-sm">Overview</span>
      <Separator {...args} />
      <span className="text-sm text-muted-foreground">Round robin</span>
      <Separator {...args} />
      <span className="text-sm text-muted-foreground">Playoffs</span>
    </div>
  ),
};
