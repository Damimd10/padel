// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  toastVariants,
} from "./toast.js";

beforeAll(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;

  if (!Element.prototype.hasPointerCapture) {
    Element.prototype.hasPointerCapture = () => false;
  }

  if (!Element.prototype.releasePointerCapture) {
    Element.prototype.releasePointerCapture = () => undefined;
  }

  if (!Element.prototype.setPointerCapture) {
    Element.prototype.setPointerCapture = () => undefined;
  }
});

afterEach(() => {
  cleanup();
});

describe("Toast", () => {
  it("renders transient package-local feedback without router or mutation coupling", async () => {
    const onOpenChange = vi.fn();
    render(
      <ToastProvider>
        <Toast
          defaultOpen
          duration={60_000}
          onOpenChange={onOpenChange}
          variant="success"
        >
          <ToastTitle>Results saved</ToastTitle>
          <ToastDescription>
            Semifinal progression was recalculated successfully.
          </ToastDescription>
          <ToastAction altText="Review standings">Review standings</ToastAction>
          <ToastClose />
        </Toast>
        <ToastViewport />
      </ToastProvider>,
    );

    const title = await screen.findByText(/results saved/i);
    const toastItem = title.closest('[data-slot="toast"]');

    expect(toastItem).not.toBeNull();
    expect(document.body.contains(toastItem)).toBe(true);

    expect(
      screen.getByRole("button", { name: /review standings/i }),
    ).not.toBeNull();

    await userEvent.click(
      screen.getByRole("button", { name: /dismiss notification/i }),
    );

    await waitFor(() => {
      expect(onOpenChange).toHaveBeenCalledWith(false);
    });
  });

  it("supports the approved operational variants", () => {
    expect(toastVariants({ variant: "info" })).toContain("bg-background/95");
    expect(toastVariants({ variant: "success" })).toContain("bg-secondary");
    expect(toastVariants({ variant: "warning" })).toContain("bg-accent");
    expect(toastVariants({ variant: "blocked" })).toContain(
      "bg-destructive/10",
    );
  });
});
