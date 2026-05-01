import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { KeyValueSummaryBlock } from "./key-value-summary-block.js";

describe("KeyValueSummaryBlock", () => {
  it("renders summary items with heading structure", () => {
    const markup = renderToStaticMarkup(
      <KeyValueSummaryBlock
        description="Shared operational facts only."
        heading="Registration summary"
        items={[
          { label: "Approved pairs", value: "18 teams" },
          { label: "Missing waivers", value: "2 players", tone: "warning" },
        ]}
      />,
    );

    expect(markup).toContain('data-slot="key-value-summary-block"');
    expect(markup).toContain('data-slot="key-value-summary-grid"');
    expect(markup).toContain("Registration summary");
    expect(markup).toContain("18 teams");
  });

  it("renders the empty fallback when a value is unavailable", () => {
    const markup = renderToStaticMarkup(
      <KeyValueSummaryBlock items={[{ label: "Review owner" }]} />,
    );

    expect(markup).toContain("--");
  });
});
