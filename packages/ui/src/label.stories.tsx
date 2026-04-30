import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Input } from "./components/input.js";
import { Label } from "./components/label.js";

const meta: Meta<typeof Label> = {
  title: "Shared/Forms/Label",
  component: Label,
  tags: ["autodocs"],
  args: {
    children: "Competition name",
    htmlFor: "competition-name",
  },
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Shared form label primitive for associating reusable controls in packages/ui. It stays generic and does not own app-specific form workflows.",
      },
    },
  },
  render: (args) => (
    <div className="grid w-[320px] gap-3">
      <Label {...args} />
      <Input id="competition-name" placeholder="Club championship" />
    </div>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const input = canvas.getByRole("textbox", { name: /competition name/i });

    await userEvent.click(canvas.getByText(/competition name/i));
    await expect(input).toHaveFocus();
  },
};

export const InvalidAssociation: Story = {
  args: {
    "data-invalid": true,
    children: "Team captain email",
    htmlFor: "captain-email",
  },
  render: (args) => (
    <div className="grid w-[320px] gap-3">
      <Label {...args} />
      <Input
        aria-describedby="captain-email-error"
        aria-invalid="true"
        id="captain-email"
        placeholder="captain@club.com"
      />
      <p
        className="text-sm font-medium text-destructive"
        id="captain-email-error"
      >
        Enter a valid email address.
      </p>
    </div>
  ),
};

export const LongTextWrap: Story = {
  args: {
    children:
      "Additional competition notes for organizers and referees reviewing registrations",
    htmlFor: "competition-notes",
  },
  render: (args) => (
    <div className="grid w-[320px] gap-3">
      <Label {...args} />
      <Input id="competition-notes" placeholder="Internal summary" />
    </div>
  ),
};
