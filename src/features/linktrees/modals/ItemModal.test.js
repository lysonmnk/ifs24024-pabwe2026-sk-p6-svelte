import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders, sampleTree } from "../../../test-utils.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => ({
  ...(await importOriginal()),
  showWarningDialog: vi.fn(),
}));
vi.mock("../states/linkTreesStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  addItem: vi.fn(),
  changeItem: vi.fn(),
}));

import { showWarningDialog } from "../../../helpers/toolsHelper.js";
import { addItem, changeItem, isItemMutating } from "../states/linkTreesStore.js";
import ItemModal from "./ItemModal.svelte";

const submit = () => fireEvent.submit(screen.getByRole("button", { name: "Simpan" }).closest("form"));
const item = sampleTree.items[0];

describe("ItemModal", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isItemMutating.set(false);
  });

  it("mode tambah menolak input kosong", async () => {
    renderWithProviders(ItemModal, { props: { linkTreeId: 7, item: null, onclose: vi.fn() } });
    expect(screen.getByRole("dialog", { name: "Tambah Tautan" })).toBeInTheDocument();
    await submit();
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalledWith("Judul dan URL wajib diisi"));
    expect(addItem).not.toHaveBeenCalled();
  });

  it("mode tambah berhasil", async () => {
    addItem.mockResolvedValue(true);
    const onclose = vi.fn();
    renderWithProviders(ItemModal, { props: { linkTreeId: 7, item: null, onclose } });
    await fireEvent.input(screen.getByLabelText("Judul Tautan"), { target: { value: " Docs " } });
    await fireEvent.input(screen.getByLabelText("URL"), { target: { value: "https://a.b" } });
    await submit();
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(addItem).toHaveBeenCalledWith(7, { title: "Docs", url: "https://a.b" });
  });

  it("mode tambah gagal tidak menutup", async () => {
    addItem.mockResolvedValue(false);
    const onclose = vi.fn();
    renderWithProviders(ItemModal, { props: { linkTreeId: 7, item: null, onclose } });
    await fireEvent.input(screen.getByLabelText("Judul Tautan"), { target: { value: "A" } });
    await fireEvent.input(screen.getByLabelText("URL"), { target: { value: "https://a.b" } });
    await submit();
    await waitFor(() => expect(addItem).toHaveBeenCalled());
    expect(onclose).not.toHaveBeenCalled();
  });

  it("mode ubah terisi data dan memanggil changeItem", async () => {
    changeItem.mockResolvedValue(true);
    const onclose = vi.fn();
    renderWithProviders(ItemModal, { props: { linkTreeId: 7, item, onclose } });
    expect(screen.getByRole("dialog", { name: "Ubah Tautan" })).toBeInTheDocument();
    expect(screen.getByLabelText("Judul Tautan")).toHaveValue("Dasar Java");
    expect(screen.getByLabelText("URL")).toHaveValue("https://youtu.be/abc");
    await submit();
    await waitFor(() => expect(onclose).toHaveBeenCalled());
    expect(changeItem).toHaveBeenCalledWith(7, 11, { title: "Dasar Java", url: "https://youtu.be/abc" });
  });

  it("tombol nonaktif saat menyimpan", async () => {
    renderWithProviders(ItemModal, { props: { linkTreeId: 7, item: null, onclose: vi.fn() } });
    isItemMutating.set(true);
    expect(await screen.findByRole("button", { name: "Menyimpan..." })).toBeDisabled();
  });
});
