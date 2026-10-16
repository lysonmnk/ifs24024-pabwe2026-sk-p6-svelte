import Swal from "sweetalert2";
import { screen, fireEvent, waitFor } from "@testing-library/svelte";
import ChangeCoverModal from "./ChangeCoverModal.svelte";
import { renderWithProviders, mockApi, okResponse, sampleTree } from "../../../test-utils.js";

describe("ChangeCoverModal", () => {
  it("memperingatkan bila berkas kosong, lalu mengunggah", async () => {
    const onClose = vi.fn();
    const fetchMock = mockApi({
      "POST /link-trees/t1/cover": okResponse({}, "Sampul diubah"),
      "GET /link-trees/t1": okResponse({ link_tree: sampleTree }),
    });
    renderWithProviders(ChangeCoverModal, { linkTreeId: "t1", onClose });
    await fireEvent.submit(screen.getByTestId("cover-form"));
    await waitFor(() => expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "warning" })));
    expect(fetchMock).not.toHaveBeenCalled();

    const file = new File(["x"], "c.png", { type: "image/png" });
    await fireEvent.change(screen.getByTestId("cover-input"), { target: { files: [file] } });
    await fireEvent.submit(screen.getByTestId("cover-form"));
    await waitFor(() => expect(onClose).toHaveBeenCalled());
    expect(fetchMock.mock.calls[0][1].body.get("cover")).toBeInstanceOf(File);
  });
});
