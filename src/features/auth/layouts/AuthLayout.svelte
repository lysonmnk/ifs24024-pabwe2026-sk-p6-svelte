<script>
  import { Link2 } from "lucide-svelte";

  let { children } = $props();
</script>

<main class="grid min-h-screen lg:grid-cols-[5fr_4fr]">
  <section class="on-dark relative flex flex-col justify-between gap-10 overflow-hidden bg-pine-950 px-6 py-8 text-white sm:px-12 lg:py-14">
    <svg
      aria-hidden="true"
      viewBox="0 0 400 400"
      fill="none"
      class="pointer-events-none absolute -bottom-16 -right-16 hidden h-96 w-96 text-pine-700 lg:block"
    >
      <g stroke="currentColor" stroke-width="10" stroke-linecap="round">
        <path d="M200 400V190" />
        <path d="M200 280 110 190" />
        <path d="M200 210 300 110" />
        <path d="M110 190 70 130" />
      </g>
      <g fill="currentColor">
        <circle cx="60" cy="115" r="26" />
        <circle cx="305" cy="100" r="30" />
        <circle cx="200" cy="170" r="22" />
        <circle cx="110" cy="190" r="16" />
      </g>
    </svg>
    <span class="relative flex size-12 items-center justify-center rounded-lg bg-marigold-400 text-pine-950">
      <Link2 size={24} />
    </span>
    <div class="relative max-w-lg">
      <h1 class="font-display text-4xl font-extrabold leading-tight sm:text-5xl">Delcom Link Tree</h1>
      <p class="mt-4 text-lg text-pine-100">
        Kumpulkan semua tautan pentingmu dalam satu halaman, lalu bagikan ke siapa saja.
      </p>
    </div>
  </section>
  <div class="flex items-center justify-center bg-sage-100 px-4 py-10 sm:px-8">
    <div class="card w-full max-w-md p-7 sm:p-8">
      {@render children()}
    </div>
  </div>
</main>
