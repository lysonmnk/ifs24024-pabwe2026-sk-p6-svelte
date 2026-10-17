import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import Avatar from "./Avatar.svelte";

describe("Avatar", () => {
  it("menampilkan gambar bila foto valid", () => {
    const { container } = renderWithProviders(Avatar, {
      props: { name: "Budi", photo: "http://localhost:8000/img/a.png" },
    });
    // Dekoratif: nama sudah tampil sebagai teks di dekatnya, jadi alt dikosongkan.
    const img = container.querySelector("img");
    expect(img).toHaveAttribute("src", "http://localhost:8000/img/a.png");
    expect(img).toHaveAttribute("alt", "");
  });

  it("menampilkan inisial bila foto kosong, dengan ukuran kustom", () => {
    renderWithProviders(Avatar, { props: { name: "budi", photo: "", size: "h-20 w-20" } });
    const initial = screen.getByTestId("avatar-initial");
    expect(initial).toHaveTextContent("B");
    expect(initial.className).toContain("h-20");
    expect(initial).toHaveAttribute("aria-hidden", "true");
  });

  it("memakai ukuran bawaan", () => {
    renderWithProviders(Avatar, { props: { name: "Ani", photo: undefined } });
    expect(screen.getByTestId("avatar-initial").className).toContain("h-9");
  });

  it("memperbarui ukuran tanpa mengubah gambar", async () => {
    const { container, rerender } = renderWithProviders(Avatar, {
      props: { name: "Budi", photo: "http://localhost:8000/img/a.png" },
    });
    await rerender({ name: "Budi", photo: "http://localhost:8000/img/a.png", size: "h-12 w-12" });
    const img = container.querySelector("img");
    expect(img.className).toContain("h-12");
    expect(img).toHaveAttribute("src", "http://localhost:8000/img/a.png");
  });

  it("memperbarui ukuran tanpa mengubah inisial", async () => {
    const { rerender } = renderWithProviders(Avatar, { props: { name: "Budi", photo: "" } });
    await rerender({ name: "Budi", photo: "", size: "h-12 w-12" });
    const initial = screen.getByTestId("avatar-initial");
    expect(initial.className).toContain("h-12");
    expect(initial).toHaveTextContent("B");
  });

  it("memakai string kosong bila ukuran null (gambar dan inisial)", () => {
    const { container, unmount } = renderWithProviders(Avatar, {
      props: { name: "Budi", photo: "http://localhost:8000/img/a.png", size: null },
    });
    expect(container.querySelector("img").className).toContain("rounded-full");
    unmount();
    renderWithProviders(Avatar, { props: { name: "Budi", photo: "", size: null } });
    expect(screen.getByTestId("avatar-initial").className).toContain("rounded-full");
  });
});
