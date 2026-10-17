import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn(() => "res") }));

import { apiRequest } from "../../../helpers/apiHelper.js";
import { getUsers, getProfile, putProfile, postPhoto, putPassword } from "./userApi.js";

describe("userApi", () => {
  it("getUsers & getProfile", () => {
    getUsers();
    expect(apiRequest).toHaveBeenCalledWith("/users");
    getProfile();
    expect(apiRequest).toHaveBeenCalledWith("/users/me");
  });
  it("putProfile", () => {
    putProfile({ name: "N", email: "e@x.y" });
    expect(apiRequest).toHaveBeenCalledWith("/users/me", {
      method: "PUT",
      body: { name: "N", email: "e@x.y" },
    });
  });
  it("postPhoto memakai FormData field photo", () => {
    const file = new File(["x"], "p.png", { type: "image/png" });
    postPhoto(file);
    const [path, options] = apiRequest.mock.calls.at(-1);
    expect(path).toBe("/users/me/photo");
    expect(options.method).toBe("POST");
    expect(options.formData.get("photo")).toBe(file);
  });
  it("putPassword memetakan field", () => {
    putPassword({ password: "a", newPassword: "b", confirmation: "b" });
    expect(apiRequest).toHaveBeenCalledWith("/users/password", {
      method: "PUT",
      body: { password: "a", new_password: "b", new_password_confirmation: "b" },
    });
  });
});
