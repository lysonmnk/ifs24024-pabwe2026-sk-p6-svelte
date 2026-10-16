import { render, screen, fireEvent } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "../../components/Navbar.svelte";
import { fail, flush, mockFetch, ok, resetStores, signIn, user } from "../utils";

describe("Navbar (interaksi lengkap)", () => {
  beforeEach(resetStores);

  it("tanpa profil hanya menampilkan tombol menu dan keluar", () => {
    render(Navbar, { onmenu: vi.fn() });
    expect(screen.queryByRole("link", { name: /Delcom Testing/ })).toBeNull();
    expect(screen.getByRole("button", { name: "Keluar" })).toBeInTheDocument();
  });

  it("dengan profil menampilkan tautan profil", () => {
    signIn(user());
    render(Navbar, { onmenu: vi.fn() });
    expect(screen.getByRole("link", { name: /Delcom Testing/ })).toHaveAttribute("href", "/profile");
  });

  it("tombol menu memanggil onmenu", async () => {
    const onmenu = vi.fn();
    render(Navbar, { onmenu });
    await fireEvent.click(screen.getByRole("button", { name: "Buka menu" }));
    expect(onmenu).toHaveBeenCalledTimes(1);
  });

  it("tombol keluar memanggil API logout", async () => {
    signIn(user());
    const { calls } = mockFetch({ "POST /auth/logout": ok("Berhasil logout") });
    render(Navbar, { onmenu: vi.fn() });
    await fireEvent.click(screen.getByRole("button", { name: "Keluar" }));
    await flush();
    expect(calls.map((c) => `${c.method} ${c.path}`)).toContain("POST /auth/logout");
  });

  it("tombol keluar tetap membersihkan sesi saat API gagal", async () => {
    signIn(user());
    mockFetch({ "POST /auth/logout": fail("Gagal") });
    render(Navbar, { onmenu: vi.fn() });
    await fireEvent.click(screen.getByRole("button", { name: "Keluar" }));
    await flush();
    expect(localStorage.getItem("delcom_token")).toBeNull();
  });
});