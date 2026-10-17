import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders, sampleTree } from "../../../test-utils.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => ({
  ...(await importOriginal()),
  showConfirmDialog: vi.fn(),
}));
vi.mock("../states/linkTreesStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  fetchLinkTrees: vi.fn(),
  deleteLinkTree: vi.fn(),
  deleteAllLinkTrees: vi.fn(),
}));

import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
import {
  linkTrees,
  isLoading,
  filterMine,
  fetchLinkTrees,
  deleteLinkTree,
  deleteAllLinkTrees,
} from "../states/linkTreesStore.js";
import { Globe } from "lucide-svelte";
import { TYPE_META } from "../linkTreeTypes.js";
import HomePage from "./HomePage.svelte";

const trees = [
  sampleTree,
  {
    ...sampleTree,
    id: 8,
    user_id: 2,
    title: "Alat Desain",
    type: "unlisted",
    description: "Figma dan kawan-kawan",
    cover: "http://localhost:8000/",
    total_links: 3,
    author: { name: "Orang Lain", photo: "" },
  },
  { ...sampleTree, id: 9, user_id: 2, type: "private", title: "Rahasia", description: "x", total_links: 0 },
];

describe("HomePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    linkTrees.set(trees);
    isLoading.set(false);
    filterMine.set(false);
  });

  it("memuat data saat dibuka dan menampilkan kartu serta statistik", () => {
    renderWithProviders(HomePage);
    expect(fetchLinkTrees).toHaveBeenCalled();
    expect(screen.getByText("Kursus Ku")).toBeInTheDocument();
    expect(screen.getByText("Alat Desain")).toBeInTheDocument();
    expect(screen.getByText("Total Tautan")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument(); // 2 + 3 + 0
    // tombol hapus hanya untuk milik sendiri
    expect(screen.getByLabelText("Hapus Kursus Ku")).toBeInTheDocument();
    expect(screen.queryByLabelText("Hapus Alat Desain")).not.toBeInTheDocument();
  });

  it("menampilkan status memuat", () => {
    isLoading.set(true);
    renderWithProviders(HomePage);
    expect(screen.getByText("Memuat data...")).toBeInTheDocument();
  });

  it("menampilkan status kosong", () => {
    linkTrees.set([]);
    renderWithProviders(HomePage);
    expect(screen.getByText("Belum ada link tree.")).toBeInTheDocument();
  });

  it("mencari berdasarkan judul/deskripsi", async () => {
    renderWithProviders(HomePage);
    await fireEvent.input(screen.getByLabelText("Cari link tree"), { target: { value: "figma" } });
    expect(screen.getByText("Alat Desain")).toBeInTheDocument();
    expect(screen.queryByText("Kursus Ku")).not.toBeInTheDocument();
  });

  it("filter milik saya memuat ulang data", async () => {
    renderWithProviders(HomePage);
    fetchLinkTrees.mockClear();
    await fireEvent.click(screen.getByLabelText("Milik saya"));
    expect(get(filterMine)).toBe(true);
    expect(fetchLinkTrees).toHaveBeenCalledTimes(1);
  });

  it("menghapus satu link tree setelah konfirmasi", async () => {
    showConfirmDialog.mockResolvedValue(true);
    renderWithProviders(HomePage);
    screen.getByLabelText("Hapus Kursus Ku").click();
    await waitFor(() => expect(deleteLinkTree).toHaveBeenCalledWith(7));
  });

  it("tidak menghapus bila dibatalkan", async () => {
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(HomePage);
    screen.getByLabelText("Hapus Kursus Ku").click();
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(deleteLinkTree).not.toHaveBeenCalled();
  });

  it("menghapus semua setelah konfirmasi", async () => {
    showConfirmDialog.mockResolvedValue(true);
    renderWithProviders(HomePage);
    screen.getByRole("button", { name: /Hapus Semua/ }).click();
    await waitFor(() => expect(deleteAllLinkTrees).toHaveBeenCalled());
  });

  it("hapus semua dibatalkan", async () => {
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(HomePage);
    screen.getByRole("button", { name: /Hapus Semua/ }).click();
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(deleteAllLinkTrees).not.toHaveBeenCalled();
  });

  it("membuka dan menutup modal tambah", async () => {
    renderWithProviders(HomePage);
    screen.getByRole("button", { name: /Tambah/ }).click();
    expect(await screen.findByRole("dialog", { name: "Tambah Link Tree" })).toBeInTheDocument();
    screen.getByLabelText("Tutup").click();
    await waitFor(() => expect(screen.queryByRole("dialog")).not.toBeInTheDocument());
  });

  it("memperbarui kartu saat data berubah tetapi tipe dan statistik sama", async () => {
    renderWithProviders(HomePage);
    linkTrees.set(trees);
    expect(await screen.findByText("Alat Desain")).toBeInTheDocument();
    linkTrees.set(
      trees.map((tree) => ({ ...tree, author: { ...tree.author }, description: `${tree.description}!` }))
    );
    expect(await screen.findByText("Figma dan kawan-kawan!")).toBeInTheDocument();
    expect(screen.getByText("Alat Desain")).toBeInTheDocument();
    expect(screen.getByText("Orang Lain")).toBeInTheDocument();
    expect(screen.getByText("· 3 tautan")).toBeInTheDocument();
  });

  it("menangani meta tipe dan jumlah tautan yang kosong", async () => {
    TYPE_META.custom = { label: undefined, badge: undefined, icon: Globe };
    try {
      renderWithProviders(HomePage);
      linkTrees.set([{ ...sampleTree, id: 20, type: "custom", total_links: null }]);
      // Teks ini hanya ada setelah store diperbarui (render awal menampilkan "· 2 tautan").
      expect(await screen.findByText("· tautan")).toBeInTheDocument();
      expect(screen.getByText("Kursus Ku")).toBeInTheDocument();
    } finally {
      delete TYPE_META.custom;
      linkTrees.set([]);
    }
  });
});
