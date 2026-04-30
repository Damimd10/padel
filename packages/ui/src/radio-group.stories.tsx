import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import { RadioGroup, RadioGroupItem } from "./components/radio-group.js";

const meta: Meta<typeof RadioGroup> = {
  title: "Shared/Forms/Radio Group",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <div className="w-[380px]">
      <div className="grid gap-2">
        <div className="grid gap-1">
          <span
            className="text-sm font-medium text-foreground"
            id="competition-format-label"
          >
            Competition format
          </span>
          <p className="text-sm text-muted-foreground">
            Use visible single-choice controls when format differences need
            quick review.
          </p>
        </div>
        <RadioGroup
          aria-labelledby="competition-format-label"
          {...args}
          className="gap-3"
        >
          {[
            ["round-robin", "Round robin"],
            ["single-elimination", "Single elimination"],
            ["group-stage", "Group stage + knockout"],
          ].map(([value, label], index) => (
            <div
              className="flex items-center gap-3 rounded-lg border border-border bg-white/60 px-4 py-3"
              key={value}
            >
              <RadioGroupItem
                aria-labelledby={`${value}-label`}
                disabled={args.disabled && index === 2}
                invalid={args.invalid}
                value={value}
              />
              <span
                className="text-sm font-medium text-foreground"
                id={`${value}-label`}
              >
                {label}
              </span>
            </div>
          ))}
        </RadioGroup>
        {args.invalid ? (
          <p className="text-sm font-medium text-destructive">
            Choose a format before continuing.
          </p>
        ) : null}
      </div>
    </div>
  ),
  args: {
    defaultValue: "round-robin",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const group = canvas.getByRole("radiogroup", {
      name: /competition format/i,
    });

    await userEvent.click(
      within(group).getByRole("radio", { name: /single elimination/i }),
    );

    await expect(
      within(group).getByRole("radio", { name: /single elimination/i }),
    ).toBeChecked();
  },
};

export const DisabledOption: Story = {
  args: {
    disabled: true,
  },
};

export const Invalid: Story = {
  args: {
    defaultValue: undefined,
    invalid: true,
  },
};
