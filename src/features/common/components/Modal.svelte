<script>
  import { X } from "lucide-svelte";

  let { title, onclose, children } = $props();
</script>

<div class="fixed inset-0 z-50 flex items-end justify-center sm:items-center sm:p-4">
  <button
    type="button"
    aria-label="Tutup modal"
    class="absolute inset-0 bg-pine-950/70"
    onclick={onclose}
  ></button>
  <div
    role="dialog"
    aria-modal="true"
    aria-label={title}
    class="relative z-10 max-h-[92vh] w-full overflow-y-auto rounded-t-2xl border-t-4 border-marigold-400 bg-white p-6 shadow-2xl sm:max-w-md sm:rounded-xl"
  >
    <div class="mb-5 flex items-center justify-between gap-3">
      <h2 class="font-display text-xl font-extrabold text-ink">{title}</h2>
      <button type="button" aria-label="Tutup" class="btn-icon" onclick={onclose}>
        <X size={20} />
      </button>
    </div>
    {@render children()}
  </div>
</div>
