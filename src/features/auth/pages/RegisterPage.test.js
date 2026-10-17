import { describe, it, expect, vi, beforeEach } from "vitest";
import { get } from "svelte/store";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { currentPath } from "../../../router.js";

vi.mock("../states/authStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  register: vi.fn(),
}));

import { register, isAuthRegister } from "../states/authStore.js";
import RegisterPage from "./RegisterPage.svelte";

async function fillAndSubmit() {
  await fireEvent.input(screen.getByLabelText("Nama"), { target: { value: "Budi" } });
  await fireEvent.input(screen.getByLabelText("Email"), { target: { value: "a@b.c" } });
  await fireEvent.input(screen.getByLabelText("Kata Sandi"), { target: { value: "123456" } });
  await fireEvent.submit(screen.getByRole("button", { name: "Daftar" }).closest("form"));
}

describe("RegisterPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isAuthRegister.set(false);
  });

  it("daftar berhasil menuju login", async () => {
    register.mockResolvedValue(true);
    renderWithProviders(RegisterPage, { path: "/auth/register", profile: null });
    await fillAndSubmit();
    await waitFor(() => expect(get(currentPath)).toBe("/auth/login"));
    expect(register).toHaveBeenCalledWith({ name: "Budi", email: "a@b.c", password: "123456" });
  });

  it("daftar gagal tetap di halaman", async () => {
    register.mockResolvedValue(false);
    renderWithProviders(RegisterPage, { path: "/auth/register", profile: null });
    await fillAndSubmit();
    await waitFor(() => expect(register).toHaveBeenCalled());
    expect(get(currentPath)).toBe("/auth/register");
  });

  it("tombol nonaktif saat memproses", async () => {
    renderWithProviders(RegisterPage, { path: "/auth/register", profile: null });
    isAuthRegister.set(true);
    expect(await screen.findByRole("button", { name: "Memproses..." })).toBeDisabled();
  });

  it("tautan ke halaman masuk", () => {
    renderWithProviders(RegisterPage, { path: "/auth/register", profile: null });
    screen.getByRole("link", { name: "Masuk" }).click();
    expect(get(currentPath)).toBe("/auth/login");
  });
});
