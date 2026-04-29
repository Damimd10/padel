import type { Meta, StoryObj } from "@storybook/react";
import { Card, CardContent, CardHeader } from "./components/card.js";
import { Skeleton } from "./components/skeleton.js";

const meta: Meta<typeof Skeleton> = {
  title: "Shared/Feedback/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A decorative loading placeholder. Pair it with separate loading text or container semantics when assistive technologies need explicit progress information.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <Skeleton aria-hidden="true" className="h-4 w-56" />,
};

export const TextGroup: Story = {
  render: () => (
    <div className="w-72 space-y-2">
      <Skeleton aria-hidden="true" className="h-4 w-3/4" />
      <Skeleton aria-hidden="true" className="h-4 w-full" />
      <Skeleton aria-hidden="true" className="h-4 w-5/6" />
    </div>
  ),
};

export const CardPlaceholder: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader className="space-y-3">
        <Skeleton aria-hidden="true" className="h-5 w-40" />
        <Skeleton aria-hidden="true" className="h-4 w-56" />
      </CardHeader>
      <CardContent className="space-y-3">
        <Skeleton aria-hidden="true" className="h-16 w-full rounded-lg" />
        <div className="grid grid-cols-2 gap-3">
          <Skeleton aria-hidden="true" className="h-4 w-full" />
          <Skeleton aria-hidden="true" className="h-4 w-full" />
        </div>
      </CardContent>
    </Card>
  ),
};
