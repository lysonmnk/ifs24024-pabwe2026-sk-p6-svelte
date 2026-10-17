import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// lucide-svelte dimock menjadi komponen kosong agar tes ringan dan stabil.
vi.mock("lucide-svelte", () => {
  const Icon = () => {};
  const names = [
    "Link2", "LogOut", "Layers", "Users", "User", "Plus", "Search",
    "Trash2", "Pencil", "Image", "ExternalLink", "ArrowLeft", "X",
    "Globe", "EyeOff", "Lock",
  ];
  return Object.fromEntries(names.map((name) => [name, Icon]));
});
