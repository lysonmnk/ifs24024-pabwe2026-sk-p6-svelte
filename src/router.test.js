import { describe, it, expect } from "vitest";
import { get } from "svelte/store";
import { currentPath, navigate, resolveRoute } from "./router.js";

describe("resolveRoute", () => {
  it.each([
    ["/auth/login", "login", "auth"],
    ["/auth/register", "register", "auth"],
    ["/", "home", "app"],
    ["/users", "users", "app"],
    ["/profile", "profile", "app"],
  ])("%s", (path, name, layout) => {
    expect(resolveRoute(path)).toEqual({ name, layout, params: {} });
  });

  it("mengambil parameter detail", () => {
    expect(resolveRoute("/link-trees/12")).toEqual({
      name: "detail",
      layout: "app",
      params: { linkTreeId: "12" },
    });
  });

  it("path tak dikenal menjadi notFound", () => {
    expect(resolveRoute("/tidak-ada")).toEqual({ name: "notFound", layout: "plain", params: {} });
  });
});

describe("navigate", () => {
  it("pushState dan memperbarui currentPath", () => {
    navigate("/users");
    expect(window.location.pathname).toBe("/users");
    expect(get(currentPath)).toBe("/users");
  });

  it("replaceState bila replace=true", () => {
    navigate("/profile", true);
    expect(window.location.pathname).toBe("/profile");
    expect(get(currentPath)).toBe("/profile");
  });

  it("mengikuti popstate", () => {
    window.history.replaceState({}, "", "/auth/login");
    window.dispatchEvent(new PopStateEvent("popstate"));
    expect(get(currentPath)).toBe("/auth/login");
  });
});
