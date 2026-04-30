import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  EmptyState,
  EmptyStateActions,
  EmptyStateDescription,
  EmptyStateEyebrow,
  EmptyStateTitle,
  emptyStateVariants,
} from "./empty-state.js";

describe("EmptyState", () => {
  it("renders shared empty-state guidance without workflow orchestration", () => {
    const markup = renderToStaticMarkup(
      <EmptyState variant="warning">
        <EmptyStateEyebrow>No approved registrations</EmptyStateEyebrow>
        <EmptyStateTitle>
          Competition structure cannot be generated yet
        </EmptyStateTitle>
        <EmptyStateDescription>
          Approve at least one participant before scheduling categories.
        </EmptyStateDescription>
        <EmptyStateActions>
          <button type="button">Review pending queue</button>
        </EmptyStateActions>
      </EmptyState>,
    );

    expect(markup).toContain('data-slot="empty-state"');
    expect(markup).toContain('data-slot="empty-state-actions"');
    expect(markup).toContain("Competition structure cannot be generated yet");
  });

  it("supports the approved operational variants", () => {
    expect(emptyStateVariants({ variant: "info" })).toContain("bg-primary/6");
    expect(emptyStateVariants({ variant: "success" })).toContain(
      "bg-secondary",
    );
    expect(emptyStateVariants({ variant: "warning" })).toContain("bg-accent");
    expect(emptyStateVariants({ variant: "blocked" })).toContain(
      "bg-destructive/8",
    );
  });
});
