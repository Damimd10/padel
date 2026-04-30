// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { Button } from "./button.js";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./tooltip.js";

beforeAll(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  cleanup();
});

describe("Tooltip", () => {
  it("shows helper text from keyboard focus without app-level setup", async () => {
    render(
      <TooltipProvider delayDuration={0}>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button>Why is this locked?</Button>
          </TooltipTrigger>
          <TooltipContent>
            Registrations stay locked until every division has a court
            assignment.
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>,
    );

    await userEvent.tab();

    const trigger = screen.getByRole("button", { name: /why is this locked/i });

    expect(document.activeElement).toBe(trigger);

    const tooltip = await screen.findByRole("tooltip");

    expect(tooltip.textContent).toContain(
      "Registrations stay locked until every division has a court assignment.",
    );
  });
});
