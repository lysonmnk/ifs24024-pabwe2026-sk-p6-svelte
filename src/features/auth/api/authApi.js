import { request } from "../../../helpers/apiHelper.js";

export const postLogin = (data) => request("/auth/login", { method: "POST", body: data });
export const postRegister = (data) => request("/auth/register", { method: "POST", body: data });
