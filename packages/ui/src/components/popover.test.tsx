// @vitest-environment jsdom

import { cleanup, render, screen, waitFor } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Button } from "./button.js";
import { Popover, PopoverContent, PopoverTrigger } from "./popover.js";

beforeAll(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  cleanup();
});

describe("Popover", () => {
  it("renders content through the shared overlay boundary and closes on escape", async () => {
    render(
      <Popover>
        <PopoverTrigger asChild>
          <Button>Review checklist</Button>
        </PopoverTrigger>
        <PopoverContent>
          Confirm the registration window is closed.
        </PopoverContent>
      </Popover>,
    );

    const trigger = screen.getByRole("button", { name: /review checklist/i });

    await userEvent.click(trigger);

    const content = await screen.findByText(
      /confirm the registration window is closed/i,
    );

    expect(document.body.contains(content)).toBe(true);
    expect(trigger.parentElement?.contains(content)).toBe(false);

    await userEvent.keyboard("{Escape}");

    await waitFor(() => {
      expect(
        screen.queryByText(/confirm the registration window is closed/i),
      ).toBeNull();
    });
  });
});
