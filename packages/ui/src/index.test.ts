import { describe, expect, it } from "vitest";
import * as ui from "./index.js";

describe("ui package exports", () => {
  it("exposes the foundation and selection control surfaces", () => {
    expect(ui.Button).toBeTruthy();
    expect(ui.Field).toBeTruthy();
    expect(ui.Input).toBeTruthy();
    expect(ui.Textarea).toBeTruthy();
    expect(ui.Checkbox).toBeTruthy();
    expect(ui.RadioGroup).toBeTruthy();
    expect(ui.Select).toBeTruthy();
    expect(ui.SelectTrigger).toBeTruthy();
    expect(ui.Switch).toBeTruthy();
  });
});
