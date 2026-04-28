import { describe, expect, it } from "vitest";

import { workspaceName } from "../src/index.js";

describe("config package baseline", () => {
  it("exposes shared workspace metadata", () => {
    expect(workspaceName).toContain("padel");
  });
});
