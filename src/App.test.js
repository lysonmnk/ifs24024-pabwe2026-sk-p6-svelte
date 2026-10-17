import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { get } from "svelte/store";
import { render, screen, waitFor } from "@testing-library/svelte";
import { currentPath } from "./router.js";
import { authProfile, isPreload } from "./features/auth/states/authStore.js";
import { putAccessToken } from "./helpers/apiHelper.js";
import { sampleProfile, sampleTree } from "./test-utils.js";
import App from "./App.svelte";

function stubApi({ validToken = true } = {}) {
  const body = (path) => {
    if (path === "/users/me") {
      return validToken
        ? { status: "success", data: { user: sampleProfile } }
        : { status: "fail", message: "Unauthenticated." };
    }
    if (path.startsWith("/link-trees/7")) {
      return { status: "success", data: { link_tree: sampleTree } };
    }
    if (path.startsWith("/link-trees")) {
      return { status: "success", data: { link_trees: [{ ...sampleTree, items: undefined }] } };
    }
    if (path === "/users") {
      return { status: "success", data: { users: [{ ...sampleProfile, created_at: "2024-10-05T02:53:38Z" }] } };
    }
    return { status: "fail", message: "Tidak dikenal" };
  };
  vi.stubGlobal(
    "fetch",
    vi.fn(async (url) => ({ json: async () => body(String(url).replace(DELCOM_BASEURL, "")) }))
  );
}

function open(path) {
  window.history.replaceState({}, "", path);
  currentPath.set(path);
  return render(App);
}

describe("App", () => {
  beforeEach(() => {
    localStorage.clear();
    authProfile.set(null);
    isPreload.set(true);
  });
  afterEach(() => {
    vi.doUnmock("./features/auth/pages/RegisterPage.svelte");
    vi.doUnmock("./features/common/pages/NotFoundPage.svelte");
    vi.unstubAllGlobals();
  });

  it("saat memuat profil menampilkan main dengan heading level-1", () => {
    // Ada token tetapi respons profil belum datang, sehingga status "memuat" terlihat.
    vi.stubGlobal("fetch", vi.fn(() => new Promise(() => {})));
    putAccessToken("tok");
    open("/");
    expect(screen.getByRole("main")).toContainElement(
      screen.getByRole("heading", { level: 1, name: "Memuat..." })
    );
  });

  it("tamu di rute aplikasi diarahkan ke login", async () => {
    stubApi();
    open("/");
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
    expect(get(currentPath)).toBe("/auth/login");
  });

  it("tamu bisa membuka halaman daftar", async () => {
    stubApi();
    open("/auth/register");
    expect(await screen.findByRole("heading", { name: "Daftar" })).toBeInTheDocument();
  });

  it("pengguna login di rute auth diarahkan ke beranda", async () => {
    stubApi();
    putAccessToken("tok");
    open("/auth/login");
    expect(await screen.findByRole("heading", { name: "Semua Link Tree" })).toBeInTheDocument();
    expect(get(currentPath)).toBe("/");
  });

  it("token tidak valid dibersihkan dan kembali ke login", async () => {
    stubApi({ validToken: false });
    putAccessToken("kadaluarsa");
    open("/");
    expect(await screen.findByRole("heading", { name: "Masuk" })).toBeInTheDocument();
    expect(localStorage.getItem("accessToken")).toBeNull();
  });

  it("menampilkan halaman detail dengan parameter", async () => {
    stubApi();
    putAccessToken("tok");
    open("/link-trees/7");
    expect(await screen.findByRole("heading", { name: "Kursus Ku" })).toBeInTheDocument();
  });

  it("menampilkan halaman pengguna dan profil", async () => {
    stubApi();
    putAccessToken("tok");
    open("/users");
    expect(await screen.findByText("testing@delcom.org")).toBeInTheDocument();
    open("/profile");
    await waitFor(() => expect(screen.getAllByRole("heading", { name: "Profil" }).length).toBeGreaterThan(0));
  });

  it("path tak dikenal menampilkan 404", async () => {
    stubApi();
    open("/tidak-ada");
    expect(await screen.findByText("404")).toBeInTheDocument();
  });

  it("menampilkan fallback saat halaman daftar gagal dimuat", async () => {
    vi.doMock("./features/auth/pages/RegisterPage.svelte", () => {
      throw new Error("Gagal memuat chunk");
    });
    open("/auth/register");

    expect(await screen.findByText("Halaman gagal dimuat.")).toBeInTheDocument();
    expect(screen.getByRole("main").querySelector("p")).not.toBeEmptyDOMElement();
  });

  it("menampilkan fallback saat halaman 404 gagal dimuat", async () => {
    vi.doMock("./features/common/pages/NotFoundPage.svelte", () => {
      throw "Gagal memuat halaman";
    });
    open("/tidak-ada");

    expect(await screen.findByText("Halaman gagal dimuat.")).toBeInTheDocument();
    expect(screen.getByRole("main").querySelector("p")).not.toBeEmptyDOMElement();
  });
});
