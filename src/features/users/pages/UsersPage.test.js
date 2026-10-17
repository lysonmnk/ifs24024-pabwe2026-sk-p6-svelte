import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";

vi.mock("../states/userStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  fetchUsers: vi.fn(),
}));

import { users, isUsersLoading, fetchUsers } from "../states/userStore.js";
import UsersPage from "./UsersPage.svelte";

describe("UsersPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isUsersLoading.set(false);
    users.set([]);
  });

  it("memuat pengguna saat dibuka dan menampilkan status kosong", () => {
    renderWithProviders(UsersPage, { path: "/users" });
    expect(fetchUsers).toHaveBeenCalled();
    expect(screen.getByText("Belum ada pengguna.")).toBeInTheDocument();
  });

  it("menampilkan status memuat", () => {
    isUsersLoading.set(true);
    renderWithProviders(UsersPage, { path: "/users" });
    expect(screen.getByText("Memuat data...")).toBeInTheDocument();
  });

  it("menampilkan daftar pengguna", () => {
    users.set([
      { id: 1, name: "Delcom Testing", email: "testing@delcom.org", photo: "", created_at: "2024-10-05T02:53:38.000000Z" },
    ]);
    renderWithProviders(UsersPage, { path: "/users" });
    expect(screen.getByText("testing@delcom.org")).toBeInTheDocument();
    expect(screen.getByText(/Bergabung/)).toBeInTheDocument();
  });
});
