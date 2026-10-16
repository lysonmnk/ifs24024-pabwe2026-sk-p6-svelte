import { render, screen, fireEvent } from "@testing-library/svelte";
import ModalShell from "./ModalShell.svelte";
import { snippet } from "../../../test-utils.js";

describe("ModalShell", () => {
  it("menampilkan judul, isi, dan menutup", async () => {
    const onClose = vi.fn();
    render(ModalShell, { props: { title: "Judul", onClose, children: snippet("<p>isi</p>") } });
    expect(screen.getByRole("dialog", { name: "Judul" })).toBeInTheDocument();
    expect(screen.getByText("isi")).toBeInTheDocument();
    await fireEvent.click(screen.getByLabelText("Tutup"));
    expect(onClose).toHaveBeenCalled();
  });
});
