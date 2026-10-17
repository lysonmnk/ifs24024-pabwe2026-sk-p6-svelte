import { describe, it, expect } from "vitest";
import { get } from "svelte/store";
import { screen } from "@testing-library/svelte";
import { renderWithProviders, textSnippet } from "../../../test-utils.js";
import { currentPath } from "../../../router.js";
import NavLink from "./NavLink.svelte";

describe("NavLink", () => {
  it("menavigasi tanpa reload saat diklik", () => {
    renderWithProviders(NavLink, { props: { href: "/users", class: "x", children: textSnippet("Pengguna") } });
    const link = screen.getByRole("link");
    expect(link).toHaveAttribute("href", "/users");
    link.click();
    expect(get(currentPath)).toBe("/users");
  });
});
