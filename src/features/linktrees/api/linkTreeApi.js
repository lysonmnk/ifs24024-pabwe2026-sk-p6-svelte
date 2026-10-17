import { apiRequest } from "../../../helpers/apiHelper.js";

export function postLinkTree({ title, type, description }) {
  return apiRequest("/link-trees", {
    method: "POST",
    body: { title, type, description },
  });
}

export function postCover(id, file) {
  const formData = new FormData();
  formData.append("cover", file);
  return apiRequest(`/link-trees/${id}/cover`, { method: "POST", formData });
}

export function putLinkTree(id, { title, type, description }) {
  return apiRequest(`/link-trees/${id}`, {
    method: "PUT",
    body: { title, type, description },
  });
}

export function getLinkTrees(isMe) {
  return apiRequest(isMe ? "/link-trees?is_me=1" : "/link-trees");
}

export function getLinkTree(id) {
  return apiRequest(`/link-trees/${id}`);
}

export function deleteLinkTree(id) {
  return apiRequest(`/link-trees/${id}`, { method: "DELETE" });
}

export function deleteAllLinkTrees() {
  return apiRequest("/link-trees", { method: "DELETE" });
}

export function postItem(linkTreeId, { title, url }) {
  return apiRequest(`/link-trees/${linkTreeId}/items`, {
    method: "POST",
    body: { title, url },
  });
}

export function putItem(linkTreeId, itemId, { title, url }) {
  return apiRequest(`/link-trees/${linkTreeId}/items/${itemId}`, {
    method: "PUT",
    body: { title, url },
  });
}

export function deleteItem(linkTreeId, itemId) {
  return apiRequest(`/link-trees/${linkTreeId}/items/${itemId}`, {
    method: "DELETE",
  });
}
