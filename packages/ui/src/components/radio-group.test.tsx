import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { RadioGroup, RadioGroupItem } from "./radio-group.js";

describe("RadioGroup", () => {
  it("renders grouped single-choice options", () => {
    const markup = renderToStaticMarkup(
      <RadioGroup defaultValue="round-robin" name="format">
        <RadioGroupItem value="round-robin" />
        <RadioGroupItem value="single-elimination" />
      </RadioGroup>,
    );

    expect(markup).toContain('role="radiogroup"');
    expect(markup).toContain("round-robin");
    expect(markup).toContain("single-elimination");
  });
});
