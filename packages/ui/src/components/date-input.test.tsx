// @vitest-environment jsdom

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { DateInput } from "./date-input.js";
import { DatePicker } from "./date-picker.js";

beforeAll(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  cleanup();
});

describe("DatePicker", () => {
  it("keeps DateInput as a compatibility alias", () => {
    expect(DateInput).toBe(DatePicker);
  });

  it("renders a shared date-picker field with canonical form submission support", () => {
    const markup = renderToStaticMarkup(
      <DatePicker
        defaultValue={new Date(2026, 4, 3)}
        id="competition-start-date"
        name="competitionStartDate"
      />,
    );

    expect(markup).toContain('id="competition-start-date"');
    expect(markup).toContain('data-slot="date-picker"');
    expect(markup).toContain('type="hidden"');
    expect(markup).toContain('value="2026-05-03"');
  });

  it("updates the visible and submitted values from text entry and opens the calendar from the keyboard", async () => {
    render(
      <DatePicker
        defaultValue={new Date(2026, 4, 3)}
        name="competitionStartDate"
      />,
    );

    const input = screen.getByRole("textbox");
    const hiddenInput = document.querySelector(
      'input[name="competitionStartDate"]',
    ) as HTMLInputElement | null;

    expect(hiddenInput?.value).toBe("2026-05-03");

    fireEvent.change(input, { target: { value: "June 01, 2026" } });

    expect(hiddenInput?.value).toBe("2026-06-01");

    await userEvent.click(input);
    await userEvent.keyboard("{ArrowDown}");

    expect(await screen.findByRole("grid")).toBeTruthy();
  });
});
