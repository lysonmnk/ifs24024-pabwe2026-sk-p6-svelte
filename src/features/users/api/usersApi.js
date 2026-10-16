import { request } from "../../../helpers/apiHelper.js";

export const getUsers = () => request("/users");
export const getMe = () => request("/users/me");
export const putMe = (data) => request("/users/me", { method: "PUT", body: data });
export const postPhoto = (file) => {
  const form = new FormData();
  form.append("photo", file);
  return request("/users/photo", { method: "POST", form });
};
export const putPassword = (data) =>
  request("/users/change-password", { method: "PUT", body: data });
