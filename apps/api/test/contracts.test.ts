import { describe, expect, it } from "vitest";

import { describeApiBootstrap } from "../src/main.js";

describe("api shared schema wiring", () => {
  it("consumes the shared schema package", () => {
    expect(describeApiBootstrap()).toContain("0.0.0");
  });
});
