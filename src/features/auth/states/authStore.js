import { writable } from "svelte/store";
import { postLogin, postRegister, postLogout } from "../api/authApi.js";
import { getProfile } from "../../users/api/userApi.js";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  getErrorMessage,
} from "../../../helpers/apiHelper.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export const authProfile = writable(null);
export const isPreload = writable(true);
export const isAuthLogin = writable(false);
export const isAuthRegister = writable(false);
export const isAuthLogout = writable(false);

/** Muat profil dari token tersimpan. Token tidak valid akan dibersihkan. */
export async function loadProfile() {
  if (!getAccessToken()) {
    isPreload.set(false);
    return;
  }

  const res = await getProfile();
  if (res.status === "success") {
    authProfile.set(res.data.user);
  } else {
    removeAccessToken();
    authProfile.set(null);
  }
  isPreload.set(false);
}

export async function login({ email, password }) {
  isAuthLogin.set(true);
  const res = await postLogin({ email, password });
  isAuthLogin.set(false);

  if (res.status !== "success") {
    await showErrorDialog(getErrorMessage(res));
    return false;
  }

  putAccessToken(res.data.token);
  await loadProfile();
  return true;
}

export async function register({ name, email, password }) {
  isAuthRegister.set(true);
  const res = await postRegister({ name, email, password });
  isAuthRegister.set(false);

  if (res.status !== "success") {
    await showErrorDialog(getErrorMessage(res));
    return false;
  }

  await showSuccessDialog(res.message);
  return true;
}

export async function logout() {
  isAuthLogout.set(true);
  await postLogout();
  removeAccessToken();
  authProfile.set(null);
  isAuthLogout.set(false);
}
