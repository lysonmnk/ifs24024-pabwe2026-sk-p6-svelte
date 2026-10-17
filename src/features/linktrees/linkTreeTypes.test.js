import { describe, it, expect } from "vitest";
import { TYPE_META, TYPE_OPTIONS } from "./linkTreeTypes.js";

describe("linkTreeTypes", () => {
  it("menyediakan tiga tipe sesuai API", () => {
    expect(Object.keys(TYPE_META)).toEqual(["public", "unlisted", "private"]);
    expect(TYPE_OPTIONS.map((o) => o.value)).toEqual(["public", "unlisted", "private"]);
    expect(TYPE_OPTIONS[0].label).toBe("Publik");
  });
});
