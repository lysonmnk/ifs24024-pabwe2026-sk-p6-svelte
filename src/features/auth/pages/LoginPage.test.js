import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { currentPath } from "../../../router.js";

vi.mock("../states/authStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  login: vi.fn(),
}));

import { login, isAuthLogin } from "../states/authStore.js";
import LoginPage from "./LoginPage.svelte";

async function fillAndSubmit() {
  await fireEvent.input(screen.getByLabelText("Email"), { target: { value: "a@b.c" } });
  await fireEvent.input(screen.getByLabelText("Kata Sandi"), { target: { value: "123456" } });
  await fireEvent.submit(screen.getByRole("button", { name: "Masuk" }).closest("form"));
}

describe("LoginPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAuthLogin.set(false);
  });

  it("login berhasil menuju beranda", async () => {
    login.mockResolvedValue(true);
    renderWithProviders(LoginPage, { path: "/auth/login", profile: null });
    await fillAndSubmit();
    await waitFor(() => expect(get(currentPath)).toBe("/"));
    expect(login).toHaveBeenCalledWith({ email: "a@b.c", password: "123456" });
  });

  it("login gagal tetap di halaman", async () => {
    login.mockResolvedValue(false);
    renderWithProviders(LoginPage, { path: "/auth/login", profile: null });
    await fillAndSubmit();
    await waitFor(() => expect(login).toHaveBeenCalled());
    expect(get(currentPath)).toBe("/auth/login");
  });

  it("tombol nonaktif saat memproses", async () => {
    renderWithProviders(LoginPage, { path: "/auth/login", profile: null });
    isAuthLogin.set(true);
    expect(await screen.findByRole("button", { name: "Memproses..." })).toBeDisabled();
  });

  it("tautan ke halaman daftar", () => {
    renderWithProviders(LoginPage, { path: "/auth/login", profile: null });
    screen.getByRole("link", { name: "Daftar" }).click();
    expect(get(currentPath)).toBe("/auth/register");
  });
});
