import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Input } from "./input.js";

describe("Input", () => {
  it("renders the shared input slot with public placeholder styling", () => {
    const markup = renderToStaticMarkup(
      <Input id="captain-name" placeholder="Alicia Gomez" />,
    );

    expect(markup).toContain('id="captain-name"');
    expect(markup).toContain('data-slot="input"');
    expect(markup).toContain("placeholder:text-muted-foreground");
  });

  it("preserves disabled and read-only public states", () => {
    const markup = renderToStaticMarkup(
      <Input disabled readOnly value="Bracket published" />,
    );

    expect(markup).toContain("disabled");
    expect(markup).toContain("read-only:bg-muted/40");
  });
});
