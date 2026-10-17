import { writable } from "svelte/store";

export const currentPath = writable(globalThis.location.pathname);

const routes = [
  { pattern: /^\/auth\/login\/?$/, name: "login", layout: "auth", keys: [] },
  { pattern: /^\/auth\/register\/?$/, name: "register", layout: "auth", keys: [] },
  { pattern: /^\/$/, name: "home", layout: "app", keys: [] },
  {
    pattern: /^\/link-trees\/([^/]+)\/?$/,
    name: "detail",
    layout: "app",
    keys: ["linkTreeId"],
  },
  { pattern: /^\/users\/?$/, name: "users", layout: "app", keys: [] },
  { pattern: /^\/profile\/?$/, name: "profile", layout: "app", keys: [] },
];

export function resolveRoute(path) {
  for (const route of routes) {
    const match = route.pattern.exec(path);
    if (match) {
      const params = Object.fromEntries(
        route.keys.map((key, index) => [key, decodeURIComponent(match[index + 1])])
      );
      return { name: route.name, layout: route.layout, params };
    }
  }
  return { name: "notFound", layout: "plain", params: {} };
}

export function navigate(path, replace = false) {
  if (replace) {
    globalThis.history.replaceState({}, "", path);
  } else {
    globalThis.history.pushState({}, "", path);
  }
  currentPath.set(path);
}

globalThis.addEventListener("popstate", () => {
  currentPath.set(globalThis.location.pathname);
});
