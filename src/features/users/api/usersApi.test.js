import { getUsers, getMe, putMe, postPhoto, putPassword } from "./usersApi.js";
import { mockApi, okResponse } from "../../../test-utils.js";

describe("usersApi", () => {
  it("memanggil endpoint pengguna", async () => {
    const fetchMock = mockApi({
      "GET /users": okResponse(),
      "GET /users/me": okResponse(),
      "PUT /users/me": okResponse(),
      "POST /users/photo": okResponse(),
      "PUT /users/change-password": okResponse(),
    });
    await getUsers();
    await getMe();
    await putMe({ name: "a" });
    await postPhoto(new File(["x"], "a.png"));
    await putPassword({ password: "a", new_password: "b" });
    const keys = fetchMock.mock.calls.map(([url, o]) => `${o.method || "GET"} ${url.replace(DELCOM_BASEURL, "")}`);
    expect(keys).toEqual([
      "GET /users",
      "GET /users/me",
      "PUT /users/me",
      "POST /users/photo",
      "PUT /users/change-password",
    ]);
    expect(fetchMock.mock.calls[3][1].body.get("photo")).toBeInstanceOf(File);
  });
});
