import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";

vi.mock("../api/authApi.js", () => ({
  postLogin: vi.fn(),
  postRegister: vi.fn(),
  postLogout: vi.fn(),
}));
vi.mock("../../users/api/userApi.js", () => ({ getProfile: vi.fn() }));
vi.mock("../../../helpers/toolsHelper.js", () => ({
  showErrorDialog: vi.fn(),
  showSuccessDialog: vi.fn(),
}));

import { postLogin, postRegister, postLogout } from "../api/authApi.js";
import { getProfile } from "../../users/api/userApi.js";
import { showErrorDialog, showSuccessDialog } from "../../../helpers/toolsHelper.js";
import { getAccessToken, putAccessToken } from "../../../helpers/apiHelper.js";
import {
  authProfile,
  isPreload,
  isAuthLogin,
  isAuthRegister,
  isAuthLogout,
  loadProfile,
  login,
  register,
  logout,
} from "./authStore.js";

const user = { id: 1, name: "Delcom" };

beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
  authProfile.set(null);
  isPreload.set(true);
});

describe("loadProfile", () => {
  it("tanpa token langsung selesai preload", async () => {
    await loadProfile();
    expect(getProfile).not.toHaveBeenCalled();
    expect(get(isPreload)).toBe(false);
  });

  it("mengisi profil bila token valid", async () => {
    putAccessToken("tok");
    getProfile.mockResolvedValue({ status: "success", data: { user } });
    await loadProfile();
    expect(get(authProfile)).toEqual(user);
    expect(get(isPreload)).toBe(false);
  });

  it("membersihkan token bila tidak valid", async () => {
    putAccessToken("tok");
    getProfile.mockResolvedValue({ status: "fail", message: "Unauthenticated." });
    await loadProfile();
    expect(getAccessToken()).toBeNull();
    expect(get(authProfile)).toBeNull();
    expect(get(isPreload)).toBe(false);
  });
});

describe("login", () => {
  it("berhasil: simpan token dan muat profil", async () => {
    postLogin.mockResolvedValue({ status: "success", data: { token: "t1", user } });
    getProfile.mockResolvedValue({ status: "success", data: { user } });
    expect(await login({ email: "a", password: "b" })).toBe(true);
    expect(getAccessToken()).toBe("t1");
    expect(get(authProfile)).toEqual(user);
    expect(get(isAuthLogin)).toBe(false);
  });

  it("gagal: tampilkan dialog error", async () => {
    postLogin.mockResolvedValue({ status: "fail", message: "Kredensial akun tidak ditemukan" });
    expect(await login({ email: "a", password: "b" })).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Kredensial akun tidak ditemukan");
    expect(getAccessToken()).toBeNull();
  });
});

describe("register", () => {
  it("berhasil", async () => {
    postRegister.mockResolvedValue({ status: "success", message: "Berhasil melakukan pendaftaran" });
    expect(await register({ name: "n", email: "e", password: "p" })).toBe(true);
    expect(showSuccessDialog).toHaveBeenCalledWith("Berhasil melakukan pendaftaran");
    expect(get(isAuthRegister)).toBe(false);
  });

  it("gagal", async () => {
    postRegister.mockResolvedValue({ status: "fail", message: "Data tidak valid", data: { email: ["Email sudah dipakai"] } });
    expect(await register({ name: "n", email: "e", password: "p" })).toBe(false);
    expect(showErrorDialog).toHaveBeenCalledWith("Data tidak valid\nEmail sudah dipakai");
  });
});

describe("logout", () => {
  it("menghapus token dan profil", async () => {
    putAccessToken("tok");
    authProfile.set(user);
    postLogout.mockResolvedValue({ status: "success" });
    await logout();
    expect(getAccessToken()).toBeNull();
    expect(get(authProfile)).toBeNull();
    expect(get(isAuthLogout)).toBe(false);
  });
});
