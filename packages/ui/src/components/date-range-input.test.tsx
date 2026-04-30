// @vitest-environment jsdom

import { cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { renderToStaticMarkup } from "react-dom/server";
import { afterEach, beforeAll, describe, expect, it } from "vitest";
import { DateRangeInput } from "./date-range-input.js";
import { Field } from "./field.js";

beforeAll(() => {
  (
    globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT: boolean }
  ).IS_REACT_ACT_ENVIRONMENT = true;
});

afterEach(() => {
  cleanup();
});

describe("DateRangeInput", () => {
  it("renders a grouped shared date-range surface with derived field ids", () => {
    const markup = renderToStaticMarkup(
      <DateRangeInput
        id="registration-window"
        startProps={{ defaultValue: "2026-05-01", name: "startDate" }}
        endProps={{ defaultValue: "2026-05-10", name: "endDate" }}
      />,
    );

    expect(markup).toContain("<fieldset");
    expect(markup).toContain('data-slot="date-range-input"');
    expect(markup).toContain('id="registration-window-start"');
    expect(markup).toContain('id="registration-window-end"');
    expect(markup).toContain('name="startDate"');
    expect(markup).toContain('name="endDate"');
  });

  it("composes with Field and forwards shared invalid-state semantics to both dates", () => {
    const markup = renderToStaticMarkup(
      <Field
        description="Use local competition dates rather than timestamp values."
        error="The end date must be on or after the start date."
        id="registration-window"
        label="Registration window"
      >
        <DateRangeInput />
      </Field>,
    );

    expect(markup).toContain(
      'aria-describedby="registration-window-description registration-window-error"',
    );
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('id="registration-window-start"');
    expect(markup).toContain('id="registration-window-end"');
  });

  it("keeps start and end dates keyboard reachable in sequence", async () => {
    render(
      <DateRangeInput
        aria-label="Competition dates"
        startProps={{ "aria-label": "Start date" }}
        endProps={{ "aria-label": "End date" }}
      />,
    );

    await userEvent.tab();
    const start = screen.getByLabelText(/start date/i);
    expect(start.ownerDocument.activeElement).toBe(start);

    await userEvent.tab();
    const end = screen.getByLabelText(/end date/i);
    expect(end.ownerDocument.activeElement).toBe(end);
  });
});
