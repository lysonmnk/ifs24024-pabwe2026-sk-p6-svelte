import { describe, expect, it } from "vitest";
import { getPageLoadErrorMessage } from "./pageLoadError.js";

describe("getPageLoadErrorMessage", () => {
  it("returns the message for Error values", () => {
    expect(getPageLoadErrorMessage(new Error("Gagal memuat"))).toBe("Gagal memuat");
  });

  it("converts non-Error values to strings", () => {
    expect(getPageLoadErrorMessage("Gagal memuat")).toBe("Gagal memuat");
  });
});
