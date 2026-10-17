<script>
  import { Link2 } from "lucide-svelte";
  import NavLink from "../components/NavLink.svelte";
</script>

<main
  class="on-dark flex min-h-screen flex-col items-start justify-center gap-5 bg-pine-950 px-8 py-16 text-white sm:px-20"
>
  <Link2 size={40} class="text-marigold-400" />
  <h1 class="font-display text-8xl font-extrabold leading-none text-marigold-400 sm:text-9xl">404</h1>
  <p class="max-w-md text-lg text-pine-100">Halaman yang kamu cari tidak ditemukan.</p>
  <NavLink href="/" class="btn-primary">Kembali ke Beranda</NavLink>
</main>
