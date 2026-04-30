import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { NumericInput } from "./numeric-input.js";

describe("NumericInput", () => {
  it("renders a shared number input surface with numeric keyboard hints", () => {
    const markup = renderToStaticMarkup(
      <NumericInput id="match-order" max={32} min={1} step={1} />,
    );

    expect(markup).toContain('type="number"');
    expect(markup).toContain('inputMode="numeric"');
    expect(markup).toContain('min="1"');
    expect(markup).toContain('max="32"');
  });

  it("switches to decimal input mode when the step allows fractional values", () => {
    const markup = renderToStaticMarkup(
      <NumericInput defaultValue={4.5} step="0.5" />,
    );

    expect(markup).toContain('inputMode="decimal"');
    expect(markup).toContain('step="0.5"');
  });
});
