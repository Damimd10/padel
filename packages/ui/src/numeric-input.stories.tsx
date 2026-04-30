import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Field } from "./components/field.js";
import { NumericInput } from "./components/numeric-input.js";

const meta: Meta<typeof NumericInput> = {
  title: "Shared/Forms/Numeric Input",
  component: NumericInput,
  tags: ["autodocs"],
  args: {
    min: 1,
    placeholder: "16",
    step: 1,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared numeric entry primitive for bounded counts, scores, and ordering values. It keeps native number semantics while preserving the shared invalid, disabled, and read-only styling contract.",
      },
    },
  },
  render: (args) => <NumericInput className="w-[220px]" {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("spinbutton");

    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};

export const DecimalStep: Story = {
  args: {
    defaultValue: 4.5,
    placeholder: "4.5",
    step: 0.5,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue: 32,
    disabled: true,
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue: 24,
    readOnly: true,
  },
};

export const Invalid: Story = {
  render: () => (
    <Field
      className="w-[220px]"
      description="Use the seeded draw size approved by operations."
      error="Player count must be at least 4 and divisible by 2."
      label="Player count"
      required
    >
      <NumericInput defaultValue={3} min={4} step={2} />
    </Field>
  ),
};
