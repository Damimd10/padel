import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Field } from "./field.js";
import { Input } from "./input.js";

describe("Field", () => {
  it("wires shared description and error semantics around a control", () => {
    const markup = renderToStaticMarkup(
      <Field
        description="Used for approvals and schedule updates."
        error="Enter a valid email address."
        label="Team captain email"
        required
      >
        <Input defaultValue="captain@club" type="email" />
      </Field>,
    );

    expect(markup).toContain('aria-describedby="');
    expect(markup).toContain("-description");
    expect(markup).toContain("-error");
    expect(markup).toContain('aria-invalid="true"');
    expect(markup).toContain('role="alert"');
    expect(markup).toContain("text-destructive");
  });
});
