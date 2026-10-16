import Swal from "sweetalert2";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

const dialog = (icon, title, text) =>
  Swal.fire({ icon, title, text, confirmButtonColor: "#4f46e5" });

export const showSuccessDialog = (message) => dialog("success", "Berhasil", message);
export const showErrorDialog = (message) => dialog("error", "Gagal", message);
export const showWarningDialog = (message) => dialog("warning", "Perhatian", message);

export async function showConfirmDialog(message) {
  const result = await Swal.fire({
    icon: "warning",
    title: "Konfirmasi",
    text: message,
    showCancelButton: true,
    confirmButtonText: "Ya",
    cancelButtonText: "Batal",
    confirmButtonColor: "#4f46e5",
  });
  return result.isConfirmed;
}

/** Tampilkan dialog sesuai hasil API; jalankan onSuccess bila berhasil. */
export async function handleResult(response, onSuccess) {
  if (response.status === "success") {
    await showSuccessDialog(response.message);
    onSuccess();
    return true;
  }
  await showErrorDialog(response.message);
  return false;
}

export function formatDate(value) {
  return new Date(value).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export const cn = (...inputs) => twMerge(clsx(inputs));
