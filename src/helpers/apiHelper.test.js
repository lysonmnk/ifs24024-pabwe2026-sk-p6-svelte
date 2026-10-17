import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  apiRequest,
  getErrorMessage,
} from "./apiHelper.js";

const mockFetch = (impl) => {
  const fn = vi.fn(impl);
  vi.stubGlobal("fetch", fn);
  return fn;
};
const okJson = (json) => () => Promise.resolve({ json: () => Promise.resolve(json) });

beforeEach(() => localStorage.clear());
afterEach(() => vi.unstubAllGlobals());

describe("token storage", () => {
  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });
});

describe("apiRequest", () => {
  it("mengirim body JSON dengan header Authorization", async () => {
    putAccessToken("tok");
    const fetchFn = mockFetch(okJson({ status: "success" }));
    const res = await apiRequest("/x", { method: "POST", body: { a: 1 } });
    expect(res).toEqual({ status: "success" });
    const [url, options] = fetchFn.mock.calls[0];
    expect(url).toBe(`${DELCOM_API_URL}/x`);
    expect(options.method).toBe("POST");
    expect(options.headers.Authorization).toBe("Bearer tok");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.body).toBe(JSON.stringify({ a: 1 }));
  });

  it("GET tanpa token dan tanpa body memakai nilai bawaan", async () => {
    const fetchFn = mockFetch(okJson({ status: "success" }));
    await apiRequest("/x");
    const [, options] = fetchFn.mock.calls[0];
    expect(options.method).toBe("GET");
    expect(options.headers.Authorization).toBeUndefined();
    expect(options.headers["Content-Type"]).toBeUndefined();
    expect(options.body).toBeUndefined();
  });

  it("tidak mengirim token saat auth=false", async () => {
    putAccessToken("tok");
    const fetchFn = mockFetch(okJson({ status: "success" }));
    await apiRequest("/x", { auth: false });
    expect(fetchFn.mock.calls[0][1].headers.Authorization).toBeUndefined();
  });

  it("mengirim FormData tanpa Content-Type manual", async () => {
    const fetchFn = mockFetch(okJson({ status: "success" }));
    const formData = new FormData();
    await apiRequest("/x", { method: "POST", formData });
    const [, options] = fetchFn.mock.calls[0];
    expect(options.body).toBe(formData);
    expect(options.headers["Content-Type"]).toBeUndefined();
  });

  it("mengembalikan fail saat jaringan error", async () => {
    mockFetch(() => Promise.reject(new Error("offline")));
    const res = await apiRequest("/x");
    expect(res).toEqual({ status: "fail", message: "Gagal terhubung ke server" });
  });
});

describe("getErrorMessage", () => {
  it("hanya pesan bila tidak ada data", () => {
    expect(getErrorMessage({ message: "Gagal" })).toBe("Gagal");
  });
  it("hanya pesan bila data kosong", () => {
    expect(getErrorMessage({ message: "Gagal", data: {} })).toBe("Gagal");
  });
  it("menggabungkan detail validasi", () => {
    const res = { message: "Data tidak valid", data: { title: ["Judul wajib"], url: ["URL salah"] } };
    expect(getErrorMessage(res)).toBe("Data tidak valid\nJudul wajib\nURL salah");
  });
});
