import { createRawSnippet } from "svelte";
import { render, screen } from "@testing-library/svelte";
import { beforeEach, describe, expect, it } from "vitest";
import RootLayout from "../../routes/+layout.svelte";
import AuthRouteLayout from "../../routes/auth/+layout.svelte";
import { mockFetch, ok, resetStores, setPage, signIn, user } from "../utils";

const children = createRawSnippet(() => ({
  render: () => "<p>isi halaman</p>",
}));

describe("routes/auth/+layout", () => {
  it("merender children apa adanya", () => {
    render(AuthRouteLayout, { children });
    expect(screen.getByText("isi halaman")).toBeInTheDocument();
  });
});

describe("routes/+layout", () => {
  beforeEach(resetStores);

  it("rute /auth merender children tanpa kerangka kursus", () => {
    setPage("/auth/login");
    render(RootLayout, { children });
    expect(screen.getByText("isi halaman")).toBeInTheDocument();
    expect(screen.queryByRole("navigation", { name: "Navigasi utama" })).toBeNull();
  });

  it("rute lain membungkus children dengan CourseLayout", () => {
    setPage("/");
    signIn(user());
    mockFetch({ "GET /users/me": ok("ok", { user: user() }) });
    render(RootLayout, { children });
    expect(screen.getByText("isi halaman")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: "Navigasi utama" })).toBeInTheDocument();
  });
});