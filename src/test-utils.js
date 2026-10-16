import { render } from "@testing-library/svelte";
import { vi } from "vitest";
import { createRawSnippet } from "svelte";
import { authToken, isAuthLogin, isAuthRegister } from "./features/auth/states/authStore.js";
import { profile, users, resetUsers } from "./features/users/states/usersStore.js";
import { resetLinkTrees } from "./features/linktrees/states/linkTreesStore.js";
import { currentPath } from "./router.js";

export function resetAllStores() {
  localStorage.clear();
  authToken.set(null);
  isAuthLogin.set(false);
  isAuthRegister.set(false);
  resetUsers();
  resetLinkTrees();
  currentPath.set("/");
}

/** Render komponen Svelte setelah store direset dan diisi sesuai opsi. */
export function renderWithProviders(Component, props = {}, { token = null, user = null } = {}) {
  resetAllStores();
  if (token) authToken.set(token);
  if (user) profile.set(user);
  return render(Component, { props });
}

export const okResponse = (data = {}, message = "OK") => ({ status: "success", message, data });
export const failResponse = (message = "Gagal") => ({ status: "fail", message });

export function mockFetchOnce(body) {
  const fn = vi.fn().mockResolvedValue({ json: () => Promise.resolve(body) });
  globalThis.fetch = fn;
  return fn;
}

export { users };

/** Mock fetch berdasarkan kunci "METHOD /path". */
export function mockApi(routes = {}) {
  const fn = vi.fn(async (url, options = {}) => {
    const path = String(url).replace(DELCOM_BASEURL, "");
    const key = `${options.method || "GET"} ${path}`;
    const handler = routes[key];
    const body =
      typeof handler === "function" ? handler(options) : (handler ?? failResponse(`Tidak di-mock: ${key}`));
    return { json: async () => body };
  });
  globalThis.fetch = fn;
  return fn;
}

export const snippet = (html = "<p>anak</p>") => createRawSnippet(() => ({ render: () => html }));

export const sampleUser = { id: "u1", name: "Dian", email: "dian@example.com", photo: null };
export const sampleTree = {
  id: "t1",
  user_id: "u1",
  title: "Portofolio",
  type: "public",
  description: "Kumpulan karya",
  cover: null,
  created_at: "2026-01-01T00:00:00Z",
  items: [{ id: "i1", title: "GitHub", url: "https://github.com/dian" }],
};
