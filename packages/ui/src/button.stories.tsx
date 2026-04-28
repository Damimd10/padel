import type { Meta, StoryObj } from "@storybook/react";
import { expect, fn, userEvent, within } from "@storybook/test";
import { Button } from "./components/button.js";

const meta: Meta<typeof Button> = {
  title: "Shared/Actions/Button",
  component: Button,
  tags: ["autodocs"],
  args: {
    children: "Save changes",
    onClick: fn(),
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "secondary", "outline", "ghost"],
    },
    size: {
      control: "select",
      options: ["default", "sm", "lg", "icon"],
    },
  },
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvasElement }) => {
    const canvas = within(canvasElement);
    const button = canvas.getByRole("button", { name: /save changes/i });

    await userEvent.tab();
    await expect(button).toHaveFocus();
    await userEvent.click(button);
    await expect(args.onClick).toHaveBeenCalled();
  },
};

export const Secondary: Story = {
  args: {
    children: "Review registrations",
    variant: "secondary",
  },
};

export const Outline: Story = {
  args: {
    children: "Schedule matches",
    variant: "outline",
  },
};

export const Disabled: Story = {
  args: {
    children: "Publishing disabled",
    disabled: true,
  },
};
