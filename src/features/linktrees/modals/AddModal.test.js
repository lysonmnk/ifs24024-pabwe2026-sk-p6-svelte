import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => ({
  ...(await importOriginal()),
  showWarningDialog: vi.fn(),
}));
vi.mock("../../../hooks/useInput.js", async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useInput: vi.fn(actual.useInput) };
});
vi.mock("../states/linkTreesStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  addLinkTree: vi.fn(),
}));

import { showWarningDialog } from "../../../helpers/toolsHelper.js";
import { addLinkTree, isAdding } from "../states/linkTreesStore.js";
import { useInput } from "../../../hooks/useInput.js";
import { TYPE_OPTIONS } from "../linkTreeTypes.js";
import AddModal from "./AddModal.svelte";

const submit = () => fireEvent.submit(screen.getByRole("button", { name: "Simpan" }).closest("form"));

describe("AddModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAdding.set(false);
  });

  it("menolak judul kosong", async () => {
    const onclose = vi.fn();
    renderWithProviders(AddModal, { props: { onclose } });
    await submit();
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalledWith("Judul wajib diisi"));
    expect(addLinkTree).not.toHaveBeenCalled();
    expect(onclose).not.toHaveBeenCalled();
  });

  it("berhasil menambah dan menutup", async () => {
    addLinkTree.mockResolvedValue(true);
    const onclose = vi.fn();
    renderWithProviders(AddModal, { props: { onclose } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "  Kursus  " } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "private" } });
    await fireEvent.input(screen.getByLabelText("Deskripsi"), { target: { value: "Desk" } });
    await submit();
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(addLinkTree).toHaveBeenCalledWith({ title: "Kursus", type: "private", description: "Desk" });
  });

  it("gagal tidak menutup modal", async () => {
    addLinkTree.mockResolvedValue(false);
    const onclose = vi.fn();
    renderWithProviders(AddModal, { props: { onclose } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "X" } });
    await submit();
    await waitFor(() => expect(addLinkTree).toHaveBeenCalled());
    expect(onclose).not.toHaveBeenCalled();
  });

  it("tombol nonaktif saat menyimpan", async () => {
    renderWithProviders(AddModal, { props: { onclose: vi.fn() } });
    isAdding.set(true);
    expect(await screen.findByRole("button", { name: "Menyimpan..." })).toBeDisabled();
  });

  it("mengubah tipe berulang kali dan menyimpan nilai terakhir", async () => {
    addLinkTree.mockResolvedValue(true);
    const onclose = vi.fn();
    renderWithProviders(AddModal, { props: { onclose } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Satu" } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "unlisted" } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "private" } });
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Dua" } });
    expect(screen.getByLabelText("Tipe")).toHaveValue("private");
    await submit();
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(addLinkTree).toHaveBeenCalledWith({ title: "Dua", type: "private", description: "" });
  });

  it("menangani opsi tipe tanpa nilai", () => {
    TYPE_OPTIONS.push({ value: undefined, label: undefined });
    try {
      renderWithProviders(AddModal, { props: { onclose: vi.fn() } });
      expect(screen.getByLabelText("Tipe").options).toHaveLength(TYPE_OPTIONS.length);
    } finally {
      TYPE_OPTIONS.pop();
    }
  });

  it("menangani nilai tipe awal null", async () => {
    const real = await vi.importActual("../../../hooks/useInput.js");
    useInput.mockImplementation((initial) => real.useInput(initial === "public" ? null : initial));
    try {
      renderWithProviders(AddModal, { props: { onclose: vi.fn() } });
      expect(screen.getByLabelText("Tipe")).toBeInTheDocument();
    } finally {
      useInput.mockImplementation(real.useInput);
    }
  });

  it("memperbarui daftar opsi tipe tanpa mengubah nilainya", async () => {
    const onclose = vi.fn();
    const { rerender } = renderWithProviders(AddModal, { props: { onclose } });
    await rerender({ onclose, options: TYPE_OPTIONS.map((option) => ({ ...option })) });
    expect(screen.getByLabelText("Tipe").options).toHaveLength(TYPE_OPTIONS.length);
    expect(screen.getByRole("option", { name: "Privat" })).toHaveValue("private");
  });
});
