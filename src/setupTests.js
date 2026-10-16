import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";
import StubIcon from "./test-icon.svelte";

// Ikon lucide-svelte diganti komponen stub agar render pengujian ringan.
vi.mock("lucide-svelte", () => ({
  Link: StubIcon,
  LogOut: StubIcon,
  Users: StubIcon,
  User: StubIcon,
  Plus: StubIcon,
  Trash2: StubIcon,
  Pencil: StubIcon,
  Image: StubIcon,
}));

// Dialog SweetAlert2 dimock; secara bawaan pengguna menekan tombol konfirmasi.
vi.mock("sweetalert2", () => ({
  default: { fire: vi.fn().mockResolvedValue({ isConfirmed: true }) },
}));
