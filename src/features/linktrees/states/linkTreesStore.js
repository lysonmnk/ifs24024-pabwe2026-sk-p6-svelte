import { writable } from "svelte/store";
import * as api from "../api/linkTreeApi.js";
import { isSuccess } from "../../../helpers/apiHelper.js";

export const linkTrees = writable([]);
export const linkTree = writable(null);
export const isAdded = writable(false);
export const isChanged = writable(false);
export const isCoverChanged = writable(false);
export const isDeleted = writable(false);
export const isAllDeleted = writable(false);
export const isItemChanged = writable(false);

export async function loadLinkTrees() {
  const res = await api.getLinkTrees();
  linkTrees.set(isSuccess(res) ? res.data.link_trees : []);
  return res;
}

export async function loadLinkTree(id) {
  const res = await api.getLinkTree(id);
  linkTree.set(
    isSuccess(res) ? { ...res.data.link_tree, items: res.data.link_tree.items || [] } : null
  );
  return res;
}

async function mutate(call, flag, reload) {
  const res = await call();
  if (isSuccess(res)) {
    flag.set(true);
    await reload();
  }
  return res;
}

export const addLinkTree = (data) => mutate(() => api.postLinkTree(data), isAdded, loadLinkTrees);
export const changeLinkTree = (id, data) =>
  mutate(() => api.putLinkTree(id, data), isChanged, () => loadLinkTree(id));
export const changeCover = (id, file) =>
  mutate(() => api.postCover(id, file), isCoverChanged, () => loadLinkTree(id));
export const removeLinkTree = (id) =>
  mutate(() => api.deleteLinkTree(id), isDeleted, loadLinkTrees);
export const removeAllLinkTrees = () =>
  mutate(() => api.deleteAllLinkTrees(), isAllDeleted, loadLinkTrees);

export const addItem = (id, data) =>
  mutate(() => api.postItem(id, data), isItemChanged, () => loadLinkTree(id));
export const changeItem = (id, itemId, data) =>
  mutate(() => api.putItem(id, itemId, data), isItemChanged, () => loadLinkTree(id));
export const removeItem = (id, itemId) =>
  mutate(() => api.deleteItem(id, itemId), isItemChanged, () => loadLinkTree(id));

export function resetLinkTrees() {
  linkTrees.set([]);
  linkTree.set(null);
  [isAdded, isChanged, isCoverChanged, isDeleted, isAllDeleted, isItemChanged].forEach((flag) =>
    flag.set(false)
  );
}
