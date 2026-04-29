import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Button, buttonVariants } from "./button.js";

describe("Button", () => {
  it("renders a button with the shared default styles", () => {
    const markup = renderToStaticMarkup(<Button>Save changes</Button>);

    expect(markup).toContain("Save changes");
    expect(markup).toContain('type="button"');
    expect(markup).toContain("bg-primary");
  });

  it("supports variant composition and asChild rendering", () => {
    const buttonClassName = buttonVariants({ size: "lg", variant: "outline" });
    const linkMarkup = renderToStaticMarkup(
      <Button asChild>
        <a href="/docs">Read docs</a>
      </Button>,
    );

    expect(buttonClassName).toContain("border");
    expect(linkMarkup).toContain("<a");
    expect(linkMarkup).toContain("Read docs");
  });
});
