import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Switch } from "./switch.js";

const meta: Meta<typeof Switch> = {
  title: "Shared/Forms/Switch",
  component: Switch,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="w-[380px]">
      <div className="flex items-center justify-between gap-6 rounded-lg border border-border bg-white/60 px-4 py-3">
        <div className="grid gap-1">
          <span
            className="text-sm font-medium text-foreground"
            id="rankings-enabled-label"
          >
            Enable live rankings
          </span>
          <p
            className="text-sm text-muted-foreground"
            id="rankings-enabled-description"
          >
            Use a switch for immediate binary settings, not multi-step
            confirmations.
          </p>
        </div>
        <Switch
          aria-describedby="rankings-enabled-description"
          aria-labelledby="rankings-enabled-label"
          {...args}
        />
      </div>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const toggle = canvas.getByRole("switch", {
      name: /enable live rankings/i,
    });

    await userEvent.click(toggle);
    await expect(toggle).toBeChecked();
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
