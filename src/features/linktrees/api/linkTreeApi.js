import { request } from "../../../helpers/apiHelper.js";

const base = "/link-trees";

export const postLinkTree = (data) => request(base, { method: "POST", body: data });
export const postCover = (id, file) => {
  const form = new FormData();
  form.append("cover", file);
  return request(`${base}/${id}/cover`, { method: "POST", form });
};
export const putLinkTree = (id, data) => request(`${base}/${id}`, { method: "PUT", body: data });
export const getLinkTrees = () => request(base);
export const getLinkTree = (id) => request(`${base}/${id}`);
export const deleteLinkTree = (id) => request(`${base}/${id}`, { method: "DELETE" });
export const deleteAllLinkTrees = () => request(base, { method: "DELETE" });

export const postItem = (id, data) =>
  request(`${base}/${id}/items`, { method: "POST", body: data });
export const putItem = (id, itemId, data) =>
  request(`${base}/${id}/items/${itemId}`, { method: "PUT", body: data });
export const deleteItem = (id, itemId) =>
  request(`${base}/${id}/items/${itemId}`, { method: "DELETE" });
