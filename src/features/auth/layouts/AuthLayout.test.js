import { render, screen } from "@testing-library/svelte";
import AuthLayout from "./AuthLayout.svelte";
import { snippet } from "../../../test-utils.js";

describe("AuthLayout", () => {
  it("menampilkan identitas aplikasi dan konten anak", () => {
    render(AuthLayout, { props: { children: snippet("<p>isi form</p>") } });
    expect(screen.getByText("Delcom Link Tree")).toBeInTheDocument();
    expect(screen.getByText(/Kumpulkan semua tautan/)).toBeInTheDocument();
    expect(screen.getByText("isi form")).toBeInTheDocument();
  });
});
