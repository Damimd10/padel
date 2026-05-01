// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { DateRangeInput } from "./date-range-input.js";
import { DateRangePicker } from "./date-range-picker.js";
import { Field } from "./field.js";

beforeAll(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  cleanup();
});

describe("DateRangePicker", () => {
  it("keeps DateRangeInput as a compatibility alias", () => {
    expect(DateRangeInput).toBe(DateRangePicker);
  });

  it("renders a shared date-range surface with canonical form submission support", () => {
    const markup = renderToStaticMarkup(
      <DateRangePicker
        defaultValue={{
          from: new Date(2026, 4, 1),
          to: new Date(2026, 4, 10),
        }}
        fromName="startDate"
        id="registration-window"
        toName="endDate"
      />,
    );

    expect(markup).toContain('data-slot="date-range-picker"');
    expect(markup).toContain('id="registration-window"');
    expect(markup).toContain('name="startDate"');
    expect(markup).toContain('name="endDate"');
    expect(markup).toContain('value="2026-05-01"');
    expect(markup).toContain('value="2026-05-10"');
  });

  it("composes with Field and forwards shared invalid-state semantics to the trigger", () => {
    const markup = renderToStaticMarkup(
      <Field
        description="Use local competition dates rather than timestamp values."
        error="The end date must be on or after the start date."
        id="registration-window"
        label="Registration window"
      >
        <DateRangePicker />
      </Field>,
    );

    expect(markup).toContain(
      'aria-describedby="registration-window-description registration-window-error"',
    );
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('id="registration-window"');
  });

  it("opens the range calendar and keeps the trigger keyboard reachable", async () => {
    render(
      <DateRangePicker
        aria-label="Competition dates"
        defaultValue={{
          from: new Date(2026, 4, 1),
          to: new Date(2026, 4, 12),
        }}
      />,
    );

    await userEvent.tab();
    const trigger = screen.getByRole("button", { name: /competition dates/i });
    expect(trigger.ownerDocument.activeElement).toBe(trigger);

    await userEvent.click(trigger);
    expect((await screen.findAllByRole("grid")).length).toBeGreaterThan(0);
  });
});
