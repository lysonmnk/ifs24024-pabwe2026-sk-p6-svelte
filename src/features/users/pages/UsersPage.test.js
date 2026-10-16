import { screen, waitFor } from "@testing-library/svelte";
import UsersPage from "./UsersPage.svelte";
import { renderWithProviders, mockApi, okResponse, sampleUser } from "../../../test-utils.js";

describe("UsersPage", () => {
  it("menampilkan keadaan kosong", () => {
    mockApi({ "GET /users": okResponse({ users: [] }) });
    renderWithProviders(UsersPage);
    expect(screen.getByTestId("users-empty")).toBeInTheDocument();
  });

  it("menampilkan daftar pengguna", async () => {
    mockApi({ "GET /users": okResponse({ users: [sampleUser] }) });
    renderWithProviders(UsersPage);
    await waitFor(() => expect(screen.getByText("dian@example.com")).toBeInTheDocument());
    expect(screen.getByText("D")).toBeInTheDocument();
  });
});
