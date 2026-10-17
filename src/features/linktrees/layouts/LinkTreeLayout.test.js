import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders, textSnippet } from "../../../test-utils.js";
import LinkTreeLayout from "./LinkTreeLayout.svelte";

describe("LinkTreeLayout", () => {
  it("membungkus navbar, sidebar, dan konten", () => {
    renderWithProviders(LinkTreeLayout, { props: { children: textSnippet("Konten utama") } });
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Semua Link Tree/ })).toBeInTheDocument();
    expect(screen.getByText("Konten utama")).toBeInTheDocument();
  });
});
