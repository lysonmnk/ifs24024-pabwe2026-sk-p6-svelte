import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it, vi } from "vitest";
import Navbar from "../../components/Navbar.svelte";
import { authStore } from "../../features/auth/states/authStore";
import { resetStores, signIn, user } from "../utils";

describe("Navbar (avatar profil)", () => {
  beforeEach(() => {
    resetStores();
  });

  it("menampilkan nama dan mengikuti perubahan foto profil", async () => {
    signIn(user());
    render(Navbar, { onmenu: vi.fn() });

    authStore.update((s) => (s.profile ? { ...s, profile: { ...s.profile, name: "Nama Baru", photo: null } } : s));
    expect(await screen.findByText("Nama Baru")).toBeInTheDocument();

    authStore.update((s) =>
      s.profile ? { ...s, profile: { ...s.profile, name: "Nama Baru", photo: "https://example.com/foto.jpg" } } : s,
    );
    expect(await screen.findByText("Nama Baru")).toBeInTheDocument();
    expect(document.querySelector('a[href="/profile"]')).not.toBeNull();
  });

  it("tanpa profil, tautan profil tidak ditampilkan", () => {
    render(Navbar, { onmenu: vi.fn() });
    expect(document.querySelector('a[href="/profile"]')).toBeNull();
  });
});