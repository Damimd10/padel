import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { DateRangePicker } from "./components/date-range-picker.js";
import { Field } from "./components/field.js";

const meta: Meta<typeof DateRangePicker> = {
  title: "Shared/Forms/Date Range Picker",
  component: DateRangePicker,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared paired-date picker for start and end windows. It follows shadcn's range-picker interaction model while keeping the visual and accessibility contract inside the current design system.",
      },
    },
  },
  render: (args) => (
    <DateRangePicker
      className="w-[360px]"
      defaultValue={{
        from: new Date(2026, 4, 1),
        to: new Date(2026, 4, 12),
      }}
      {...args}
    />
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const trigger = canvas.getByRole("button", { name: /may 01, 2026/i });

    await userEvent.tab();
    await expect(trigger).toHaveFocus();
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
      className="w-[420px]"
      description="Keep these values as local date boundaries and let the feature form own any cross-field validation rules."
      error="Registration end date must be on or after the start date."
      label="Registration window"
      required
    >
      <DateRangePicker
        defaultValue={{
          from: new Date(2026, 4, 10),
          to: new Date(2026, 4, 8),
        }}
      />
    </Field>
  ),
};
