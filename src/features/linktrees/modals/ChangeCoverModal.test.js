import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => ({
  ...(await importOriginal()),
  showWarningDialog: vi.fn(),
}));
vi.mock("../states/linkTreesStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  changeCover: vi.fn(),
}));

import { showWarningDialog } from "../../../helpers/toolsHelper.js";
import { changeCover, isChangingCover } from "../states/linkTreesStore.js";
import ChangeCoverModal from "./ChangeCoverModal.svelte";

const submit = () => fireEvent.submit(screen.getByRole("button", { name: "Unggah" }).closest("form"));
const file = new File(["x"], "c.png", { type: "image/png" });

describe("ChangeCoverModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isChangingCover.set(false);
  });

  it("menolak bila belum memilih berkas", async () => {
    renderWithProviders(ChangeCoverModal, { props: { linkTreeId: 7, onclose: vi.fn() } });
    await submit();
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalled());
    expect(changeCover).not.toHaveBeenCalled();
  });

  it("berhasil mengunggah dan menutup", async () => {
    changeCover.mockResolvedValue(true);
    const onclose = vi.fn();
    renderWithProviders(ChangeCoverModal, { props: { linkTreeId: 7, onclose } });
    await fireEvent.change(screen.getByLabelText("Gambar Sampul"), { target: { files: [file] } });
    await submit();
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(changeCover).toHaveBeenCalledWith(7, file);
  });

  it("gagal tidak menutup modal", async () => {
    changeCover.mockResolvedValue(false);
    const onclose = vi.fn();
    renderWithProviders(ChangeCoverModal, { props: { linkTreeId: 7, onclose } });
    await fireEvent.change(screen.getByLabelText("Gambar Sampul"), { target: { files: [file] } });
    await submit();
    await waitFor(() => expect(changeCover).toHaveBeenCalled());
    expect(onclose).not.toHaveBeenCalled();
  });

  it("tombol nonaktif saat mengunggah", async () => {
    renderWithProviders(ChangeCoverModal, { props: { linkTreeId: 7, onclose: vi.fn() } });
    isChangingCover.set(true);
    expect(await screen.findByRole("button", { name: "Mengunggah..." })).toBeDisabled();
  });
});
