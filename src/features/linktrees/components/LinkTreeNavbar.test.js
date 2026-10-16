import Swal from "sweetalert2";
import { get } from "svelte/store";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import LinkTreeNavbar from "./LinkTreeNavbar.svelte";
import { authToken } from "../../auth/states/authStore.js";
import { currentPath } from "../../../router.js";
import { renderWithProviders, sampleUser } from "../../../test-utils.js";

describe("LinkTreeNavbar", () => {
  it("menampilkan nama pengguna bila profil ada", () => {
    renderWithProviders(LinkTreeNavbar, {}, { user: sampleUser });
    expect(screen.getByTestId("navbar-name")).toHaveTextContent("Dian");
  });

  it("tanpa profil tidak menampilkan nama", () => {
    renderWithProviders(LinkTreeNavbar);
    expect(screen.queryByTestId("navbar-name")).toBeNull();
  });

  it("logo menuju beranda", async () => {
    renderWithProviders(LinkTreeNavbar);
    currentPath.set("/users");
    await fireEvent.click(screen.getByText("Delcom Link Tree"));
    expect(get(currentPath)).toBe("/");
  });

  it("logout hanya berjalan bila dikonfirmasi", async () => {
    renderWithProviders(LinkTreeNavbar, {}, { token: "tok", user: sampleUser });
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    await fireEvent.click(screen.getByText("Keluar"));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(get(authToken)).toBe("tok");
    await fireEvent.click(screen.getByText("Keluar"));
    await waitFor(() => expect(get(authToken)).toBeNull());
  });
});
