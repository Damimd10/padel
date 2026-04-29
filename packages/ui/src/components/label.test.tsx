import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Label } from "./label.js";

describe("Label", () => {
  it("renders the label slot and htmlFor wiring", () => {
    const markup = renderToStaticMarkup(
      <Label htmlFor="captain-name">Captain name</Label>,
    );

    expect(markup).toContain('for="captain-name"');
    expect(markup).toContain('data-slot="label"');
    expect(markup).toContain("Captain name");
  });
});
