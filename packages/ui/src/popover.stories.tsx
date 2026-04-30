import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Button, Popover, PopoverContent, PopoverTrigger } from "./index.js";

const meta = {
  title: "Shared/Overlays/Popover",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared non-modal overlay for contextual actions and supporting information. The package-owned content surface should keep portal and layering concerns inside `packages/ui`, while keyboard dismissal still returns focus predictably to the trigger.",
      },
    },
  },
  render: (args) => (
    <Popover {...args}>
      <PopoverTrigger asChild>
        <Button variant="outline">Inspect category rules</Button>
      </PopoverTrigger>
      <PopoverContent>
        <div className="space-y-2">
          <h3 className="text-sm font-semibold">Category rules</h3>
          <p className="text-sm text-muted-foreground">
            Registrations stay blocked until age-group validation is complete.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  ),
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  parameters: {
    docs: {
      description: {
        story: "Closed trigger-only state for the contextual overlay surface.",
      },
    },
  },
};

export const Open: Story = {
  args: {
    defaultOpen: true,
  },
  parameters: {
    docs: {
      description: {
        story:
          "Open state documentation for layered content that stays generic and reusable across consuming apps.",
      },
    },
  },
};

export const KeyboardDismissal: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard interaction check for open and dismiss behavior without pushing portal concerns into consumers.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", {
      name: /inspect category rules/i,
    });

    await userEvent.click(trigger);

    await expect(body.getByText(/registrations stay blocked/i)).toBeVisible();

    await userEvent.keyboard("{Escape}");

    await expect(
      body.queryByText(/registrations stay blocked/i),
    ).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};
