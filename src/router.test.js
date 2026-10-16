import { get } from "svelte/store";
import { currentPath, navigate, link, resolveRoute } from "./router.js";

describe("router", () => {
  it("resolveRoute memetakan semua rute", () => {
    expect(resolveRoute("/auth/login")).toEqual({ layout: "auth", page: "login", params: {} });
    expect(resolveRoute("/auth/register").page).toBe("register");
    expect(resolveRoute("/")).toEqual({ layout: "app", page: "home", params: {} });
    expect(resolveRoute("/users").page).toBe("users");
    expect(resolveRoute("/profile").page).toBe("profile");
    expect(resolveRoute("/link-trees/abc")).toEqual({
      layout: "app",
      page: "detail",
      params: { linkTreeId: "abc" },
    });
    expect(resolveRoute("/link-trees/abc/x").page).toBe("notfound");
    expect(resolveRoute("/tidak-ada").page).toBe("notfound");
  });

  it("navigate memakai pushState atau replaceState", () => {
    navigate("/users");
    expect(window.location.pathname).toBe("/users");
    expect(get(currentPath)).toBe("/users");
    navigate("/profile", { replace: true });
    expect(window.location.pathname).toBe("/profile");
  });

  it("link mencegah navigasi bawaan", () => {
    const preventDefault = vi.fn();
    link({ preventDefault, currentTarget: { getAttribute: () => "/users" } });
    expect(preventDefault).toHaveBeenCalled();
    expect(get(currentPath)).toBe("/users");
  });

  it("popstate memperbarui currentPath", () => {
    window.history.pushState({}, "", "/profile");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(get(currentPath)).toBe("/profile");
  });
});
