import { describe, it, expect } from "vitest";
import { screen, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { currentPath } from "../../../router.js";
import Sidebar from "./Sidebar.svelte";

describe("Sidebar", () => {
  it("menandai menu aktif sesuai rute", () => {
    renderWithProviders(Sidebar, { path: "/link-trees/3" });
    expect(screen.getByRole("link", { name: /Semua Link Tree/ }).className).toContain("bg-indigo-600");
    expect(screen.getByRole("link", { name: /Pengguna/ }).className).not.toContain("bg-indigo-600");
    expect(screen.getByRole("link", { name: /Profil/ }).className).not.toContain("bg-indigo-600");
  });

  it("menu Pengguna aktif di /users", () => {
    renderWithProviders(Sidebar, { path: "/users" });
    expect(screen.getByRole("link", { name: /Pengguna/ }).className).toContain("bg-indigo-600");
  });

  it("memperbarui menu aktif saat rute berubah setelah dirender", async () => {
    renderWithProviders(Sidebar, { path: "/" });
    expect(screen.getByRole("link", { name: /Semua Link Tree/ }).className).toContain("bg-indigo-600");
    currentPath.set("/users");
    await waitFor(() =>
      expect(screen.getByRole("link", { name: /Pengguna/ }).className).toContain("bg-indigo-600")
    );
    expect(screen.getByRole("link", { name: /Semua Link Tree/ }).className).not.toContain("bg-indigo-600");
    expect(screen.getByRole("link", { name: /Pengguna/ })).toHaveTextContent("Pengguna");
  });
});
