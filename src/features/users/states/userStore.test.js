import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";

vi.mock("../api/userApi.js", () => ({
  getUsers: vi.fn(),
  putProfile: vi.fn(),
  postPhoto: vi.fn(),
  putPassword: vi.fn(),
}));
vi.mock("../../auth/states/authStore.js", async () => {
  const { writable } = await import("svelte/store");
  return { authProfile: writable(null), loadProfile: vi.fn() };
});
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

import { getUsers, putProfile, postPhoto, putPassword } from "../api/userApi.js";
import { authProfile, loadProfile } from "../../auth/states/authStore.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";
import {
  users,
  isUsersLoading,
  fetchUsers,
  updateProfile,
  changePhoto,
  changePassword,
  isProfileUpdating,
} from "./userStore.js";

beforeEach(() => {
  vi.clearAllMocks();
  users.set([]);
  authProfile.set(null);
});

describe("fetchUsers", () => {
  it("berhasil", async () => {
    getUsers.mockResolvedValue({ status: "success", data: { users: [{ id: 1 }] } });
    expect(await fetchUsers()).toBe(true);
    expect(get(users)).toEqual([{ id: 1 }]);
    expect(get(isUsersLoading)).toBe(false);
  });

  it("gagal", async () => {
    users.set([{ id: 9 }]);
    getUsers.mockResolvedValue({ status: "fail", message: "Unauthenticated." });
    expect(await fetchUsers()).toBe(false);
    expect(get(users)).toEqual([]);
    expect(showErrorDialog).toHaveBeenCalledWith("Unauthenticated.");
  });
});

describe("mutasi profil", () => {
  it("updateProfile berhasil memperbarui authProfile", async () => {
    putProfile.mockResolvedValue({ status: "success", message: "ok", data: { user: { id: 1, name: "Baru" } } });
    expect(await updateProfile({ name: "Baru", email: "e" })).toBe(true);
    expect(get(authProfile)).toEqual({ id: 1, name: "Baru" });
    expect(showSuccessDialog).toHaveBeenCalledWith("ok");
    expect(get(isProfileUpdating)).toBe(false);
  });

  it("updateProfile gagal", async () => {
    putProfile.mockResolvedValue({ status: "fail", message: "Data tidak valid" });
    expect(await updateProfile({ name: "", email: "" })).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Data tidak valid");
    expect(get(authProfile)).toBeNull();
  });

  it("changePhoto berhasil memuat ulang profil", async () => {
    postPhoto.mockResolvedValue({ status: "success", message: "ok" });
    expect(await changePhoto(new File(["x"], "a.png"))).toBe(true);
    expect(loadProfile).toHaveBeenCalled();
  });

  it("changePassword berhasil", async () => {
    putPassword.mockResolvedValue({ status: "success", message: "Berhasil mengubah kata sandi" });
    expect(await changePassword({ password: "a", newPassword: "b", confirmation: "b" })).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil mengubah kata sandi");
  });
});
