import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "./components/badge.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./components/card.js";
import { Separator } from "./components/separator.js";

const meta: Meta<typeof Card> = {
  title: "Shared/Layout/Card",
  component: Card,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "A structural surface for grouping related content. Use composition helpers to organize layout, but keep workflow-specific card behavior in app space.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Card className="w-[360px]">
      <CardHeader>
        <CardTitle>Match scheduling</CardTitle>
        <CardDescription>
          Keep shared cards focused on hierarchy and spacing rather than
          workflow logic.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Approved fixtures can be grouped, reviewed, and handed off for richer
          app-level composition later.
        </p>
      </CardContent>
    </Card>
  ),
};

export const WithFooter: Story = {
  render: () => (
    <Card className="w-[380px]">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="space-y-1.5">
            <CardTitle>Registration health</CardTitle>
            <CardDescription>
              Shared layout primitives should remain useful even as product
              workflows evolve.
            </CardDescription>
          </div>
          <Badge variant="secondary">Review ready</Badge>
        </div>
      </CardHeader>
      <Separator />
      <CardContent className="pt-6">
        <div className="grid gap-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Pending approvals</span>
            <span className="font-medium">12</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Seeded divisions</span>
            <span className="font-medium">4</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="justify-between border-t border-border/70 pt-4">
        <span className="text-sm text-muted-foreground">
          Updated 5 minutes ago
        </span>
        <Badge variant="outline">Shared primitive</Badge>
      </CardFooter>
    </Card>
  ),
};

export const DenseLayout: Story = {
  render: () => (
    <Card className="w-[340px]">
      <CardHeader className="gap-1 px-4 py-4">
        <CardTitle className="text-base">Compact panel</CardTitle>
        <CardDescription className="text-xs">
          Density can be handled with composition classes instead of a dedicated
          variant prop.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-4 pb-4">
        <div className="grid gap-2 text-sm">
          <p>Three concise rows of information.</p>
          <p className="text-muted-foreground">No extra API surface needed.</p>
        </div>
      </CardContent>
    </Card>
  ),
};
