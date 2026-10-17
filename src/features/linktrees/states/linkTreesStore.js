import { writable, get } from "svelte/store";
import * as api from "../api/linkTreeApi.js";
import { getErrorMessage } from "../../../helpers/apiHelper.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

// koleksi & detail
export const linkTrees = writable([]);
export const linkTree = writable(null);
export const filterMine = writable(false);

// bendera pemuatan
export const isLoading = writable(false);
export const isDetailLoading = writable(false);

// bendera mutasi
export const isAdding = writable(false);
export const isChanging = writable(false);
export const isChangingCover = writable(false);
export const isDeleting = writable(false);
export const isDeletingAll = writable(false);
export const isItemMutating = writable(false);

export async function fetchLinkTrees() {
  isLoading.set(true);
  const res = await api.getLinkTrees(get(filterMine));
  isLoading.set(false);

  if (res.status !== "success") {
    linkTrees.set([]);
    await showErrorDialog(getErrorMessage(res));
    return false;
  }

  linkTrees.set(res.data.link_trees);
  return true;
}

export async function fetchLinkTree(id) {
  isDetailLoading.set(true);
  const res = await api.getLinkTree(id);
  isDetailLoading.set(false);

  if (res.status !== "success") {
    linkTree.set(null);
    await showErrorDialog(getErrorMessage(res));
    return false;
  }

  linkTree.set(res.data.link_tree);
  return true;
}

async function mutate(flag, call, onSuccess) {
  flag.set(true);
  const res = await call();
  flag.set(false);

  if (res.status !== "success") {
    await showErrorDialog(getErrorMessage(res));
    return false;
  }

  await showSuccessDialog(res.message);
  await onSuccess();
  return true;
}

export const addLinkTree = (payload) =>
  mutate(isAdding, () => api.postLinkTree(payload), () => fetchLinkTrees());

export const changeLinkTree = (id, payload) =>
  mutate(isChanging, () => api.putLinkTree(id, payload), () => fetchLinkTree(id));

export const changeCover = (id, file) =>
  mutate(isChangingCover, () => api.postCover(id, file), () => fetchLinkTree(id));

export const deleteLinkTree = (id) =>
  mutate(isDeleting, () => api.deleteLinkTree(id), () => fetchLinkTrees());

export const deleteAllLinkTrees = () =>
  mutate(isDeletingAll, () => api.deleteAllLinkTrees(), () => fetchLinkTrees());

export const addItem = (linkTreeId, payload) =>
  mutate(isItemMutating, () => api.postItem(linkTreeId, payload), () => fetchLinkTree(linkTreeId));

export const changeItem = (linkTreeId, itemId, payload) =>
  mutate(
    isItemMutating,
    () => api.putItem(linkTreeId, itemId, payload),
    () => fetchLinkTree(linkTreeId)
  );

export const deleteItem = (linkTreeId, itemId) =>
  mutate(
    isItemMutating,
    () => api.deleteItem(linkTreeId, itemId),
    () => fetchLinkTree(linkTreeId)
  );
