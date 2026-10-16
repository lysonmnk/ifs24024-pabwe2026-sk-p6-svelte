import { get } from "svelte/store";
import { screen, fireEvent } from "@testing-library/svelte";
import NotFoundPage from "./NotFoundPage.svelte";
import { currentPath } from "../../../router.js";
import { renderWithProviders } from "../../../test-utils.js";

describe("NotFoundPage", () => {
  it("menampilkan 404 dan kembali ke beranda", async () => {
    renderWithProviders(NotFoundPage);
    expect(screen.getByText("Halaman tidak ditemukan")).toBeInTheDocument();
    currentPath.set("/xyz");
    await fireEvent.click(screen.getByText("Kembali ke beranda"));
    expect(get(currentPath)).toBe("/");
  });
});
