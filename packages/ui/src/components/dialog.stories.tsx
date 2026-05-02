import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../index.js";

const meta = {
  title: "Shared/Overlays/Dialog",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared modal dialog surface for package-owned overlays. Focus should move into the dialog on open, `Escape` should dismiss it, and focus should return to the trigger on close. No shared Storybook preview decorator is required because the content surface owns its portal behavior internally.",
      },
    },
  },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger asChild>
        <Button variant="outline">Review closure readiness</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Closure readiness</DialogTitle>
          <DialogDescription>
            Confirm blocked registrations before publishing the final bracket.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Keep reviewing</Button>
          </DialogClose>
          <Button>Publish bracket</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
} satisfies Meta<typeof Dialog>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default closed state. Only the trigger is visible until the user explicitly opens the dialog.",
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
          "Open state documentation for content layout, dismissal affordances, and focus-managed modal presentation.",
      },
    },
  },
};

export const FocusAndKeyboard: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Interaction check for keyboard-first usage: opening from the trigger, moving focus into the overlay, and closing with `Escape` while returning focus to the trigger.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", {
      name: /review closure readiness/i,
    });

    await userEvent.click(trigger);

    await expect(
      body.getByRole("heading", { name: /closure readiness/i }),
    ).toBeInTheDocument();
    await expect(canvasElement.ownerDocument.activeElement).not.toBe(trigger);

    await userEvent.keyboard("{Escape}");

    await expect(
      body.queryByRole("heading", { name: /closure readiness/i }),
    ).not.toBeInTheDocument();
    await expect(trigger).toHaveFocus();
  },
};
