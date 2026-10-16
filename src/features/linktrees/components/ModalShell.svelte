<script>
  let { title, onClose, children } = $props();
</script>

<div class="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/50 p-4" role="dialog" aria-label={title}>
  <div class="w-full max-w-md bg-white rounded-2xl p-5 shadow-xl">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-lg font-bold">{title}</h2>
      <button type="button" onclick={onClose} aria-label="Tutup" class="text-slate-600 hover:text-slate-700 text-xl leading-none">&times;</button>
    </div>
    {@render children()}
  </div>
</div>
