import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";

vi.mock("../api/linkTreeApi.js", () => ({
  getLinkTrees: vi.fn(),
  getLinkTree: vi.fn(),
  postLinkTree: vi.fn(),
  putLinkTree: vi.fn(),
  postCover: vi.fn(),
  deleteLinkTree: vi.fn(),
  deleteAllLinkTrees: vi.fn(),
  postItem: vi.fn(),
  putItem: vi.fn(),
  deleteItem: vi.fn(),
}));
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

import * as api from "../api/linkTreeApi.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";
import * as store from "./linkTreesStore.js";

const ok = (extra) => ({ status: "success", message: "Berhasil", ...extra });
const fail = { status: "fail", message: "Data tidak valid", data: { title: ["Judul wajib"] } };
const file = new File(["x"], "c.png");

beforeEach(() => {
  vi.clearAllMocks();
  store.linkTrees.set([]);
  store.linkTree.set(null);
  store.filterMine.set(false);
  api.getLinkTrees.mockResolvedValue(ok({ data: { link_trees: [{ id: 1 }] } }));
  api.getLinkTree.mockResolvedValue(ok({ data: { link_tree: { id: 5, items: [] } } }));
});

describe("fetchLinkTrees", () => {
  it("berhasil mengikuti filterMine", async () => {
    store.filterMine.set(true);
    expect(await store.fetchLinkTrees()).toBe(true);
    expect(api.getLinkTrees).toHaveBeenCalledWith(true);
    expect(get(store.linkTrees)).toEqual([{ id: 1 }]);
    expect(get(store.isLoading)).toBe(false);
  });

  it("gagal mengosongkan koleksi", async () => {
    store.linkTrees.set([{ id: 9 }]);
    api.getLinkTrees.mockResolvedValue(fail);
    expect(await store.fetchLinkTrees()).toBe(false);
    expect(get(store.linkTrees)).toEqual([]);
    expect(showErrorDialog).toHaveBeenCalledWith("Data tidak valid\nJudul wajib");
  });
});

describe("fetchLinkTree", () => {
  it("berhasil", async () => {
    expect(await store.fetchLinkTree(5)).toBe(true);
    expect(get(store.linkTree)).toEqual({ id: 5, items: [] });
    expect(get(store.isDetailLoading)).toBe(false);
  });

  it("gagal mengosongkan detail", async () => {
    store.linkTree.set({ id: 1 });
    api.getLinkTree.mockResolvedValue(fail);
    expect(await store.fetchLinkTree(5)).toBe(false);
    expect(get(store.linkTree)).toBeNull();
    expect(showErrorDialog).toHaveBeenCalled();
  });
});

// [nama aksi, argumen, fungsi API, flag, fungsi yang dipanggil ulang]
const mutations = [
  ["addLinkTree", [{ title: "T" }], "postLinkTree", "isAdding", "getLinkTrees"],
  ["changeLinkTree", [5, { title: "T" }], "putLinkTree", "isChanging", "getLinkTree"],
  ["changeCover", [5, file], "postCover", "isChangingCover", "getLinkTree"],
  ["deleteLinkTree", [5], "deleteLinkTree", "isDeleting", "getLinkTrees"],
  ["deleteAllLinkTrees", [], "deleteAllLinkTrees", "isDeletingAll", "getLinkTrees"],
  ["addItem", [5, { title: "A", url: "u" }], "postItem", "isItemMutating", "getLinkTree"],
  ["changeItem", [5, 9, { title: "A", url: "u" }], "putItem", "isItemMutating", "getLinkTree"],
  ["deleteItem", [5, 9], "deleteItem", "isItemMutating", "getLinkTree"],
];

describe.each(mutations)("%s", (action, args, apiFn, flag, refetch) => {
  it("berhasil: dialog sukses lalu muat ulang data", async () => {
    api[apiFn].mockResolvedValue(ok());
    expect(await store[action](...args)).toBe(true);
    expect(api[apiFn]).toHaveBeenCalledWith(...args);
    expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil");
    expect(api[refetch]).toHaveBeenCalled();
    expect(get(store[flag])).toBe(false);
  });

  it("gagal: dialog error dan tidak memuat ulang", async () => {
    api[apiFn].mockResolvedValue(fail);
    expect(await store[action](...args)).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Data tidak valid\nJudul wajib");
    expect(api[refetch]).not.toHaveBeenCalled();
    expect(get(store[flag])).toBe(false);
  });
});
