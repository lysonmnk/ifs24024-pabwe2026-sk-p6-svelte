import { describe, it, expect, vi } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders, textSnippet } from "../../../test-utils.js";
import Modal from "./Modal.svelte";

describe("Modal", () => {
  it("menampilkan judul, isi, dan menutup lewat dua tombol", () => {
    const onclose = vi.fn();
    renderWithProviders(Modal, { props: { title: "Judul", onclose, children: textSnippet("Isi modal") } });
    expect(screen.getByRole("dialog", { name: "Judul" })).toBeInTheDocument();
    expect(screen.getByText("Isi modal")).toBeInTheDocument();
    screen.getByLabelText("Tutup").click();
    screen.getByLabelText("Tutup modal").click();
    expect(onclose).toHaveBeenCalledTimes(2);
  });
});
