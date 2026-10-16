import Swal from "sweetalert2";
import { get } from "svelte/store";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import HomePage from "./HomePage.svelte";
import { currentPath } from "../../../router.js";
import { renderWithProviders, mockApi, okResponse, sampleTree, sampleUser } from "../../../test-utils.js";

const other = { ...sampleTree, id: "t2", user_id: "u2", title: "Resep", type: "private", cover: "http://x/c.png" };
const third = { ...sampleTree, id: "t3", user_id: "u2", title: "Musik", type: "unlisted" };
const routes = () => ({
  "GET /link-trees": okResponse({ link_trees: [sampleTree, other, third] }),
  "DELETE /link-trees/t1": okResponse({}, "Dihapus"),
  "DELETE /link-trees": okResponse({}, "Semua dihapus"),
  "POST /link-trees": okResponse({}, "Dibuat"),
});

describe("HomePage", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan daftar, cover/placeholder, dan statistik", async () => {
    mockApi(routes());
    renderWithProviders(HomePage, {}, { user: sampleUser });
    await waitFor(() => expect(screen.getAllByTestId("card")).toHaveLength(3));
    expect(screen.getByAltText("Resep")).toBeInTheDocument();
    expect(screen.getByTestId("stat-total")).toHaveTextContent("3");
    expect(screen.getByTestId("stat-public")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-unlisted")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-private")).toHaveTextContent("1");
    expect(screen.getByTestId("stat-mine")).toHaveTextContent("1");
  });

  it("pencarian dan filter milik saya", async () => {
    mockApi(routes());
    renderWithProviders(HomePage, {}, { user: sampleUser });
    await waitFor(() => expect(screen.getAllByTestId("card")).toHaveLength(3));
    await fireEvent.input(screen.getByLabelText("Cari"), { target: { value: "resep" } });
    expect(screen.getAllByTestId("card")).toHaveLength(1);
    await fireEvent.input(screen.getByLabelText("Cari"), { target: { value: "" } });
    await fireEvent.click(screen.getByLabelText("Milik saya"));
    expect(screen.getAllByTestId("card")).toHaveLength(1);
    await fireEvent.input(screen.getByLabelText("Cari"), { target: { value: "zzz" } });
    expect(screen.getByTestId("empty")).toBeInTheDocument();
  });

  it("tanpa profil, tidak ada yang dianggap milik saya", async () => {
    mockApi(routes());
    renderWithProviders(HomePage);
    await waitFor(() => expect(screen.getAllByTestId("card")).toHaveLength(3));
    expect(screen.getByTestId("stat-mine")).toHaveTextContent("0");
  });

  it("judul menuju halaman detail", async () => {
    mockApi(routes());
    renderWithProviders(HomePage, {}, { user: sampleUser });
    await waitFor(() => expect(screen.getByText("Portofolio")).toBeInTheDocument());
    await fireEvent.click(screen.getByText("Portofolio"));
    expect(get(currentPath)).toBe("/link-trees/t1");
  });

  it("membuka dan menutup modal tambah", async () => {
    mockApi(routes());
    renderWithProviders(HomePage);
    await fireEvent.click(screen.getByText("Tambah"));
    expect(screen.getByRole("dialog", { name: "Tambah Link Tree" })).toBeInTheDocument();
    await fireEvent.click(screen.getByLabelText("Tutup"));
    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("hapus satu link tree (dibatalkan lalu dikonfirmasi)", async () => {
    const fetchMock = mockApi(routes());
    renderWithProviders(HomePage, {}, { user: sampleUser });
    await waitFor(() => expect(screen.getAllByTestId("card")).toHaveLength(3));
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    await fireEvent.click(screen.getByLabelText("Hapus Portofolio"));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(fetchMock.mock.calls.some(([, o]) => o.method === "DELETE")).toBe(false);
    await fireEvent.click(screen.getByLabelText("Hapus Portofolio"));
    await waitFor(() => expect(fetchMock.mock.calls.some(([u, o]) => o.method === "DELETE" && u.endsWith("/t1"))).toBe(true));
  });

  it("hapus semua (dibatalkan lalu dikonfirmasi)", async () => {
    const fetchMock = mockApi(routes());
    renderWithProviders(HomePage);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    await fireEvent.click(screen.getByText("Hapus semua"));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalled());
    expect(fetchMock.mock.calls.some(([, o]) => o.method === "DELETE")).toBe(false);
    await fireEvent.click(screen.getByText("Hapus semua"));
    await waitFor(() => expect(fetchMock.mock.calls.some(([u, o]) => o.method === "DELETE" && u.endsWith("/link-trees"))).toBe(true));
  });
});
