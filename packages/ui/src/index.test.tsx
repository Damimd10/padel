import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  EmptyState,
  InlineAlert,
  InlineMetadataList,
  Input,
  KeyValueSummaryBlock,
  Label,
  ProgressIndicator,
  Textarea,
  ToastProvider,
} from "./index.js";

describe("ui package entrypoint", () => {
  it("exports shared form and feedback primitives for package consumption", () => {
    const markup = renderToStaticMarkup(
      <>
        <Label htmlFor="captain-name">Captain name</Label>
        <Input id="captain-name" placeholder="Alicia Gomez" />
        <Textarea defaultValue="Referee notes" />
        <InlineAlert>Review pending registrations.</InlineAlert>
        <EmptyState>No matches scheduled yet.</EmptyState>
        <ToastProvider />
      </>,
    );

    expect(markup).toContain('for="captain-name"');
    expect(markup).toContain('data-slot="label"');
    expect(markup).toContain('data-slot="input"');
    expect(markup).toContain('data-slot="textarea"');
    expect(markup).toContain('data-slot="inline-alert"');
    expect(markup).toContain('data-slot="empty-state"');
  });

  it("exports data-display primitives for shared package consumption", () => {
    const markup = renderToStaticMarkup(
      <>
        <InlineMetadataList items={[{ label: "Format", value: "Round robin" }]} />
        <KeyValueSummaryBlock items={[{ label: "Registered pairs", value: "16" }]} />
        <ProgressIndicator label="Review progress" max={10} value={7} />
      </>,
    );

    expect(markup).toContain('data-slot="inline-metadata-list"');
    expect(markup).toContain('data-slot="key-value-summary-block"');
    expect(markup).toContain('data-slot="progress-indicator"');
  });
});
