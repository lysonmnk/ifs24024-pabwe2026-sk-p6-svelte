import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import { screen, waitFor } from "@testing-library/svelte";
import { renderWithProviders, sampleProfile } from "../../../test-utils.js";
import { authProfile } from "../../auth/states/authStore.js";
import { currentPath } from "../../../router.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => ({
  ...(await importOriginal()),
  showConfirmDialog: vi.fn(),
}));
vi.mock("../../auth/states/authStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  logout: vi.fn(),
}));

import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
import { logout } from "../../auth/states/authStore.js";
import Navbar from "./Navbar.svelte";

describe("Navbar", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan nama pengguna dan tautan profil", () => {
    renderWithProviders(Navbar);
    expect(screen.getByText("Delcom Testing")).toBeInTheDocument();
    screen.getByText("Delcom Testing").closest("a").click();
    expect(get(currentPath)).toBe("/profile");
  });

  it("tautan profil punya nama yang bisa dibaca (alt avatar dikosongkan)", () => {
    renderWithProviders(Navbar);
    expect(screen.getByRole("link", { name: "Delcom Testing" })).toHaveAttribute("href", "/profile");
  });

  it("logo menuju beranda", () => {
    renderWithProviders(Navbar, { path: "/users" });
    screen.getByRole("link", { name: /Delcom Link Tree/ }).click();
    expect(get(currentPath)).toBe("/");
  });

  it("logout dikonfirmasi", async () => {
    showConfirmDialog.mockResolvedValue(true);
    renderWithProviders(Navbar);
    screen.getByLabelText("Keluar").click();
    await waitFor(() => expect(get(currentPath)).toBe("/auth/login"));
    expect(logout).toHaveBeenCalled();
  });

  it("logout dibatalkan", async () => {
    showConfirmDialog.mockResolvedValue(false);
    renderWithProviders(Navbar, { path: "/users" });
    screen.getByLabelText("Keluar").click();
    await waitFor(() => expect(showConfirmDialog).toHaveBeenCalled());
    expect(logout).not.toHaveBeenCalled();
    expect(get(currentPath)).toBe("/users");
  });

  it("tetap menampilkan nama saat profil diperbarui dengan nama yang sama", async () => {
    renderWithProviders(Navbar);
    authProfile.set({ ...sampleProfile, photo: "" });
    expect(await screen.findByTestId("avatar-initial")).toHaveTextContent("D");
    expect(screen.getByText("Delcom Testing")).toBeInTheDocument();
  });
});
