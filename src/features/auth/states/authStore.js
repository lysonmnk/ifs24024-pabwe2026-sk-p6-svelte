import { writable } from "svelte/store";
import * as api from "../api/authApi.js";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  isSuccess,
} from "../../../helpers/apiHelper.js";
import { loadProfile, resetUsers } from "../../users/states/usersStore.js";

export const authToken = writable(getAccessToken());
export const isAuthLogin = writable(false);
export const isAuthRegister = writable(false);

export async function login(email, password) {
  const res = await api.postLogin({ email, password });
  if (isSuccess(res)) {
    putAccessToken(res.data.token);
    authToken.set(res.data.token);
    isAuthLogin.set(true);
    await loadProfile();
  }
  return res;
}

export async function register(name, email, password) {
  const res = await api.postRegister({ name, email, password });
  if (isSuccess(res)) isAuthRegister.set(true);
  return res;
}

export function logout() {
  removeAccessToken();
  authToken.set(null);
  isAuthLogin.set(false);
  resetUsers();
}
