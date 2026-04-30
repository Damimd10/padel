import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { Checkbox } from "./components/checkbox.js";

const meta: Meta<typeof Checkbox> = {
  title: "Shared/Forms/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="w-[380px]">
      <div className="rounded-lg border border-border bg-white/60 p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            aria-describedby="publish-results-description publish-results-error"
            aria-labelledby="publish-results-label"
            {...args}
          />
          <div className="grid gap-1.5">
            <span
              className="text-sm font-medium text-foreground"
              id="publish-results-label"
            >
              Publish results immediately
            </span>
            <p
              className="text-sm text-muted-foreground"
              id="publish-results-description"
            >
              Use this when the draw is final and players should see standings
              right away.
            </p>
            {args.invalid ? (
              <p
                className="text-sm font-medium text-destructive"
                id="publish-results-error"
              >
                You must confirm before publishing.
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  ),
  args: {
    defaultChecked: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const checkbox = canvas.getByRole("checkbox", {
      name: /publish results immediately/i,
    });

    await userEvent.click(checkbox);
    await expect(checkbox).toBeChecked();
  },
};

export const Checked: Story = {
  args: {
    checked: true,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    invalid: true,
  },
};
