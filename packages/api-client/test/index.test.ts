import { describe, expect, it } from "vitest";

import { sampleContractSummary } from "../src/index.js";

describe("api-client package", () => {
  it("reads the shared schema package", () => {
    expect(sampleContractSummary()).toBe("ok:0.0.0");
  });
});
