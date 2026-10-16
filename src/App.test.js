import { get } from "svelte/store";
import { render, screen, waitFor } from "@testing-library/svelte";
import App from "./App.svelte";
import { currentPath, navigate } from "./router.js";
import { authToken } from "./features/auth/states/authStore.js";
import { resetAllStores, mockApi, okResponse, sampleTree, sampleUser } from "./test-utils.js";

const routes = () => ({
  "GET /users/me": okResponse({ user: sampleUser }),
  "GET /users": okResponse({ users: [sampleUser] }),
  "GET /link-trees": okResponse({ link_trees: [sampleTree] }),
  "GET /link-trees/t1": okResponse({ link_tree: sampleTree }),
});

function open(path, token = "tok") {
  resetAllStores();
  mockApi(routes());
  if (token) authToken.set(token);
  navigate(path);
  return render(App);
}

describe("App", () => {
  it("tanpa token, halaman aplikasi dialihkan ke login", async () => {
    open("/", null);
    await waitFor(() => expect(get(currentPath)).toBe("/auth/login"));
    expect(screen.getByTestId("login-form")).toBeInTheDocument();
  });

  it("dengan token, halaman auth dialihkan ke beranda", async () => {
    open("/auth/login");
    await waitFor(() => expect(get(currentPath)).toBe("/"));
    expect(screen.getByText("Semua Link Tree", { selector: "h1" })).toBeInTheDocument();
  });

  it("menampilkan halaman register", () => {
    open("/auth/register", null);
    expect(screen.getByTestId("register-form")).toBeInTheDocument();
  });

  it("menampilkan detail link tree", async () => {
    open("/link-trees/t1");
    await waitFor(() => expect(screen.getByTestId("detail-title")).toBeInTheDocument());
  });

  it("menampilkan halaman pengguna", async () => {
    open("/users");
    await waitFor(() => expect(screen.getByRole("heading", { name: "Pengguna" })).toBeInTheDocument());
  });

  it("menampilkan halaman profil", async () => {
    open("/profile");
    await waitFor(() => expect(screen.getByTestId("profile-form")).toBeInTheDocument());
  });

  it("path tak dikenal menampilkan 404", () => {
    open("/tidak-ada");
    expect(screen.getByText("Halaman tidak ditemukan")).toBeInTheDocument();
  });
});
