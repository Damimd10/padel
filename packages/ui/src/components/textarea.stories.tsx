import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Field } from "./field.js";
import { Textarea } from "./textarea.js";

const meta: Meta<typeof Textarea> = {
  title: "Shared/Forms/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  args: {
    placeholder: "Add referee notes or accessibility considerations",
    rows: 5,
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared multi-line text primitive that mirrors the Input styling contract while preserving native textarea behavior and accessibility semantics.",
      },
    },
  },
  render: (args) => <Textarea className="w-[320px]" {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const textarea = canvas.getByRole("textbox");

    await userEvent.tab();
    await expect(textarea).toHaveFocus();
  },
};

export const ReadOnly: Story = {
  args: {
    defaultValue:
      "Teams have requested a slower warm-up rotation due to limited court space.",
    readOnly: true,
  },
};

export const Disabled: Story = {
  args: {
    defaultValue:
      "Registration review is unavailable while imports are running.",
    disabled: true,
  },
};

export const InvalidLongContent: Story = {
  render: () => (
    <Field
      className="w-[320px]"
      description="Use this space for referee-only notes about scheduling constraints."
      error="Notes must stay under 280 characters so they fit on the review summary."
      label="Internal review notes"
    >
      <Textarea defaultValue="Captain asked to avoid late-evening matches because of junior training handoff logistics." />
    </Field>
  ),
};
