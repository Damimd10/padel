import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./components/badge.js";

const meta: Meta<typeof Badge> = {
  title: "Shared/Feedback/Badge",
  component: Badge,
  tags: ["autodocs"],
  args: {
    children: "Open registrations",
    variant: "default",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline"],
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A lightweight shared label for compact metadata and non-domain feedback. Keep meanings in text and avoid treating badge color alone as status communication.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <Badge variant="default">Active court</Badge>
      <Badge variant="secondary">Needs review</Badge>
      <Badge variant="outline">Draft fixture</Badge>
    </div>
  ),
};

export const LongLabel: Story = {
  args: {
    children: "Registration window closes after seeded division review",
    className: "max-w-72 whitespace-normal",
  },
};

export const InContext: Story = {
  render: () => (
    <div className="flex items-center gap-3 rounded-xl border border-border/80 bg-background px-4 py-3">
      <Badge variant="secondary">Awaiting payment</Badge>
      <p className="text-sm text-muted-foreground">
        The label carries the meaning while the color only reinforces it.
      </p>
    </div>
  ),
};
