import { describe, it, expect, vi, beforeEach } from "vitest";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import { renderWithProviders, sampleProfile } from "../../../test-utils.js";
import { authProfile } from "../../auth/states/authStore.js";

vi.mock("../../../helpers/toolsHelper.js", async (importOriginal) => ({
  ...(await importOriginal()),
  showWarningDialog: vi.fn(),
}));
vi.mock("../states/userStore.js", async (importOriginal) => ({
  ...(await importOriginal()),
  updateProfile: vi.fn(),
  changePhoto: vi.fn(),
  changePassword: vi.fn(),
}));

import { showWarningDialog } from "../../../helpers/toolsHelper.js";
import {
  updateProfile,
  changePhoto,
  changePassword,
  isProfileUpdating,
  isPhotoUpdating,
  isPasswordUpdating,
} from "../states/userStore.js";
import ProfilePage from "./ProfilePage.svelte";

const file = new File(["x"], "p.png", { type: "image/png" });
const form = (name) => screen.getByRole("button", { name }).closest("form");

async function fillPasswords(current, next, confirm) {
  await fireEvent.input(screen.getByLabelText("Kata Sandi Saat Ini"), { target: { value: current } });
  await fireEvent.input(screen.getByLabelText("Kata Sandi Baru"), { target: { value: next } });
  await fireEvent.input(screen.getByLabelText("Konfirmasi Kata Sandi Baru"), { target: { value: confirm } });
}

describe("ProfilePage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    isProfileUpdating.set(false);
    isPhotoUpdating.set(false);
    isPasswordUpdating.set(false);
  });

  it("terisi data profil dan menyimpan perubahan", async () => {
    renderWithProviders(ProfilePage, { path: "/profile" });
    expect(screen.getByLabelText("Nama")).toHaveValue("Delcom Testing");
    expect(screen.getByLabelText("Email")).toHaveValue("testing@delcom.org");
    await fireEvent.input(screen.getByLabelText("Nama"), { target: { value: "Baru" } });
    await fireEvent.input(screen.getByLabelText("Email"), { target: { value: "baru@x.y" } });
    await fireEvent.submit(form("Simpan Data"));
    await waitFor(() => expect(updateProfile).toHaveBeenCalledWith({ name: "Baru", email: "baru@x.y" }));
  });

  it("foto: menolak bila belum memilih berkas", async () => {
    renderWithProviders(ProfilePage, { path: "/profile" });
    await fireEvent.submit(form("Ubah Foto"));
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalledWith("Pilih foto terlebih dahulu"));
    expect(changePhoto).not.toHaveBeenCalled();
  });

  it("foto: mengunggah berkas terpilih", async () => {
    renderWithProviders(ProfilePage, { path: "/profile" });
    await fireEvent.change(screen.getByLabelText("Foto profil"), { target: { files: [file] } });
    await fireEvent.submit(form("Ubah Foto"));
    await waitFor(() => expect(changePhoto).toHaveBeenCalledWith(file));
  });

  it("kata sandi: menolak konfirmasi yang tidak sama", async () => {
    renderWithProviders(ProfilePage, { path: "/profile" });
    await fillPasswords("lama", "baru1", "baru2");
    await fireEvent.submit(form("Ubah Kata Sandi"));
    await waitFor(() => expect(showWarningDialog).toHaveBeenCalledWith("Konfirmasi kata sandi tidak sama"));
    expect(changePassword).not.toHaveBeenCalled();
  });

  it("kata sandi: berhasil mengosongkan form", async () => {
    changePassword.mockResolvedValue(true);
    renderWithProviders(ProfilePage, { path: "/profile" });
    await fillPasswords("lama", "baru", "baru");
    await fireEvent.submit(form("Ubah Kata Sandi"));
    await waitFor(() =>
      expect(changePassword).toHaveBeenCalledWith({ password: "lama", newPassword: "baru", confirmation: "baru" })
    );
    await waitFor(() => expect(screen.getByLabelText("Kata Sandi Baru")).toHaveValue(""));
  });

  it("kata sandi: gagal mempertahankan isian", async () => {
    changePassword.mockResolvedValue(false);
    renderWithProviders(ProfilePage, { path: "/profile" });
    await fillPasswords("lama", "baru", "baru");
    await fireEvent.submit(form("Ubah Kata Sandi"));
    await waitFor(() => expect(changePassword).toHaveBeenCalled());
    expect(screen.getByLabelText("Kata Sandi Baru")).toHaveValue("baru");
  });

  it("tombol nonaktif saat memproses", async () => {
    renderWithProviders(ProfilePage, { path: "/profile" });
    isProfileUpdating.set(true);
    isPhotoUpdating.set(true);
    isPasswordUpdating.set(true);
    const busy = await screen.findAllByRole("button", { name: /Menyimpan\.\.\.|Mengunggah\.\.\./ });
    expect(busy).toHaveLength(3);
    busy.forEach((button) => expect(button).toBeDisabled());
  });

  it("memperbarui avatar saat profil di store berubah", async () => {
    renderWithProviders(ProfilePage);
    authProfile.set({ ...sampleProfile, photo: "" });
    expect(await screen.findByTestId("avatar-initial")).toHaveTextContent("D");
  });
});
