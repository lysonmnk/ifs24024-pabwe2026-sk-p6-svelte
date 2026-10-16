import Swal from "sweetalert2";
import { get } from "svelte/store";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import RegisterPage from "./RegisterPage.svelte";
import { currentPath } from "../../../router.js";
import { renderWithProviders, mockApi, okResponse, failResponse } from "../../../test-utils.js";

async function fillAndSubmit() {
  await fireEvent.input(screen.getByLabelText("Nama"), { target: { value: "Dian" } });
  await fireEvent.input(screen.getByLabelText("Email"), { target: { value: "a@a.com" } });
  await fireEvent.input(screen.getByLabelText("Kata sandi"), { target: { value: "rahasia" } });
  await fireEvent.submit(screen.getByTestId("register-form"));
}

describe("RegisterPage", () => {
  it("register berhasil lalu menuju login", async () => {
    mockApi({ "POST /auth/register": okResponse({}, "Akun dibuat") });
    renderWithProviders(RegisterPage);
    await fillAndSubmit();
    await waitFor(() => expect(get(currentPath)).toBe("/auth/login"));
  });

  it("menampilkan galat bila register gagal", async () => {
    mockApi({ "POST /auth/register": failResponse("Email terpakai") });
    renderWithProviders(RegisterPage);
    await fillAndSubmit();
    await waitFor(() =>
      expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" }))
    );
    expect(screen.getByRole("button", { name: "Daftar" })).toBeEnabled();
  });

  it("tautan masuk berpindah ke login", async () => {
    renderWithProviders(RegisterPage);
    await fireEvent.click(screen.getByText("Masuk", { selector: "a" }));
    expect(get(currentPath)).toBe("/auth/login");
  });
});
