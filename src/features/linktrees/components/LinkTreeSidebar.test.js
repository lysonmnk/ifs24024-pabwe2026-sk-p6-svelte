import { get } from "svelte/store";
import { screen, fireEvent } from "@testing-library/svelte";
import LinkTreeSidebar from "./LinkTreeSidebar.svelte";
import { currentPath } from "../../../router.js";
import { renderWithProviders } from "../../../test-utils.js";

describe("LinkTreeSidebar", () => {
  it("menandai menu aktif dan berpindah halaman", async () => {
    renderWithProviders(LinkTreeSidebar);
    expect(screen.getByText("Semua Link Tree").className).toContain("bg-indigo-50");
    expect(screen.getByText("Pengguna").className).not.toContain("bg-indigo-50");
    await fireEvent.click(screen.getByText("Pengguna"));
    expect(get(currentPath)).toBe("/users");
    await fireEvent.click(screen.getByText("Semua Link Tree"));
    expect(get(currentPath)).toBe("/");
    await fireEvent.click(screen.getByText("Profil"));
    expect(get(currentPath)).toBe("/profile");
    expect(screen.getByText("Profil").className).toContain("bg-indigo-50");
  });
});
