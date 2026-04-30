import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DateInput } from "./date-input.js";

describe("DateInput", () => {
  it("renders a shared date field with native date semantics", () => {
    const markup = renderToStaticMarkup(
      <DateInput defaultValue="2026-05-03" id="competition-start-date" />,
    );

    expect(markup).toContain('type="date"');
    expect(markup).toContain('id="competition-start-date"');
    expect(markup).toContain('data-slot="input"');
  });

  it("preserves disabled and read-only public states", () => {
    const markup = renderToStaticMarkup(
      <DateInput disabled readOnly value="2026-05-05" />,
    );

    expect(markup).toContain("disabled");
    expect(markup).toContain("read-only:bg-muted/40");
  });
});
