import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders, sampleTree } from "../../../test-utils.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => ({
  ...(await importOriginal()),
  showConfirmDialog: vi.fn(),
}));
vi.mock("../states/linkTreesStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  fetchLinkTree: vi.fn(),
  deleteItem: vi.fn(),
  changeCover: vi.fn(),
  addItem: vi.fn(),
}));

import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
import { linkTree, isDetailLoading, fetchLinkTree, deleteItem, changeCover, addItem } from "../states/linkTreesStore.js";
import { Globe } from "lucide-svelte";
import { TYPE_META } from "../linkTreeTypes.js";
import DetailPage from "./DetailPage.svelte";

const render = (profile) =>
  renderWithProviders(DetailPage, { props: { linkTreeId: "7" }, path: "/link-trees/7", ...(profile ? { profile } : {}) });

describe("DetailPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isDetailLoading.set(false);
  });

  it("memuat detail berdasarkan parameter rute", () => {
    render();
    expect(fetchLinkTree).toHaveBeenCalledWith("7");
  });

  it("status memuat", async () => {
    render();
    isDetailLoading.set(true);
    expect(
      await screen.findByRole("heading", { level: 1, name: "Memuat data..." })
    ).toBeInTheDocument();
  });

  it("status tidak ditemukan", async () => {
    render();
    expect(
      await screen.findByRole("heading", { level: 1, name: "Link tree tidak ditemukan." })
    ).toBeInTheDocument();
  });

  it("pemilik melihat semua kontrol", async () => {
    render();
    linkTree.set(sampleTree);
    expect(await screen.findByRole("heading", { name: "Kursus Ku" })).toBeInTheDocument();
    expect(screen.getByText("Dasar Java")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dasar Java/ })).toHaveAttribute("href", "https://youtu.be/abc");
    expect(screen.getByRole("button", { name: /Ubah Data/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Ubah Sampul/ })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Tambah Tautan/ })).toBeInTheDocument();
  });

  it("bukan pemilik tidak melihat kontrol; tanpa cover dan tanpa item", async () => {
    render();
    linkTree.set({ ...sampleTree, user_id: 99, cover: "http://localhost:8000/", items: [] });
    expect(await screen.findByText("Belum ada tautan.")).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Ubah Data/ })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Tambah Tautan/ })).not.toBeInTheDocument();
  });

  it("membuka dan menutup modal ubah data", async () => {
    render();
    linkTree.set(sampleTree);
    (await screen.findByRole("button", { name: /Ubah Data/ })).click();
    expect(await screen.findByRole("dialog", { name: "Ubah Link Tree" })).toBeInTheDocument();
    screen.getByLabelText("Tutup").click();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("membuka dan menutup modal ubah sampul", async () => {
    render();
    linkTree.set(sampleTree);
    (await screen.findByRole("button", { name: /Ubah Sampul/ })).click();
    expect(await screen.findByRole("dialog", { name: "Ubah Sampul" })).toBeInTheDocument();
    screen.getByLabelText("Tutup").click();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("menambah tautan lewat modal", async () => {
    render();
    linkTree.set(sampleTree);
    (await screen.findByRole("button", { name: /Tambah Tautan/ })).click();
    expect(await screen.findByRole("dialog", { name: "Tambah Tautan" })).toBeInTheDocument();
    screen.getByLabelText("Tutup").click();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("mengubah tautan lewat modal", async () => {
    render();
    linkTree.set(sampleTree);
    (await screen.findByLabelText("Ubah tautan Dasar Java")).click();
    expect(await screen.findByRole("dialog", { name: "Ubah Tautan" })).toBeInTheDocument();
    expect(screen.getByLabelText("Judul Tautan")).toHaveValue("Dasar Java");
  });

  it("menghapus tautan setelah konfirmasi", async () => {
    showConfirmDialog.mockResolvedValue(true);
    render();
    linkTree.set(sampleTree);
    (await screen.findByLabelText("Hapus tautan Dasar Java")).click();
    await waitFor(() => expect(deleteItem).toHaveBeenCalledWith(7, 11));
  });

  it("tidak menghapus tautan bila dibatalkan", async () => {
    showConfirmDialog.mockResolvedValue(false);
    render();
    linkTree.set(sampleTree);
    (await screen.findByLabelText("Hapus tautan Dasar Java")).click();
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(deleteItem).not.toHaveBeenCalled();
  });

  it("memperbarui tampilan saat data berubah tetapi tipe, jumlah, dan url tautan sama", async () => {
    render();
    linkTree.set(sampleTree);
    expect(await screen.findByRole("heading", { name: "Kursus Ku" })).toBeInTheDocument();
    linkTree.set({
      ...sampleTree,
      title: "Kursus Baru",
      items: sampleTree.items.map((item) => ({ ...item })),
    });
    expect(await screen.findByRole("heading", { name: "Kursus Baru" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Daftar Tautan (1)" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Dasar Java/ })).toHaveAttribute("href", "https://youtu.be/abc");
    expect(screen.getByText("Publik")).toBeInTheDocument();
  });

  it("menangani meta tipe dan data tautan yang kosong", async () => {
    TYPE_META.custom = { label: undefined, badge: undefined, icon: Globe };
    try {
      render();
      linkTree.set({
        ...sampleTree,
        type: "custom",
        items: [{ id: 5, link_tree_id: 7, title: null, url: null }],
      });
      expect(await screen.findByRole("heading", { name: "Kursus Ku" })).toBeInTheDocument();
      expect(screen.getByRole("heading", { name: "Daftar Tautan (1)" })).toBeInTheDocument();
    } finally {
      delete TYPE_META.custom;
      linkTree.set(null);
    }
  });

  it("bukan pemilik melihat tautan tanpa tombol ubah dan hapus", async () => {
    render();
    linkTree.set({ ...sampleTree, user_id: 99 });
    expect(await screen.findByRole("link", { name: /Dasar Java/ })).toBeInTheDocument();
    expect(screen.queryByLabelText("Ubah tautan Dasar Java")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Hapus tautan Dasar Java")).not.toBeInTheDocument();
  });

  it("tombol ubah dan hapus tautan mengikuti perubahan kepemilikan", async () => {
    render();
    linkTree.set(sampleTree);
    expect(await screen.findByLabelText("Ubah tautan Dasar Java")).toBeInTheDocument();
    linkTree.set({ ...sampleTree, user_id: 99 });
    await waitFor(() => expect(screen.queryByLabelText("Ubah tautan Dasar Java")).not.toBeInTheDocument());
    linkTree.set(sampleTree);
    expect(await screen.findByLabelText("Hapus tautan Dasar Java")).toBeInTheDocument();
  });

  it("mengunggah sampul lewat modal memakai id link tree", async () => {
    changeCover.mockResolvedValue(true);
    const cover = new File(["x"], "c.png", { type: "image/png" });
    render();
    linkTree.set(sampleTree);
    (await screen.findByRole("button", { name: /Ubah Sampul/ })).click();
    await fireEvent.change(await screen.findByLabelText("Gambar Sampul"), { target: { files: [cover] } });
    await fireEvent.submit(screen.getByRole("button", { name: "Unggah" }).closest("form"));
    await waitFor(() => expect(changeCover).toHaveBeenCalledWith(7, cover));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("menambah tautan lewat modal memakai id link tree", async () => {
    addItem.mockResolvedValue(true);
    render();
    linkTree.set(sampleTree);
    (await screen.findByRole("button", { name: /Tambah Tautan/ })).click();
    await fireEvent.input(await screen.findByLabelText("Judul Tautan"), { target: { value: "Docs" } });
    await fireEvent.input(screen.getByLabelText("URL"), { target: { value: "https://a.b" } });
    await fireEvent.submit(screen.getByRole("button", { name: "Simpan" }).closest("form"));
    await waitFor(() => expect(addItem).toHaveBeenCalledWith(7, { title: "Docs", url: "https://a.b" }));
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("menampilkan inisial penulis bila foto kosong", async () => {
    render();
    linkTree.set({ ...sampleTree, author: { name: "Delcom Testing", photo: "" } });
    expect(await screen.findByTestId("avatar-initial")).toHaveTextContent("D");
  });
});
