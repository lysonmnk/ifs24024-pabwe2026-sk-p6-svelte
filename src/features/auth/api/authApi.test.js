import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn(() => "res") }));

import { apiRequest } from "../../../helpers/apiHelper.js";
import { postLogin, postRegister, postLogout } from "./authApi.js";

describe("authApi", () => {
  it("postLogin", () => {
    expect(postLogin({ email: "a@b.c", password: "123456" })).toBe("res");
    expect(apiRequest).toHaveBeenCalledWith("/auth/login", {
      method: "POST",
      body: { email: "a@b.c", password: "123456" },
      auth: false,
    });
  });
  it("postRegister", () => {
    postRegister({ name: "N", email: "a@b.c", password: "123456" });
    expect(apiRequest).toHaveBeenCalledWith("/auth/register", {
      method: "POST",
      body: { name: "N", email: "a@b.c", password: "123456" },
      auth: false,
    });
  });
  it("postLogout", () => {
    postLogout();
    expect(apiRequest).toHaveBeenCalledWith("/auth/logout", { method: "POST" });
  });
});
