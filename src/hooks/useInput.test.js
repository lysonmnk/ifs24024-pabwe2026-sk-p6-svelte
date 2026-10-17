import { describe, it, expect } from "vitest";
import { get } from "svelte/store";
import { useInput } from "./useInput.js";

describe("useInput", () => {
  it("berperilaku sebagai store dengan nilai awal", () => {
    const input = useInput("awal");
    expect(get(input)).toBe("awal");
  });

  it("onChange mengubah nilai dan reset mengembalikannya", () => {
    const input = useInput("awal");
    input.onChange({ target: { value: "baru" } });
    expect(get(input)).toBe("baru");
    input.reset();
    expect(get(input)).toBe("awal");
  });

  it("set mengubah nilai langsung", () => {
    const input = useInput("");
    input.set("x");
    expect(get(input)).toBe("x");
  });
});
