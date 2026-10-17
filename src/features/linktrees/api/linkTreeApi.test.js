import { describe, it, expect, vi } from "vitest";

vi.mock("../../../helpers/apiHelper.js", () => ({ apiRequest: vi.fn(() => "res") }));

import { apiRequest } from "../../../helpers/apiHelper.js";
import * as api from "./linkTreeApi.js";

const body = { title: "T", type: "public", description: "D" };

describe("linkTreeApi", () => {
  it("postLinkTree", () => {
    expect(api.postLinkTree(body)).toBe("res");
    expect(apiRequest).toHaveBeenCalledWith("/link-trees", { method: "POST", body });
  });
  it("postCover memakai FormData field cover", () => {
    const file = new File(["x"], "c.png", { type: "image/png" });
    api.postCover(3, file);
    const [path, options] = apiRequest.mock.calls.at(-1);
    expect(path).toBe("/link-trees/3/cover");
    expect(options.formData.get("cover")).toBe(file);
  });
  it("putLinkTree", () => {
    api.putLinkTree(3, body);
    expect(apiRequest).toHaveBeenCalledWith("/link-trees/3", { method: "PUT", body });
  });
  it("getLinkTrees dengan dan tanpa is_me", () => {
    api.getLinkTrees(true);
    expect(apiRequest).toHaveBeenCalledWith("/link-trees?is_me=1");
    api.getLinkTrees(false);
    expect(apiRequest).toHaveBeenCalledWith("/link-trees");
  });
  it("getLinkTree", () => {
    api.getLinkTree(3);
    expect(apiRequest).toHaveBeenCalledWith("/link-trees/3");
  });
  it("deleteLinkTree & deleteAllLinkTrees", () => {
    api.deleteLinkTree(3);
    expect(apiRequest).toHaveBeenCalledWith("/link-trees/3", { method: "DELETE" });
    api.deleteAllLinkTrees();
    expect(apiRequest).toHaveBeenCalledWith("/link-trees", { method: "DELETE" });
  });
  it("item: post, put, delete", () => {
    api.postItem(3, { title: "A", url: "https://a.b" });
    expect(apiRequest).toHaveBeenCalledWith("/link-trees/3/items", {
      method: "POST",
      body: { title: "A", url: "https://a.b" },
    });
    api.putItem(3, 9, { title: "B", url: "https://b.c" });
    expect(apiRequest).toHaveBeenCalledWith("/link-trees/3/items/9", {
      method: "PUT",
      body: { title: "B", url: "https://b.c" },
    });
    api.deleteItem(3, 9);
    expect(apiRequest).toHaveBeenCalledWith("/link-trees/3/items/9", { method: "DELETE" });
  });
});
