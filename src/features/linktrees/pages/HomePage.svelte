<script>
  import { onMount } from "svelte";
  import { Link, Plus, Trash2 } from "lucide-svelte";
  import AddModal from "../modals/AddModal.svelte";
  import {
    linkTrees,
    loadLinkTrees,
    removeLinkTree,
    removeAllLinkTrees,
  } from "../states/linkTreesStore.js";
  import { profile } from "../../users/states/usersStore.js";
  import { link } from "../../../router.js";
  import { handleResult, showConfirmDialog } from "../../../helpers/toolsHelper.js";

  let search = $state("");
  let onlyMine = $state(false);
  let showAdd = $state(false);

  const noop = () => {};
  const isMine = (item) => item.user_id === ($profile || {}).id;

  const filtered = $derived(
    $linkTrees.filter(
      (item) =>
        item.title.toLowerCase().includes(search.toLowerCase()) && (!onlyMine || isMine(item))
    )
  );

  const stats = $derived({
    total: $linkTrees.length,
    public: $linkTrees.filter((item) => item.type === "public").length,
    unlisted: $linkTrees.filter((item) => item.type === "unlisted").length,
    private: $linkTrees.filter((item) => item.type === "private").length,
    mine: $linkTrees.filter(isMine).length,
  });

  onMount(() => {
    loadLinkTrees();
  });

  async function remove(item) {
    if (await showConfirmDialog(`Hapus link tree "${item.title}"?`)) {
      await handleResult(await removeLinkTree(item.id), noop);
    }
  }

  async function removeAll() {
    if (await showConfirmDialog("Hapus semua link tree? Tindakan ini tidak dapat dibatalkan.")) {
      await handleResult(await removeAllLinkTrees(), noop);
    }
  }
</script>

<section class="space-y-5">
  <div class="flex flex-wrap items-center justify-between gap-3">
    <h1 class="text-xl font-bold">Semua Link Tree</h1>
    <div class="flex gap-2">
      <button type="button" onclick={removeAll}
        class="flex items-center gap-1 rounded-lg border border-red-200 text-red-600 px-3 py-2 text-sm font-semibold">
        <Trash2 size={16} /> Hapus semua
      </button>
      <button type="button" onclick={() => (showAdd = true)}
        class="flex items-center gap-1 rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm font-semibold">
        <Plus size={16} /> Tambah
      </button>
    </div>
  </div>

  <div class="grid grid-cols-2 sm:grid-cols-5 gap-3" data-testid="stats">
    <div class="bg-white border border-slate-200 rounded-xl p-3"><p class="text-xs text-slate-500">Total</p><p class="text-xl font-bold" data-testid="stat-total">{stats.total}</p></div>
    <div class="bg-white border border-slate-200 rounded-xl p-3"><p class="text-xs text-slate-500">Public</p><p class="text-xl font-bold" data-testid="stat-public">{stats.public}</p></div>
    <div class="bg-white border border-slate-200 rounded-xl p-3"><p class="text-xs text-slate-500">Unlisted</p><p class="text-xl font-bold" data-testid="stat-unlisted">{stats.unlisted}</p></div>
    <div class="bg-white border border-slate-200 rounded-xl p-3"><p class="text-xs text-slate-500">Private</p><p class="text-xl font-bold" data-testid="stat-private">{stats.private}</p></div>
    <div class="bg-white border border-slate-200 rounded-xl p-3"><p class="text-xs text-slate-500">Milik saya</p><p class="text-xl font-bold" data-testid="stat-mine">{stats.mine}</p></div>
  </div>

  <div class="flex flex-wrap items-center gap-3">
    <input type="search" placeholder="Cari link tree..." bind:value={search} aria-label="Cari"
      class="flex-1 min-w-48 rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    <label class="flex items-center gap-2 text-sm" for="only-mine">
      <input id="only-mine" type="checkbox" bind:checked={onlyMine} /> Milik saya
    </label>
  </div>

  {#if filtered.length === 0}
    <p class="text-slate-500" data-testid="empty">Tidak ada link tree.</p>
  {:else}
    <ul class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {#each filtered as item (item.id)}
        <li class="bg-white border border-slate-200 rounded-2xl overflow-hidden" data-testid="card">
          {#if item.cover}
            <img src={item.cover} alt={item.title} class="h-32 w-full object-cover" />
          {:else}
            <div class="h-32 flex items-center justify-center bg-indigo-50 text-indigo-400"><Link size={36} /></div>
          {/if}
          <div class="p-4 space-y-2">
            <div class="flex items-center justify-between gap-2">
              <a href={`/link-trees/${item.id}`} onclick={link} class="font-bold truncate hover:text-indigo-600">{item.title}</a>
              <span class="text-xs rounded-full bg-slate-100 px-2 py-0.5">{item.type}</span>
            </div>
            <p class="text-sm text-slate-500 line-clamp-2">{item.description}</p>
            <button type="button" onclick={() => remove(item)} aria-label={`Hapus ${item.title}`}
              class="text-red-700 text-sm flex items-center gap-1"><Trash2 size={14} /> Hapus</button>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>

{#if showAdd}
  <AddModal onClose={() => (showAdd = false)} />
{/if}
