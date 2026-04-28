import { describe, expect, it } from "vitest";

import { sharedPingContract } from "../src/index.js";

describe("schemas package", () => {
  it("parses the shared placeholder contract", () => {
    expect(
      sharedPingContract.parse({ status: "ok", version: "0.0.0" }),
    ).toEqual({
      status: "ok",
      version: "0.0.0",
    });
  });
});
