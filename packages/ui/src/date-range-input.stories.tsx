import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { DateRangeInput } from "./components/date-range-input.js";
import { Field } from "./components/field.js";

const meta: Meta<typeof DateRangeInput> = {
  title: "Shared/Forms/Date Range Input",
  component: DateRangeInput,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared paired-date surface for start and end windows. It keeps paired calendar fields inside one reusable contract so feature forms can map range values into TanStack Form without rebuilding accessibility and validation wiring.",
      },
    },
  },
  render: (args) => (
    <DateRangeInput
      className="w-[360px]"
      endProps={{ defaultValue: "2026-05-12", name: "endDate" }}
      startProps={{ defaultValue: "2026-05-01", name: "startDate" }}
      {...args}
    />
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const start = canvas.getByLabelText(/start date/i);

    await userEvent.tab();
    await expect(start).toHaveFocus();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
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
      <DateRangeInput
        endProps={{ defaultValue: "2026-05-08", name: "endDate" }}
        startProps={{ defaultValue: "2026-05-10", name: "startDate" }}
      />
    </Field>
  ),
};
