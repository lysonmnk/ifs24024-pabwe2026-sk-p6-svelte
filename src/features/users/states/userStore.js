import { writable } from "svelte/store";
import { getUsers, putProfile, postPhoto, putPassword } from "../api/userApi.js";
import { authProfile, loadProfile } from "../../auth/states/authStore.js";
import { getErrorMessage } from "../../../helpers/apiHelper.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";

export const users = writable([]);
export const isUsersLoading = writable(false);
export const isProfileUpdating = writable(false);
export const isPhotoUpdating = writable(false);
export const isPasswordUpdating = writable(false);

export async function fetchUsers() {
  isUsersLoading.set(true);
  const res = await getUsers();
  isUsersLoading.set(false);

  if (res.status !== "success") {
    users.set([]);
    await showErrorDialog(getErrorMessage(res));
    return false;
  }

  users.set(res.data.users);
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
  await onSuccess(res);
  return true;
}

export const updateProfile = (payload) =>
  mutate(isProfileUpdating, () => putProfile(payload), (res) => authProfile.set(res.data.user));

export const changePhoto = (file) =>
  mutate(isPhotoUpdating, () => postPhoto(file), () => loadProfile());

export const changePassword = (payload) =>
  mutate(isPasswordUpdating, () => putPassword(payload), () => {});
