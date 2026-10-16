import Swal from "sweetalert2";
import { get } from "svelte/store";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import LoginPage from "./LoginPage.svelte";
import { currentPath } from "../../../router.js";
import { renderWithProviders, mockApi, okResponse, failResponse, sampleUser } from "../../../test-utils.js";

async function fillAndSubmit() {
  await fireEvent.input(screen.getByLabelText("Email"), { target: { value: "a@a.com" } });
  await fireEvent.input(screen.getByLabelText("Kata sandi"), { target: { value: "rahasia" } });
  await fireEvent.submit(screen.getByTestId("login-form"));
}

describe("LoginPage", () => {
  it("login berhasil lalu menuju beranda", async () => {
    mockApi({
      "POST /auth/login": okResponse({ token: "tok" }),
      "GET /users/me": okResponse({ user: sampleUser }),
    });
    renderWithProviders(LoginPage);
    currentPath.set("/auth/login");
    await fillAndSubmit();
    await waitFor(() => expect(get(currentPath)).toBe("/"));
  });

  it("menampilkan dialog galat bila login gagal dan status memuat", async () => {
    let release;
    const gate = new Promise((resolve) => (release = resolve));
    globalThis.fetch = vi.fn(async () => {
      await gate;
      return { json: async () => failResponse("Email atau sandi salah") };
    });
    renderWithProviders(LoginPage);
    await fillAndSubmit();
    expect(screen.getByRole("button", { name: "Memproses..." })).toBeDisabled();
    release();
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" }))
    );
    expect(screen.getByRole("button", { name: "Masuk" })).toBeEnabled();
  });

  it("tautan daftar berpindah ke halaman register", async () => {
    renderWithProviders(LoginPage);
    await fireEvent.click(screen.getByText("Daftar"));
    expect(get(currentPath)).toBe("/auth/register");
  });
});
