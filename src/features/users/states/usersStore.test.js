import { get } from "svelte/store";
import {
  users, profile, isProfileUpdated, isPhotoUpdated, isPasswordChanged,
  loadUsers, loadProfile, updateProfile, updatePhoto, changePassword, resetUsers,
} from "./usersStore.js";
import { mockApi, okResponse, failResponse, resetAllStores, sampleUser } from "../../../test-utils.js";

describe("usersStore", () => {
  beforeEach(resetAllStores);

  it("loadUsers sukses dan gagal", async () => {
    mockApi({ "GET /users": okResponse({ users: [sampleUser] }) });
    await loadUsers();
    expect(get(users)).toEqual([sampleUser]);
    mockApi({ "GET /users": failResponse() });
    await loadUsers();
    expect(get(users)).toEqual([]);
  });

  it("loadProfile sukses dan gagal", async () => {
    mockApi({ "GET /users/me": okResponse({ user: sampleUser }) });
    await loadProfile();
    expect(get(profile)).toEqual(sampleUser);
    mockApi({ "GET /users/me": failResponse() });
    await loadProfile();
    expect(get(profile)).toBeNull();
  });

  it("updateProfile dan updatePhoto menyalakan bendera lalu memuat ulang profil", async () => {
    mockApi({
      "PUT /users/me": okResponse(),
      "POST /users/photo": okResponse(),
      "GET /users/me": okResponse({ user: sampleUser }),
    });
    await updateProfile({ name: "x" });
    await updatePhoto(new File(["x"], "a.png"));
    expect(get(isProfileUpdated)).toBe(true);
    expect(get(isPhotoUpdated)).toBe(true);
    expect(get(profile)).toEqual(sampleUser);
  });

  it("mutasi gagal tidak menyalakan bendera", async () => {
    mockApi({ "PUT /users/me": failResponse() });
    await updateProfile({});
    expect(get(isProfileUpdated)).toBe(false);
  });

  it("changePassword sukses dan gagal", async () => {
    mockApi({ "PUT /users/change-password": failResponse() });
    await changePassword({});
    expect(get(isPasswordChanged)).toBe(false);
    mockApi({ "PUT /users/change-password": okResponse() });
    await changePassword({});
    expect(get(isPasswordChanged)).toBe(true);
  });

  it("resetUsers mengosongkan state", () => {
    profile.set(sampleUser);
    resetUsers();
    expect(get(profile)).toBeNull();
  });
});
