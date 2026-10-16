import Swal from "sweetalert2";
import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  handleResult,
  formatDate,
  cn,
} from "./toolsHelper.js";

describe("toolsHelper", () => {
  beforeEach(() => vi.clearAllMocks());

  it("menampilkan dialog sukses, galat, dan peringatan", async () => {
    await showSuccessDialog("a");
    await showErrorDialog("b");
    await showWarningDialog("c");
    expect(Swal.fire.mock.calls.map((c) => c[0].icon)).toEqual(["success", "error", "warning"]);
  });

  it("dialog konfirmasi mengembalikan pilihan pengguna", async () => {
    expect(await showConfirmDialog("yakin?")).toBe(true);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("yakin?")).toBe(false);
  });

  it("handleResult menjalankan callback hanya saat sukses", async () => {
    const onSuccess = vi.fn();
    expect(await handleResult({ status: "success", message: "ok" }, onSuccess)).toBe(true);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(await handleResult({ status: "fail", message: "gagal" }, onSuccess)).toBe(false);
    expect(onSuccess).toHaveBeenCalledTimes(1);
    expect(Swal.fire.mock.calls[1][0].icon).toBe("error");
  });

  it("memformat tanggal Indonesia", () => {
    expect(formatDate("2026-01-15T00:00:00Z")).toMatch(/2026/);
  });

  it("cn menggabungkan kelas Tailwind", () => {
    expect(cn("px-2", false, "px-4")).toBe("px-4");
  });
});
