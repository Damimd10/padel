import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Field } from "./field.js";
import { Input } from "./input.js";

const meta: Meta<typeof Input> = {
  title: "Shared/Forms/Input",
  component: Input,
  tags: ["autodocs"],
  args: {
    placeholder: "Club championship",
    type: "text",
  },
  argTypes: {
    type: {
      control: "select",
      options: ["text", "email", "password", "number", "search"],
    },
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared text input primitive aligned with the package token system, with native prop passthrough and accessibility-ready invalid, disabled, and read-only states.",
      },
    },
  },
  render: (args) => <Input className="w-[320px]" {...args} />,
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox");

    await userEvent.tab();
    await expect(input).toHaveFocus();
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
    value: "Registration locked after bracket publication",
  },
};

export const ReadOnly: Story = {
  args: {
    readOnly: true,
    value: "Assigned automatically from verified profile data",
  },
};

export const Invalid: Story = {
  render: () => (
    <Field
      className="w-[320px]"
      description="We use this address for approval and scheduling updates."
      error="Enter a valid team captain email."
      label="Team captain email"
      required
    >
      <Input placeholder="captain@club.com" type="email" />
    </Field>
  ),
};
