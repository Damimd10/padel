import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  Button,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../index.js";

const meta = {
  title: "Shared/Overlays/Tooltip",
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared tooltip surface for non-blocking hints. Keyboard users should receive the same contextual help on focus as pointer users get on hover, with the tooltip remaining non-interactive and package-owned.",
      },
    },
  },
  render: (args) => (
    <TooltipProvider delayDuration={0}>
      <Tooltip {...args}>
        <TooltipTrigger asChild>
          <Button variant="ghost">Why is publishing disabled?</Button>
        </TooltipTrigger>
        <TooltipContent>
          Finish category assignments before publishing the bracket.
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ),
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Closed: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Default resting state with no tooltip content mounted until focus or hover occurs.",
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
          "Open state documentation for the non-blocking informational hint surface.",
      },
    },
  },
};

export const FocusHint: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Keyboard-focused example showing that tooltip guidance is available on focus, not only on hover.",
      },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole("button", {
      name: /why is publishing disabled/i,
    });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
    await expect(
      body.getByText(/finish category assignments before publishing/i),
    ).toBeVisible();

    await userEvent.tab();

    await expect(
      body.queryByText(/finish category assignments before publishing/i),
    ).not.toBeInTheDocument();
  },
};
