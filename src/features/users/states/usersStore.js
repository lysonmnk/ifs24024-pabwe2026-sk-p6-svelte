import { writable } from "svelte/store";
import * as api from "../api/usersApi.js";
import { isSuccess } from "../../../helpers/apiHelper.js";

export const users = writable([]);
export const profile = writable(null);
export const isProfileUpdated = writable(false);
export const isPhotoUpdated = writable(false);
export const isPasswordChanged = writable(false);

export async function loadUsers() {
  const res = await api.getUsers();
  users.set(isSuccess(res) ? res.data.users : []);
  return res;
}

export async function loadProfile() {
  const res = await api.getMe();
  profile.set(isSuccess(res) ? res.data.user : null);
  return res;
}

async function mutate(call, flag) {
  const res = await call();
  if (isSuccess(res)) {
    flag.set(true);
    await loadProfile();
  }
  return res;
}

export const updateProfile = (data) => mutate(() => api.putMe(data), isProfileUpdated);
export const updatePhoto = (file) => mutate(() => api.postPhoto(file), isPhotoUpdated);

export async function changePassword(data) {
  const res = await api.putPassword(data);
  if (isSuccess(res)) isPasswordChanged.set(true);
  return res;
}

export function resetUsers() {
  users.set([]);
  profile.set(null);
  isProfileUpdated.set(false);
  isPhotoUpdated.set(false);
  isPasswordChanged.set(false);
}
