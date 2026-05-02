import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Field } from "./field.js";
import { Input } from "./input.js";
import { Textarea } from "./textarea.js";

const meta: Meta<typeof Field> = {
  title: "Shared/Forms/Field",
  component: Field,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Thin composition helper for shared accessibility wiring around reusable controls. It standardizes label, description, error, and ARIA relationships without owning TanStack Form state or validation logic.",
      },
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const DefaultComposition: Story = {
  render: () => (
    <Field
      className="w-[320px]"
      description="Visible to captains and organizers before fixtures are published."
      label="Competition name"
      required
    >
      <Input placeholder="Spring doubles ladder" />
    </Field>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /competition name/i });

    await expect(input).toHaveAttribute(
      "aria-describedby",
      expect.stringContaining("description"),
    );
  },
};

export const WithValidationMessage: Story = {
  render: () => (
    <Field
      className="w-[320px]"
      description="Include the surface and any mobility support notes for officials."
      error="Add at least 20 characters so the operations team has enough detail."
      label="Venue notes"
    >
      <Textarea defaultValue="Ramp" />
    </Field>
  ),
};

export const DisabledControl: Story = {
  render: () => (
    <Field
      className="w-[320px]"
      description="This value is synced from the approved competition template."
      label="Default point format"
    >
      <Input disabled value="Best of three tie-break sets" />
    </Field>
  ),
};
