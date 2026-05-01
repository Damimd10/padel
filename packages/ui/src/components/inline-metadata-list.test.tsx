import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { InlineMetadataList } from "./inline-metadata-list.js";

describe("InlineMetadataList", () => {
  it("renders dense metadata items with labels and values", () => {
    const markup = renderToStaticMarkup(
      <InlineMetadataList
        items={[
          { label: "Format", value: "Round robin", emphasize: true },
          { label: "Courts", value: "6" },
        ]}
      />,
    );

    expect(markup).toContain('data-slot="inline-metadata-list"');
    expect(markup).toContain('data-slot="inline-metadata-item"');
    expect(markup).toContain("Round robin");
    expect(markup).toContain("Courts");
  });

  it("renders the shared empty fallback for missing values", () => {
    const markup = renderToStaticMarkup(
      <InlineMetadataList items={[{ label: "Referee", value: null }]} />,
    );

    expect(markup).toContain("--");
  });
});
