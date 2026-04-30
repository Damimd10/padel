import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Checkbox } from "./checkbox.js";

describe("Checkbox", () => {
  it("renders checked-state markup through the shared wrapper", () => {
    const markup = renderToStaticMarkup(
      <Checkbox checked disabled name="published-results" />,
    );

    expect(markup).toContain("published-results");
    expect(markup).toContain('data-state="checked"');
    expect(markup).toContain("disabled");
  });
});
