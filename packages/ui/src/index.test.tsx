import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { Input, Label, Textarea } from "./index.js";

describe("ui package entrypoint", () => {
  it("exports form primitives for shared package consumption", () => {
    const markup = renderToStaticMarkup(
      <>
        <Label htmlFor="captain-name">Captain name</Label>
        <Input id="captain-name" placeholder="Alicia Gomez" />
        <Textarea defaultValue="Referee notes" />
      </>,
    );

    expect(markup).toContain('for="captain-name"');
    expect(markup).toContain('data-slot="label"');
    expect(markup).toContain('data-slot="input"');
    expect(markup).toContain('data-slot="textarea"');
  });
});
