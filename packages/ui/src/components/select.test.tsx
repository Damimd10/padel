import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select.js";

describe("Select", () => {
  it("renders a generic bounded-choice surface", () => {
    const markup = renderToStaticMarkup(
      <Select>
        <SelectTrigger aria-label="Registration status">
          <SelectValue placeholder="Select a status" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Status</SelectLabel>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>,
    );

    expect(markup).toContain("Registration status");
    expect(markup).toContain('role="combobox"');
    expect(markup).toContain('aria-expanded="false"');
  });
});
