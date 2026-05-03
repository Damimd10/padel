import { describe, expect, it } from "vitest";

import { Category } from "./category.js";

describe("Category", () => {
  describe("create", () => {
    it("creates a category with valid input", () => {
      const category = Category.create(
        { competitionId: "comp-1", label: "Segunda" },
        "cat-1",
        "2026-05-03T10:00:00.000Z",
      );

      expect(category.toResponse()).toEqual({
        id: "cat-1",
        competitionId: "comp-1",
        label: "Segunda",
        createdAt: "2026-05-03T10:00:00.000Z",
        updatedAt: "2026-05-03T10:00:00.000Z",
      });
    });

    it("throws if label is empty", () => {
      expect(() =>
        Category.create(
          { competitionId: "comp-1", label: "  " },
          "cat-1",
          "2026-05-03T10:00:00.000Z",
        ),
      ).toThrow("Category label is required.");
    });

    it("throws if competitionId is empty", () => {
      expect(() =>
        Category.create(
          { competitionId: "  ", label: "Segunda" },
          "cat-1",
          "2026-05-03T10:00:00.000Z",
        ),
      ).toThrow("Competition ID is required.");
    });

    it("trims whitespace from label", () => {
      const category = Category.create(
        { competitionId: "comp-1", label: "  Segunda  " },
        "cat-1",
        "2026-05-03T10:00:00.000Z",
      );

      expect(category.toResponse().label).toBe("Segunda");
    });
  });

  describe("restore", () => {
    it("restores a category from persisted props", () => {
      const props = {
        id: "cat-1",
        competitionId: "comp-1",
        label: "Tercera",
        createdAt: "2026-05-01T10:00:00.000Z",
        updatedAt: "2026-05-02T10:00:00.000Z",
      };

      const category = Category.restore(props);

      expect(category.toResponse()).toEqual(props);
    });
  });

  describe("update", () => {
    it("returns a new category with updated label and timestamp", () => {
      const original = Category.create(
        { competitionId: "comp-1", label: "Segunda" },
        "cat-1",
        "2026-05-03T10:00:00.000Z",
      );

      const updated = original.update(
        { label: "Segunda A" },
        "2026-05-03T12:00:00.000Z",
      );

      expect(updated.toResponse()).toEqual({
        id: "cat-1",
        competitionId: "comp-1",
        label: "Segunda A",
        createdAt: "2026-05-03T10:00:00.000Z",
        updatedAt: "2026-05-03T12:00:00.000Z",
      });
    });

    it("throws if new label is empty", () => {
      const category = Category.create(
        { competitionId: "comp-1", label: "Segunda" },
        "cat-1",
        "2026-05-03T10:00:00.000Z",
      );

      expect(() =>
        category.update({ label: "  " }, "2026-05-03T12:00:00.000Z"),
      ).toThrow("Category label is required.");
    });
  });
});
