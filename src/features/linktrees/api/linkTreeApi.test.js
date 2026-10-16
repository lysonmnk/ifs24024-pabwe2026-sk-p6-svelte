import * as api from "./linkTreeApi.js";
import { mockApi, okResponse } from "../../../test-utils.js";

describe("linkTreeApi", () => {
  it("memanggil seluruh endpoint link tree", async () => {
    const fetchMock = mockApi({
      "POST /link-trees": okResponse(),
      "POST /link-trees/1/cover": okResponse(),
      "PUT /link-trees/1": okResponse(),
      "GET /link-trees": okResponse(),
      "GET /link-trees/1": okResponse(),
      "DELETE /link-trees/1": okResponse(),
      "DELETE /link-trees": okResponse(),
      "POST /link-trees/1/items": okResponse(),
      "PUT /link-trees/1/items/2": okResponse(),
      "DELETE /link-trees/1/items/2": okResponse(),
    });
    await api.postLinkTree({ title: "a", type: "public", description: "b" });
    await api.postCover("1", new File(["x"], "c.png"));
    await api.putLinkTree("1", {});
    await api.getLinkTrees();
    await api.getLinkTree("1");
    await api.deleteLinkTree("1");
    await api.deleteAllLinkTrees();
    await api.postItem("1", {});
    await api.putItem("1", "2", {});
    await api.deleteItem("1", "2");
    const results = fetchMock.mock.results.length;
    expect(results).toBe(10);
    const statuses = await Promise.all(fetchMock.mock.results.map((r) => r.value.then((v) => v.json())));
    expect(statuses.every((s) => s.status === "success")).toBe(true);
    expect(fetchMock.mock.calls[1][1].body.get("cover")).toBeInstanceOf(File);
  });
});
