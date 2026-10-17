import { describe, it, expect } from "vitest";
import { screen } from "@testing-library/svelte";
import { renderWithProviders, textSnippet } from "../../../test-utils.js";
import AuthLayout from "./AuthLayout.svelte";

describe("AuthLayout", () => {
  it("menampilkan identitas aplikasi dan isi", () => {
    renderWithProviders(AuthLayout, { props: { children: textSnippet("Form") } });
    expect(screen.getByText("Delcom Link Tree")).toBeInTheDocument();
    expect(screen.getByText(/Kumpulkan semua tautan/)).toBeInTheDocument();
    expect(screen.getByText("Form")).toBeInTheDocument();
  });

  it("memiliki landmark main dan satu heading level-1", () => {
    renderWithProviders(AuthLayout, { props: { children: textSnippet("Form") } });
    const main = screen.getByRole("main");
    expect(main).toContainElement(screen.getByText("Form"));
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  });
});
