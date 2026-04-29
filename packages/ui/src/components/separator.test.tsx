import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Separator } from "./separator.js";

describe("Separator", () => {
  it("renders a semantic vertical separator when decorative is false", () => {
    const markup = renderToStaticMarkup(
      <Separator decorative={false} orientation="vertical" />,
    );

    expect(markup).toContain('data-slot="separator"');
    expect(markup).toContain('data-orientation="vertical"');
    expect(markup).toContain('role="separator"');
  });

  it("renders the horizontal decorative surface by default", () => {
    const markup = renderToStaticMarkup(<Separator />);

    expect(markup).toContain('data-orientation="horizontal"');
    expect(markup).not.toContain('role="separator"');
  });
});
