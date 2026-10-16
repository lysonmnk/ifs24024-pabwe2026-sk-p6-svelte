import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import ChangeModal from "./ChangeModal.svelte";
import { renderWithProviders, mockApi, okResponse, sampleTree } from "../../../test-utils.js";

describe("ChangeModal", () => {
  it("terisi data lama dan menyimpan perubahan", async () => {
    const onClose = vi.fn();
    const fetchMock = mockApi({
      "PUT /link-trees/t1": okResponse({}, "Diubah"),
      "GET /link-trees/t1": okResponse({ link_tree: sampleTree }),
    });
    renderWithProviders(ChangeModal, { linkTree: sampleTree, onClose });
    expect(screen.getByLabelText("Judul")).toHaveValue("Portofolio");
    expect(screen.getByLabelText("Tipe")).toHaveValue("public");
    await fireEvent.input(screen.getByLabelText("Judul"), { target: { value: "Baru" } });
    await fireEvent.change(screen.getByLabelText("Tipe"), { target: { value: "unlisted" } });
    await fireEvent.input(screen.getByLabelText("Deskripsi"), { target: { value: "D" } });
    await fireEvent.submit(screen.getByTestId("change-form"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(JSON.parse(fetchMock.mock.calls[0][1].body)).toEqual({ title: "Baru", type: "unlisted", description: "D" });
  });
});
