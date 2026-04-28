import { describe, expect, it } from "vitest";

import { uiPackageMarker } from "../src/index.js";

describe("ui package baseline", () => {
  it("exposes a placeholder export", () => {
    expect(uiPackageMarker).toContain("baseline");
  });
});
