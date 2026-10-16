import { get } from "svelte/store";
import { render, screen, waitFor } from "@testing-library/svelte";
import LinkTreeLayout from "./LinkTreeLayout.svelte";
import { profile } from "../../users/states/usersStore.js";
import { authToken } from "../../auth/states/authStore.js";
import { renderWithProviders, mockApi, okResponse, failResponse, snippet, sampleUser } from "../../../test-utils.js";

describe("LinkTreeLayout", () => {
  it("tidak memuat profil bila sudah ada", () => {
    const fetchMock = mockApi({});
    renderWithProviders(LinkTreeLayout, { children: snippet("<p>konten</p>") }, { token: "t", user: sampleUser });
    expect(screen.getByText("konten")).toBeInTheDocument();
    expect(screen.getByText("Delcom Link Tree")).toBeInTheDocument();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("memuat profil bila belum ada", async () => {
    mockApi({ "GET /users/me": okResponse({ user: sampleUser }) });
    renderWithProviders(LinkTreeLayout, { children: snippet() }, { token: "t" });
    await waitFor(() => expect(get(profile)).toEqual(sampleUser));
  });

  it("logout otomatis bila profil gagal dimuat", async () => {
    mockApi({ "GET /users/me": failResponse() });
    renderWithProviders(LinkTreeLayout, { children: snippet() }, { token: "t" });
    await waitFor(() => expect(get(authToken)).toBeNull());
  });
});
