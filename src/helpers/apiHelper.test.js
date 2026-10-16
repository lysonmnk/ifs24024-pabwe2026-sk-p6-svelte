import {
  getAccessToken,
  putAccessToken,
  removeAccessToken,
  request,
  isSuccess,
} from "./apiHelper.js";
import { mockApi, okResponse } from "../test-utils.js";

describe("apiHelper", () => {
  beforeEach(() => localStorage.clear());

  it("menyimpan, membaca, dan menghapus token", () => {
    expect(getAccessToken()).toBeNull();
    putAccessToken("abc");
    expect(getAccessToken()).toBe("abc");
    removeAccessToken();
    expect(getAccessToken()).toBeNull();
  });

  it("mengirim JSON beserta header Authorization", async () => {
    putAccessToken("tok");
    const fetchMock = mockApi({ "POST /x": okResponse({ a: 1 }) });
    const res = await request("/x", { method: "POST", body: { a: 1 } });
    expect(res.status).toBe("success");
    const [url, options] = fetchMock.mock.calls[0];
    expect(url).toContain("/x");
    expect(options.headers.Authorization).toBe("Bearer tok");
    expect(options.headers["Content-Type"]).toBe("application/json");
    expect(options.body).toBe('{"a":1}');
  });

  it("mengirim FormData tanpa Content-Type dan tanpa token", async () => {
    const fetchMock = mockApi({ "POST /up": okResponse() });
    const form = new FormData();
    await request("/up", { method: "POST", form });
    const options = fetchMock.mock.calls[0][1];
    expect(options.body).toBe(form);
    expect(options.headers).toEqual({});
  });

  it("GET tanpa body", async () => {
    const fetchMock = mockApi({ "GET /y": okResponse() });
    await request("/y");
    expect(fetchMock.mock.calls[0][1].body).toBeUndefined();
  });

  it("mengembalikan galat bila jaringan gagal", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("offline"));
    const res = await request("/z");
    expect(res.status).toBe("error");
    expect(isSuccess(res)).toBe(false);
  });

  it("isSuccess", () => {
    expect(isSuccess({ status: "success" })).toBe(true);
  });
});
