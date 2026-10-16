import { get } from "svelte/store";
import { authToken, isAuthLogin, isAuthRegister, login, register, logout } from "./authStore.js";
import { profile } from "../../users/states/usersStore.js";
import { getAccessToken } from "../../../helpers/apiHelper.js";
import { mockApi, okResponse, failResponse, resetAllStores, sampleUser } from "../../../test-utils.js";

describe("authStore", () => {
  beforeEach(resetAllStores);

  it("login berhasil menyimpan token dan memuat profil", async () => {
    mockApi({
      "POST /auth/login": okResponse({ token: "tok" }),
      "GET /users/me": okResponse({ user: sampleUser }),
    });
    const res = await login("a@a.com", "pw");
    expect(res.status).toBe("success");
    expect(get(authToken)).toBe("tok");
    expect(getAccessToken()).toBe("tok");
    expect(get(isAuthLogin)).toBe(true);
    expect(get(profile)).toEqual(sampleUser);
  });

  it("login gagal tidak mengubah state", async () => {
    mockApi({ "POST /auth/login": failResponse("salah") });
    const res = await login("a", "b");
    expect(res.message).toBe("salah");
    expect(get(authToken)).toBeNull();
    expect(get(isAuthLogin)).toBe(false);
  });

  it("register berhasil dan gagal", async () => {
    mockApi({ "POST /auth/register": okResponse() });
    await register("n", "e", "p");
    expect(get(isAuthRegister)).toBe(true);
    isAuthRegister.set(false);
    mockApi({ "POST /auth/register": failResponse() });
    await register("n", "e", "p");
    expect(get(isAuthRegister)).toBe(false);
  });

  it("logout menghapus sesi", () => {
    localStorage.setItem("token", "x");
    authToken.set("x");
    profile.set(sampleUser);
    logout();
    expect(getAccessToken()).toBeNull();
    expect(get(authToken)).toBeNull();
    expect(get(profile)).toBeNull();
  });
});
