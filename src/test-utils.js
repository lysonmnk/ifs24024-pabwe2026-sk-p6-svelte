import { render } from "@testing-library/svelte";
import { createRawSnippet } from "svelte";
import { authProfile, isPreload } from "./features/auth/states/authStore.js";
import { currentPath } from "./router.js";

export const sampleProfile = {
  id: 1,
  name: "Delcom Testing",
  email: "testing@delcom.org",
  photo: "http://localhost:8000/default/img/user.png",
};

export const sampleTree = {
  id: 7,
  user_id: 1,
  title: "Kursus Ku",
  type: "public",
  description: "Kumpulan kursus",
  cover: "http://localhost:8000/img/cover/7.png",
  created_at: "2025-03-09T01:32:33.000000Z",
  author: { name: "Delcom Testing", photo: "http://localhost:8000/default/img/user.png" },
  total_links: 2,
  items: [
    { id: 11, link_tree_id: 7, title: "Dasar Java", url: "https://youtu.be/abc" },
  ],
};

export function textSnippet(text) {
  return createRawSnippet(() => ({ render: () => `<p>${text}</p>` }));
}

/** Render komponen beserta keadaan store (rute, profil, preload) yang dibutuhkan. */
export function renderWithProviders(
  Component,
  { props = {}, path = "/", profile = sampleProfile, preload = false } = {}
) {
  currentPath.set(path);
  authProfile.set(profile);
  isPreload.set(preload);
  return render(Component, { props });
}
