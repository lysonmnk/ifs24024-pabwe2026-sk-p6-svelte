import { apiRequest } from "../../../helpers/apiHelper.js";

export function postLogin({ email, password }) {
  return apiRequest("/auth/login", {
    method: "POST",
    body: { email, password },
    auth: false,
  });
}

export function postRegister({ name, email, password }) {
  return apiRequest("/auth/register", {
    method: "POST",
    body: { name, email, password },
    auth: false,
  });
}

export function postLogout() {
  return apiRequest("/auth/logout", { method: "POST" });
}
