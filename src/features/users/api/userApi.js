import { apiRequest } from "../../../helpers/apiHelper.js";

export function getUsers() {
  return apiRequest("/users");
}

export function getProfile() {
  return apiRequest("/users/me");
}

export function putProfile({ name, email }) {
  return apiRequest("/users/me", { method: "PUT", body: { name, email } });
}

export function postPhoto(file) {
  const formData = new FormData();
  formData.append("photo", file);
  return apiRequest("/users/me/photo", { method: "POST", formData });
}

export function putPassword({ password, newPassword, confirmation }) {
  return apiRequest("/users/password", {
    method: "PUT",
    body: {
      password,
      new_password: newPassword,
      new_password_confirmation: confirmation,
    },
  });
}
