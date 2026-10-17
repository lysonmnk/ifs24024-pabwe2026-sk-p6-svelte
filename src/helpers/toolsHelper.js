import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/** SweetAlert2 dimuat saat pertama dipakai agar tidak membebani bundle awal. */
async function fire(options) {
  const { default: Swal } = await import("sweetalert2");
  return Swal.fire(options);
}

export function showSuccessDialog(text) {
  return fire({
    icon: "success",
    title: "Berhasil",
    text,
    timer: 1600,
    showConfirmButton: false,
  });
}

export function showErrorDialog(text) {
  return fire({ icon: "error", title: "Gagal", text });
}

export function showWarningDialog(text) {
  return fire({ icon: "warning", title: "Perhatian", text });
}

export async function showConfirmDialog(text) {
  const result = await fire({
    icon: "question",
    title: "Konfirmasi",
    text,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
  });
  return result.isConfirmed;
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

/** Gabungkan class Tailwind tanpa konflik. */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/** Ubah path relatif dari API (mis. img/profile/1.png) menjadi URL absolut. */
export function resolveAssetUrl(path) {
  if (!path) return "";
  if (/^https?:\/\//.test(path)) return path;
  return `${new URL(DELCOM_BASEURL).origin}/${path.replace(/^\//, "")}`;
}

/** API mengembalikan URL root saat cover kosong, jadi dianggap tidak ada gambar. */
export function hasImage(url) {
  return Boolean(url) && !url.endsWith("/");
}
