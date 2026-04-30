import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Switch } from "./switch.js";

describe("Switch", () => {
  it("renders a checked binary control with thumb markup", () => {
    const markup = renderToStaticMarkup(
      <Switch aria-label="Rankings enabled" checked />,
    );

    expect(markup).toContain("Rankings enabled");
    expect(markup).toContain('data-state="checked"');
    expect(markup).toContain("switch-thumb");
  });
});
