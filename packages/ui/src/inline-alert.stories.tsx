import type { Meta, StoryObj } from "@storybook/react";
import { expect, within } from "@storybook/test";
import { Button } from "./components/button.js";
import {
  InlineAlert,
  InlineAlertActions,
  InlineAlertDescription,
  InlineAlertTitle,
} from "./components/inline-alert.js";

const meta = {
  title: "Shared/Feedback/Inline Alert",
  component: InlineAlert,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
    docs: {
      description: {
        component:
          "Persistent operational feedback for conditions that must remain visible near the affected workflow. Use `Inline Alert` for blocked, warning, success, or informational states that require context, explanation, or follow-up action. Prefer a toast only when the message is transient and the user can safely continue without keeping the message pinned on screen.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "blocked"],
    },
    density: {
      control: "select",
      options: ["default", "compact"],
    },
  },
  render: (args) => (
    <InlineAlert {...args}>
      <InlineAlertTitle variant={args.variant}>
        Registration review needs attention
      </InlineAlertTitle>
      <InlineAlertDescription data-variant={args.variant}>
        A participant is missing category evidence. Keep the message in flow
        until the reviewer resolves or overrides the issue.
      </InlineAlertDescription>
      <InlineAlertActions>
        <Button size="sm" variant="outline">
          Review evidence
        </Button>
        <Button size="sm" variant="ghost">
          Mark for follow-up
        </Button>
      </InlineAlertActions>
    </InlineAlert>
  ),
} satisfies Meta<typeof InlineAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Informational: Story = {
  args: {
    variant: "info",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Informational guidance keeps workflow context visible without interrupting the user or escalating urgency.",
      },
    },
  },
};

export const Blocked: Story = {
  args: {
    variant: "blocked",
  },
  parameters: {
    docs: {
      description: {
        story:
          "Blocked state uses assertive semantics and stronger visual weight because the workflow cannot safely continue.",
      },
    },
  },
};

export const VariantMatrix: Story = {
  render: () => (
    <div className="grid max-w-3xl gap-4">
      {(["info", "success", "warning", "blocked"] as const).map((variant) => (
        <InlineAlert key={variant} variant={variant}>
          <InlineAlertTitle variant={variant}>
            {variant === "info" && "Competition saved as draft"}
            {variant === "success" && "Registrant approved"}
            {variant === "warning" && "Division assignment still needs review"}
            {variant === "blocked" && "Bracket publication is blocked"}
          </InlineAlertTitle>
          <InlineAlertDescription data-variant={variant}>
            Storybook keeps severity semantics visible so app teams do not
            invent local alert markup for operational states.
          </InlineAlertDescription>
        </InlineAlert>
      ))}
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          "Reference matrix for the approved operational states: informational, success, warning, and blocked.",
      },
    },
  },
};

export const AccessibilitySemantics: Story = {
  args: {
    variant: "blocked",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("alert")).toBeInTheDocument();
    await expect(
      canvas.getByRole("heading", {
        name: /registration review needs attention/i,
      }),
    ).toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Blocked and warning alerts should use assertive semantics when the workflow is at risk; informational and success states can remain polite status messaging.",
      },
    },
  },
};
