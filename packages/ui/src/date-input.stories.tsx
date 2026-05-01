import type { Meta, StoryObj } from "@storybook/react";
import { expect } from "@storybook/test";
import { DatePicker } from "./components/date-picker.js";
import { Field } from "./components/field.js";

const meta: Meta<typeof DatePicker> = {
  title: "Shared/Forms/Date Picker",
  component: DatePicker,
  tags: ["autodocs"],
  args: {
    defaultValue: new Date(2026, 4, 10),
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared single-date picker built with the package's field, popover, and calendar primitives. It follows shadcn-style composition while using the current design-system styling contract.",
      },
    },
  },
  render: (args) => <DatePicker className="w-[240px]" {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole("textbox");
    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Invalid: Story = {
  render: () => (
    <Field
      className="w-[240px]"
      description="Use the first match-ready date confirmed with the venue."
      error="Start date cannot be earlier than the registration close date."
      label="Competition start date"
      required
    >
      <DatePicker defaultValue={new Date(2026, 4, 2)} />
    </Field>
  ),
};
