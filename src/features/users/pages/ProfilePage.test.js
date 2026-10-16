import Swal from "sweetalert2";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import ProfilePage from "./ProfilePage.svelte";
import { renderWithProviders, mockApi, okResponse, sampleUser } from "../../../test-utils.js";

const routes = () => ({
  "GET /users/me": okResponse({ user: sampleUser }),
  "PUT /users/me": okResponse({}, "Profil diperbarui"),
  "POST /users/photo": okResponse({}, "Foto diperbarui"),
  "PUT /users/change-password": okResponse({}, "Sandi diubah"),
});

describe("ProfilePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("mengisi formulir dari profil dan menyimpan perubahan", async () => {
    const fetchMock = mockApi(routes());
    renderWithProviders(ProfilePage);
    await waitFor(() => expect(screen.getByLabelText("Nama")).toHaveValue("Dian"));
    expect(screen.getByLabelText("Email")).toHaveValue("dian@example.com");
    await fireEvent.input(screen.getByLabelText("Nama"), { target: { value: "Dian R" } });
    await fireEvent.input(screen.getByLabelText("Email"), { target: { value: "d@e.com" } });
    await fireEvent.submit(screen.getByTestId("profile-form"));
    await waitFor(() =>
      expect(fetchMock.mock.calls.some(([, o]) => o.method === "PUT" && o.body.includes("Dian R"))).toBe(true)
    );
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success" })));
  });

  it("menampilkan foto bila tersedia", async () => {
    mockApi({ ...routes(), "GET /users/me": okResponse({ user: { ...sampleUser, photo: "http://x/p.png" } }) });
    renderWithProviders(ProfilePage, {}, { user: { ...sampleUser, photo: "http://x/p.png" } });
    expect(screen.getByAltText("Foto profil")).toBeInTheDocument();
  });

  it("memperingatkan bila foto belum dipilih, lalu mengunggah", async () => {
    const fetchMock = mockApi(routes());
    renderWithProviders(ProfilePage, {}, { user: sampleUser });
    await fireEvent.submit(screen.getByTestId("photo-form"));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "warning" })));

    const file = new File(["x"], "a.png", { type: "image/png" });
    await fireEvent.change(screen.getByTestId("photo-input"), { target: { files: [file] } });
    await fireEvent.submit(screen.getByTestId("photo-form"));
    await waitFor(() => expect(fetchMock.mock.calls.some(([u]) => u.endsWith("/users/photo"))).toBe(true));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success" })));
  });

  it("mengubah kata sandi dan mengosongkan isian", async () => {
    mockApi(routes());
    renderWithProviders(ProfilePage, {}, { user: sampleUser });
    await fireEvent.input(screen.getByLabelText("Kata sandi lama"), { target: { value: "lama" } });
    await fireEvent.input(screen.getByLabelText("Kata sandi baru"), { target: { value: "baru" } });
    await fireEvent.submit(screen.getByTestId("password-form"));
    await waitFor(() => expect(screen.getByLabelText("Kata sandi lama")).toHaveValue(""));
    expect(screen.getByLabelText("Kata sandi baru")).toHaveValue("");
  });
});
