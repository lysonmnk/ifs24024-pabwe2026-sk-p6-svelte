import { postLogin, postRegister } from "./authApi.js";
import { mockApi, okResponse } from "../../../test-utils.js";

describe("authApi", () => {
  it("login dan register memakai POST", async () => {
    const fetchMock = mockApi({
      "POST /auth/login": okResponse({ token: "t" }),
      "POST /auth/register": okResponse(),
    });
    expect((await postLogin({ email: "a", password: "b" })).data.token).toBe("t");
    expect((await postRegister({ name: "n", email: "a", password: "b" })).status).toBe("success");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
