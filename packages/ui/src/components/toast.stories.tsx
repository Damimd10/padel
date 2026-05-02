import type { Meta, StoryObj } from "@storybook/react";
import { expect, userEvent, within } from "@storybook/test";
import * as React from "react";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "./toast.js";

function ToastStoryDemo({
  variant = "info",
}: {
  variant?: "blocked" | "info" | "success" | "warning";
}) {
  const [open, setOpen] = React.useState(false);

  return (
    <ToastProvider>
      <button
        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-4 text-sm font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
        onClick={() => setOpen(true)}
        type="button"
      >
        Trigger toast
      </button>
      <Toast onOpenChange={setOpen} open={open} variant={variant}>
        <ToastTitle>
          {variant === "success" && "Result saved"}
          {variant === "info" && "Draft auto-saved"}
          {variant === "warning" && "Review queue still has pending pairs"}
          {variant === "blocked" && "Closure request cannot proceed"}
        </ToastTitle>
        <ToastDescription data-variant={variant}>
          Use transient feedback only when the user can continue without keeping
          the message pinned inside the workflow surface.
        </ToastDescription>
        <div className="mt-1 flex flex-wrap items-center gap-2">
          <ToastAction altText="Open details">Open details</ToastAction>
          <ToastClose />
        </div>
      </Toast>
      <ToastViewport />
    </ToastProvider>
  );
}

const meta = {
  title: "Shared/Feedback/Toast",
  component: Toast,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
    docs: {
      description: {
        component:
          "Transient operational feedback for lightweight confirmation or non-blocking attention cues. Use a toast when the message should be announced, then leave the screen clear. Do not use it as the only place for blocking failures, field corrections, or workflow rationale that must remain visible near the affected content.",
      },
    },
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["info", "success", "warning", "blocked"],
    },
  },
  render: (args) => <ToastStoryDemo variant={args.variant ?? "info"} />,
} satisfies Meta<typeof Toast>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Informational: Story = {
  args: {
    variant: "info",
  },
};

export const Success: Story = {
  args: {
    variant: "success",
  },
};

export const Warning: Story = {
  args: {
    variant: "warning",
  },
};

export const TriggerAndDismiss: Story = {
  args: {
    variant: "success",
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = within(canvasElement.ownerDocument.body);

    await userEvent.click(
      canvas.getByRole("button", { name: /trigger toast/i }),
    );

    await expect(body.getByText(/result saved/i)).toBeInTheDocument();

    await userEvent.click(
      body.getByRole("button", { name: /dismiss notification/i }),
    );

    await expect(body.queryByText(/result saved/i)).not.toBeInTheDocument();
  },
  parameters: {
    docs: {
      description: {
        story:
          "Interaction story covering transient announcement, package-owned portal rendering, and explicit dismissal.",
      },
    },
  },
};
