import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  InlineAlert,
  InlineAlertActions,
  InlineAlertDescription,
  InlineAlertTitle,
  inlineAlertVariants,
} from "./inline-alert.js";

describe("InlineAlert", () => {
  it("renders a persistent shared feedback surface with status semantics", () => {
    const markup = renderToStaticMarkup(
      <InlineAlert variant="blocked">
        <InlineAlertTitle variant="blocked">
          Bracket publishing blocked
        </InlineAlertTitle>
        <InlineAlertDescription>
          Resolve incomplete quarterfinal results before continuing.
        </InlineAlertDescription>
        <InlineAlertActions>
          <button type="button">Review matches</button>
        </InlineAlertActions>
      </InlineAlert>,
    );

    expect(markup).toContain('data-slot="inline-alert"');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain('data-slot="inline-alert-actions"');
    expect(markup).toContain("Bracket publishing blocked");
  });

  it("supports the approved operational variants", () => {
    expect(inlineAlertVariants({ variant: "info" })).toContain("bg-primary/8");
    expect(inlineAlertVariants({ variant: "success" })).toContain(
      "bg-secondary",
    );
    expect(inlineAlertVariants({ variant: "warning" })).toContain("bg-accent");
    expect(inlineAlertVariants({ variant: "blocked" })).toContain(
      "bg-destructive/10",
    );
  });
});
