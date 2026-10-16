import { get } from "svelte/store";
import { useInput } from "./useInput.js";

describe("useInput", () => {
  it("menyimpan nilai awal, mengubah, dan mereset", () => {
    const input = useInput("awal");
    expect(get(input.value)).toBe("awal");
    input.onChange({ target: { value: "baru" } });
    expect(get(input.value)).toBe("baru");
    input.reset();
    expect(get(input.value)).toBe("awal");
  });

  it("nilai awal bawaan string kosong", () => {
    expect(get(useInput().value)).toBe("");
  });
});
