import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { ProgressIndicator } from "./progress-indicator.js";

describe("ProgressIndicator", () => {
  it("renders accessible progress semantics", () => {
    const markup = renderToStaticMarkup(
      <ProgressIndicator label="Registration review" max={12} value={9} />,
    );

    expect(markup).toContain('data-slot="progress-indicator"');
    expect(markup).toContain('role="progressbar"');
    expect(markup).toContain('aria-valuenow="9"');
    expect(markup).toContain('aria-valuemax="12"');
  });

  it("clamps progress values beyond the allowed range", () => {
    const markup = renderToStaticMarkup(
      <ProgressIndicator label="Validation" max={5} value={9} />,
    );

    expect(markup).toContain('aria-valuenow="5"');
    expect(markup).toContain("100%");
  });
});
