import { describe, it, expect } from "vitest";
import { get } from "svelte/store";
import { screen } from "@testing-library/svelte";
import { renderWithProviders } from "../../../test-utils.js";
import { currentPath } from "../../../router.js";
import NotFoundPage from "./NotFoundPage.svelte";

describe("NotFoundPage", () => {
  it("menampilkan 404 dan tautan kembali", () => {
    renderWithProviders(NotFoundPage, { path: "/zzz" });
    expect(screen.getByText("404")).toBeInTheDocument();
    screen.getByRole("link", { name: /Kembali ke Beranda/ }).click();
    expect(get(currentPath)).toBe("/");
  });

  it("seluruh konten berada di dalam landmark main dengan heading level-1", () => {
    renderWithProviders(NotFoundPage, { path: "/zzz" });
    expect(screen.getByRole("main")).toContainElement(screen.getByRole("heading", { level: 1, name: "404" }));
  });
});
