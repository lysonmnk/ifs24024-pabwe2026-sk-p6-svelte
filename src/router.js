import { writable } from "svelte/store";

export const currentPath = writable(window.location.pathname);

export function navigate(path, { replace = false } = {}) {
  window.history[replace ? "replaceState" : "pushState"]({}, "", path);
  currentPath.set(path);
}

export function link(event) {
  event.preventDefault();
  navigate(event.currentTarget.getAttribute("href"));
}

window.addEventListener("popstate", () => currentPath.set(window.location.pathname));

const NOT_FOUND = { layout: "none", page: "notfound", params: {} };

export function resolveRoute(path) {
  if (path === "/auth/login") return { layout: "auth", page: "login", params: {} };
  if (path === "/auth/register") return { layout: "auth", page: "register", params: {} };
  if (path === "/") return { layout: "app", page: "home", params: {} };
  if (path === "/users") return { layout: "app", page: "users", params: {} };
  if (path === "/profile") return { layout: "app", page: "profile", params: {} };
  const detail = path.match(/^\/link-trees\/([^/]+)$/);
  if (detail) return { layout: "app", page: "detail", params: { linkTreeId: detail[1] } };
  return NOT_FOUND;
}
