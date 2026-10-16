import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import ItemModal from "./ItemModal.svelte";
import { renderWithProviders, mockApi, okResponse, sampleTree } from "../../../test-utils.js";

const routes = {
  "POST /link-trees/t1/items": okResponse({}, "Ditambah"),
  "PUT /link-trees/t1/items/i1": okResponse({}, "Diubah"),
  "GET /link-trees/t1": okResponse({ link_tree: sampleTree }),
};

describe("ItemModal", () => {
  it("mode tambah", async () => {
    const onClose = vi.fn();
    const fetchMock = mockApi(routes);
    renderWithProviders(ItemModal, { linkTreeId: "t1", item: null, onClose });
    expect(screen.getByRole("dialog", { name: "Tambah Tautan" })).toBeInTheDocument();
    await fireEvent.input(screen.getByLabelText("Judul tautan"), { target: { value: "Blog" } });
    await fireEvent.input(screen.getByLabelText("URL"), { target: { value: "https://blog.dev" } });
    await fireEvent.submit(screen.getByTestId("item-form"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0][1].method).toBe("POST");
  });

  it("mode ubah terisi data tautan", async () => {
    const onClose = vi.fn();
    const fetchMock = mockApi(routes);
    renderWithProviders(ItemModal, { linkTreeId: "t1", item: sampleTree.items[0], onClose });
    expect(screen.getByRole("dialog", { name: "Ubah Tautan" })).toBeInTheDocument();
    expect(screen.getByLabelText("Judul tautan")).toHaveValue("GitHub");
    await fireEvent.submit(screen.getByTestId("item-form"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0][1].method).toBe("PUT");
  });
});
