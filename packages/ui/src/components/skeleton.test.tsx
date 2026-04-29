import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Skeleton } from "./skeleton.js";

describe("Skeleton", () => {
  it("renders a decorative loading placeholder", () => {
    const markup = renderToStaticMarkup(
      <Skeleton aria-hidden="true" className="h-4 w-24" />,
    );

    expect(markup).toContain('data-slot="skeleton"');
    expect(markup).toContain("animate-pulse");
    expect(markup).toContain('aria-hidden="true"');
  });
});
