import { get } from "svelte/store";
import * as store from "./linkTreesStore.js";
import { mockApi, okResponse, failResponse, resetAllStores, sampleTree } from "../../../test-utils.js";

const listRoutes = {
  "GET /link-trees": okResponse({ link_trees: [sampleTree] }),
  "GET /link-trees/t1": okResponse({ link_tree: sampleTree }),
};

describe("linkTreesStore", () => {
  beforeEach(resetAllStores);

  it("loadLinkTrees sukses dan gagal", async () => {
    mockApi(listRoutes);
    await store.loadLinkTrees();
    expect(get(store.linkTrees)).toEqual([sampleTree]);
    mockApi({ "GET /link-trees": failResponse() });
    await store.loadLinkTrees();
    expect(get(store.linkTrees)).toEqual([]);
  });

  it("loadLinkTree sukses (dengan dan tanpa items) dan gagal", async () => {
    mockApi(listRoutes);
    await store.loadLinkTree("t1");
    expect(get(store.linkTree).items).toHaveLength(1);
    const { items, ...noItems } = sampleTree;
    mockApi({ "GET /link-trees/t1": okResponse({ link_tree: noItems }) });
    await store.loadLinkTree("t1");
    expect(get(store.linkTree).items).toEqual([]);
    mockApi({ "GET /link-trees/t1": failResponse() });
    await store.loadLinkTree("t1");
    expect(get(store.linkTree)).toBeNull();
  });

  it("mutasi daftar menyalakan bendera dan memuat ulang", async () => {
    mockApi({
      ...listRoutes,
      "POST /link-trees": okResponse(),
      "DELETE /link-trees/t1": okResponse(),
      "DELETE /link-trees": okResponse(),
    });
    await store.addLinkTree({});
    await store.removeLinkTree("t1");
    await store.removeAllLinkTrees();
    expect(get(store.isAdded)).toBe(true);
    expect(get(store.isDeleted)).toBe(true);
    expect(get(store.isAllDeleted)).toBe(true);
    expect(get(store.linkTrees)).toEqual([sampleTree]);
  });

  it("mutasi detail dan item memuat ulang detail", async () => {
    mockApi({
      ...listRoutes,
      "PUT /link-trees/t1": okResponse(),
      "POST /link-trees/t1/cover": okResponse(),
      "POST /link-trees/t1/items": okResponse(),
      "PUT /link-trees/t1/items/i1": okResponse(),
      "DELETE /link-trees/t1/items/i1": okResponse(),
    });
    await store.changeLinkTree("t1", {});
    await store.changeCover("t1", new File(["x"], "c.png"));
    await store.addItem("t1", {});
    await store.changeItem("t1", "i1", {});
    await store.removeItem("t1", "i1");
    expect(get(store.isChanged)).toBe(true);
    expect(get(store.isCoverChanged)).toBe(true);
    expect(get(store.isItemChanged)).toBe(true);
    expect(get(store.linkTree).id).toBe("t1");
  });

  it("mutasi gagal tidak menyalakan bendera; reset mengosongkan state", async () => {
    mockApi({ "POST /link-trees": failResponse() });
    await store.addLinkTree({});
    expect(get(store.isAdded)).toBe(false);
    store.isAdded.set(true);
    store.linkTree.set(sampleTree);
    store.resetLinkTrees();
    expect(get(store.isAdded)).toBe(false);
    expect(get(store.linkTree)).toBeNull();
  });
});
