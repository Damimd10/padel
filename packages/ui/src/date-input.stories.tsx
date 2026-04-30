import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent } from "@storybook/test";
import { DateInput } from "./components/date-input.js";
import { Field } from "./components/field.js";

const meta: Meta<typeof DateInput> = {
  title: "Shared/Forms/Date Input",
  component: DateInput,
  tags: ["autodocs"],
  args: {
    defaultValue: "2026-05-10",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared single-date primitive for native calendar-date entry. It stays intentionally close to browser date semantics while preserving the package's field, validation, and read-only conventions.",
      },
    },
  },
  render: (args) => <DateInput className="w-[240px]" {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const input = canvasElement.querySelector('input[type="date"]');
    if (!input) {
      throw new Error("Expected date input to render");
    }

    await userEvent.tab();
    await expect(input).toHaveFocus();
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
      className="w-[240px]"
      description="Use the first match-ready date confirmed with the venue."
      error="Start date cannot be earlier than the registration close date."
      label="Competition start date"
      required
    >
      <DateInput defaultValue="2026-05-02" />
    </Field>
  ),
};
