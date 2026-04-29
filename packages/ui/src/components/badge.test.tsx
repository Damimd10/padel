import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Badge, badgeVariants } from "./badge.js";

describe("Badge", () => {
  it("renders the default shared badge surface", () => {
    const markup = renderToStaticMarkup(<Badge>Shared label</Badge>);

    expect(markup).toContain('data-slot="badge"');
    expect(markup).toContain("Shared label");
  });

  it("supports the approved shared variants", () => {
    expect(badgeVariants({ variant: "default" })).toContain("bg-primary/12");
    expect(badgeVariants({ variant: "secondary" })).toContain("bg-secondary");
    expect(badgeVariants({ variant: "outline" })).toContain("border-border");
  });
});
