import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "./index.js";

const meta: Meta<typeof SelectTrigger> = {
  title: "Shared/Forms/Select",
  component: SelectTrigger,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="w-[360px]">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <span
            className="text-sm font-medium text-foreground"
            id="registration-status-label"
          >
            Registration status
          </span>
          <p
            className="text-sm text-muted-foreground"
            id="registration-status-description"
          >
            Keep this shared surface focused on bounded option lists, not search
            or async loading.
          </p>
        </div>
        <Select defaultValue="open">
          <SelectTrigger
            aria-describedby="registration-status-description registration-status-error"
            aria-labelledby="registration-status-label"
            {...args}
          >
            <SelectValue placeholder="Select a status" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Availability</SelectLabel>
              <SelectItem value="open">Open</SelectItem>
              <SelectItem value="waitlist">Waitlist</SelectItem>
              <SelectSeparator />
              <SelectItem disabled value="closed">
                Closed
              </SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
        {args.invalid ? (
          <p
            className="text-sm font-medium text-destructive"
            id="registration-status-error"
          >
            Pick a status before saving.
          </p>
        ) : null}
      </div>
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("combobox", {
      name: /registration status/i,
    });

    await userEvent.click(trigger);
    await expect(
      await within(canvasElement.ownerDocument.body).findByRole("option", {
        name: /waitlist/i,
      }),
    ).toBeVisible();
  },
};

export const Placeholder: Story = {
  render: (args) => (
    <div className="w-[360px]">
      <Select>
        <SelectTrigger aria-label="Court surface" {...args}>
          <SelectValue placeholder="Select a surface" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="indoor">Indoor</SelectItem>
          <SelectItem value="outdoor">Outdoor</SelectItem>
        </SelectContent>
      </Select>
    </div>
  ),
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};
