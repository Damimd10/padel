import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Textarea } from "./textarea.js";

describe("Textarea", () => {
  it("renders the shared textarea slot", () => {
    const markup = renderToStaticMarkup(
      <Textarea defaultValue="Referee notes" />,
    );

    expect(markup).toContain('data-slot="textarea"');
    expect(markup).toContain("Referee notes");
  });

  it("surfaces invalid and read-only styling hooks", () => {
    const markup = renderToStaticMarkup(
      <Textarea
        aria-invalid="true"
        readOnly
        value="Late registration request"
      />,
    );

    expect(markup).toContain("aria-invalid:border-destructive");
    expect(markup).toContain("read-only:bg-muted/40");
  });
});
