<script>
  import { link } from "../../../router.js";
</script>

<div class="min-h-screen flex flex-col items-center justify-center text-center p-6">
  <p class="text-6xl font-extrabold text-indigo-600">404</p>
  <h1 class="text-xl font-bold mt-2">Halaman tidak ditemukan</h1>
  <p class="text-slate-500 mt-1">Alamat yang kamu tuju tidak tersedia.</p>
  <a href="/" onclick={link} class="mt-4 rounded-lg bg-indigo-600 text-white px-4 py-2 text-sm font-semibold">
    Kembali ke beranda
  </a>
</div>
