import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("sweetalert2", () => ({ default: { fire: vi.fn() } }));

import Swal from "sweetalert2";
import {
  showSuccessDialog,
  showErrorDialog,
  showWarningDialog,
  showConfirmDialog,
  formatDate,
  cn,
  resolveAssetUrl,
  hasImage,
} from "./toolsHelper.js";

beforeEach(() => vi.clearAllMocks());

describe("dialog", () => {
  it("success", async () => {
    await showSuccessDialog("ok");
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "success", text: "ok" }));
  });
  it("error", async () => {
    await showErrorDialog("gagal");
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "error", text: "gagal" }));
  });
  it("warning", async () => {
    await showWarningDialog("hati-hati");
    expect(Swal.fire).toHaveBeenCalledWith(expect.objectContaining({ icon: "warning", text: "hati-hati" }));
  });
  it("confirm mengembalikan isConfirmed", async () => {
    Swal.fire.mockResolvedValueOnce({ isConfirmed: true });
    expect(await showConfirmDialog("yakin?")).toBe(true);
    Swal.fire.mockResolvedValueOnce({ isConfirmed: false });
    expect(await showConfirmDialog("yakin?")).toBe(false);
  });
});

describe("util", () => {
  it("formatDate memakai locale Indonesia", () => {
    expect(formatDate("2025-03-09T01:32:33.000000Z")).toMatch(/2025/);
  });
  it("cn menggabungkan dan menyelesaikan konflik class", () => {
    expect(cn("p-2", false, "p-4")).toBe("p-4");
  });
  it("resolveAssetUrl", () => {
    expect(resolveAssetUrl("")).toBe("");
    expect(resolveAssetUrl("https://x.test/a.png")).toBe("https://x.test/a.png");
    const origin = new URL(DELCOM_BASEURL).origin;
    expect(resolveAssetUrl("img/a.png")).toBe(`${origin}/img/a.png`);
    expect(resolveAssetUrl("/img/a.png")).toBe(`${origin}/img/a.png`);
  });
  it("hasImage", () => {
    expect(hasImage(undefined)).toBe(false);
    expect(hasImage("http://localhost:8000/")).toBe(false);
    expect(hasImage("http://localhost:8000/img/a.png")).toBe(true);
  });
});
