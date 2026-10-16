import Swal from "sweetalert2";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import AddModal from "./AddModal.svelte";
import { renderWithProviders, mockApi, okResponse, failResponse } from "../../../test-utils.js";

async function submit() {
  await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Baru" } });
  await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "private" } });
  await fireEvent.input(screen.getByLabelText("Deskripsi"), { target: { value: "Isi" } });
  await fireEvent.submit(screen.getByTestId("add-form"));
}

describe("AddModal", () => {
  it("mengirim data dan menutup saat berhasil", async () => {
    const onClose = vi.fn();
    const fetchMock = mockApi({ "POST /link-trees": okResponse({}, "Dibuat"), "GET /link-trees": okResponse({ link_trees: [] }) });
    renderWithProviders(AddModal, { onClose });
    await submit();
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ title: "Baru", type: "private", description: "Isi" });
  });

  it("menampilkan galat dan tetap terbuka saat gagal", async () => {
    const onClose = vi.fn();
    mockApi({ "POST /link-trees": failResponse("Gagal simpan") });
    renderWithProviders(AddModal, { onClose });
    await submit();
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error" })));
    expect(onClose).not.toHaveBeenCalled();
  });
});
