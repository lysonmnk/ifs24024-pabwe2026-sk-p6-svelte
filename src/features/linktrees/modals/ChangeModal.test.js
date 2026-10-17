import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders, sampleTree } from "../../../test-utils.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => ({
  ...(await importOriginal()),
  showWarningDialog: vi.fn(),
}));
vi.mock("../states/linkTreesStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  changeLinkTree: vi.fn(),
}));

import { showWarningDialog } from "../../../helpers/toolsHelper.js";
import { changeLinkTree, isChanging } from "../states/linkTreesStore.js";
import { TYPE_OPTIONS } from "../linkTreeTypes.js";
import ChangeModal from "./ChangeModal.svelte";

const submit = () => fireEvent.submit(screen.getByRole("button", { name: "Simpan Perubahan" }).closest("form"));

describe("ChangeModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isChanging.set(false);
  });

  it("terisi data awal", () => {
    renderWithProviders(ChangeModal, { props: { linkTree: sampleTree, onclose: vi.fn() } });
    expect(screen.getByLabelText("Judul")).toHaveValue("Kursus Ku");
    expect(screen.getByLabelText("Tipe")).toHaveValue("public");
    expect(screen.getByLabelText("Deskripsi")).toHaveValue("Kumpulan kursus");
  });

  it("menolak judul kosong", async () => {
    renderWithProviders(ChangeModal, { props: { linkTree: sampleTree, onclose: vi.fn() } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: " " } });
    await submit();
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalledWith("Judul wajib diisi"));
    expect(changeLinkTree).not.toHaveBeenCalled();
  });

  it("berhasil mengubah dan menutup", async () => {
    changeLinkTree.mockResolvedValue(true);
    const onclose = vi.fn();
    renderWithProviders(ChangeModal, { props: { linkTree: sampleTree, onclose } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Baru" } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "unlisted" } });
    await fireEvent.input(screen.getByLabelText("Deskripsi"), { target: { value: "D2" } });
    await submit();
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(changeLinkTree).toHaveBeenCalledWith(7, { title: "Baru", type: "unlisted", description: "D2" });
  });

  it("gagal tidak menutup modal", async () => {
    changeLinkTree.mockResolvedValue(false);
    const onclose = vi.fn();
    renderWithProviders(ChangeModal, { props: { linkTree: sampleTree, onclose } });
    await submit();
    await waitFor(() => expect(changeLinkTree).toHaveBeenCalled());
    expect(onclose).not.toHaveBeenCalled();
  });

  it("tombol nonaktif saat menyimpan", async () => {
    renderWithProviders(ChangeModal, { props: { linkTree: sampleTree, onclose: vi.fn() } });
    isChanging.set(true);
    expect(await screen.findByRole("button", { name: "Menyimpan..." })).toBeDisabled();
  });

  it("mengubah tipe berulang kali dan menyimpan nilai terakhir", async () => {
    changeLinkTree.mockResolvedValue(true);
    const onclose = vi.fn();
    renderWithProviders(ChangeModal, { props: { linkTree: sampleTree, onclose } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "unlisted" } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "private" } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Baru" } });
    expect(screen.getByLabelText("Tipe")).toHaveValue("private");
    await submit();
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(changeLinkTree).toHaveBeenCalledWith(7, {
      title: "Baru",
      type: "private",
      description: "Kumpulan kursus",
    });
  });

  it("menangani opsi tipe tanpa nilai dan tipe awal null", () => {
    TYPE_OPTIONS.push({ value: undefined, label: undefined });
    try {
      renderWithProviders(ChangeModal, {
        props: { linkTree: { ...sampleTree, type: null }, onclose: vi.fn() },
      });
      expect(screen.getByLabelText("Tipe").options).toHaveLength(TYPE_OPTIONS.length);
    } finally {
      TYPE_OPTIONS.pop();
    }
  });

  it("memperbarui daftar opsi tipe tanpa mengubah nilainya", async () => {
    const onclose = vi.fn();
    const { rerender } = renderWithProviders(ChangeModal, { props: { linkTree: sampleTree, onclose } });
    await rerender({
      linkTree: sampleTree,
      onclose,
      options: TYPE_OPTIONS.map((option) => ({ ...option })),
    });
    expect(screen.getByLabelText("Tipe").options).toHaveLength(TYPE_OPTIONS.length);
    expect(screen.getByRole("option", { name: "Privat" })).toHaveValue("private");
  });
});
