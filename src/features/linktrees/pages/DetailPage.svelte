<script>
  import { onMount } from "svelte";
  import { Link, Pencil, Trash2, Plus, Image } from "lucide-svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ItemModal from "../modals/ItemModal.svelte";
  import { linkTree, loadLinkTree, removeItem } from "../states/linkTreesStore.js";
  import { link } from "../../../router.js";
  import { formatDate, handleResult, showConfirmDialog } from "../../../helpers/toolsHelper.js";

  let { linkTreeId } = $props();

  let showChange = $state(false);
  let showCover = $state(false);
  let showItem = $state(false);
  let editingItem = $state(null);

  const noop = () => {};

  onMount(() => {
    linkTree.set(null);
    loadLinkTree(linkTreeId);
  });

  const openItem = (item) => {
    editingItem = item;
    showItem = true;
  };

  async function remove(item) {
    if (await showConfirmDialog(`Hapus tautan "${item.title}"?`)) {
      await handleResult(await removeItem(linkTreeId, item.id), noop);
    }
  }
</script>

<section class="max-w-3xl space-y-5">
  <a href="/" onclick={link} class="text-sm text-indigo-600 font-semibold">&larr; Semua Link Tree</a>

  {#if $linkTree}
    <div class="bg-white border border-slate-200 rounded-2xl overflow-hidden">
      {#if $linkTree.cover}
        <img src={$linkTree.cover} alt={$linkTree.title} class="h-48 w-full object-cover" />
      {:else}
        <div class="h-48 flex items-center justify-center bg-indigo-50 text-indigo-400"><Link size={48} /></div>
      {/if}
      <div class="p-5 space-y-3">
        <div class="flex items-center justify-between gap-2">
          <h1 class="text-xl font-bold" data-testid="detail-title">{$linkTree.title}</h1>
          <span class="text-xs rounded-full bg-slate-100 px-2 py-0.5">{$linkTree.type}</span>
        </div>
        <p class="text-slate-600">{$linkTree.description}</p>
        <p class="text-xs text-slate-600">Dibuat {formatDate($linkTree.created_at)}</p>
        <div class="flex flex-wrap gap-2">
          <button type="button" onclick={() => (showChange = true)}
            class="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"><Pencil size={14} /> Ubah data</button>
          <button type="button" onclick={() => (showCover = true)}
            class="flex items-center gap-1 rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold"><Image size={14} /> Ubah sampul</button>
        </div>
      </div>
    </div>

    <div class="space-y-3">
      <div class="flex items-center justify-between">
        <h2 class="font-bold">Tautan</h2>
        <button type="button" onclick={() => openItem(null)}
          class="flex items-center gap-1 rounded-lg bg-indigo-600 text-white px-3 py-2 text-sm font-semibold"><Plus size={14} /> Tambah tautan</button>
      </div>
      {#if $linkTree.items.length === 0}
        <p class="text-slate-500" data-testid="no-items">Belum ada tautan.</p>
      {:else}
        <ul class="space-y-2">
          {#each $linkTree.items as item (item.id)}
            <li class="flex items-center justify-between gap-3 bg-white border border-slate-200 rounded-xl p-3" data-testid="item">
              <a href={item.url} target="_blank" rel="noreferrer" class="min-w-0">
                <p class="font-semibold truncate">{item.title}</p>
                <p class="text-sm text-slate-500 truncate">{item.url}</p>
              </a>
              <div class="flex gap-2 shrink-0">
                <button type="button" onclick={() => openItem(item)} aria-label={`Ubah ${item.title}`}><Pencil size={16} /></button>
                <button type="button" onclick={() => remove(item)} aria-label={`Hapus ${item.title}`} class="text-red-700"><Trash2 size={16} /></button>
              </div>
            </li>
          {/each}
        </ul>
      {/if}
    </div>
  {:else}
    <p class="text-slate-500" data-testid="loading">Memuat link tree...</p>
  {/if}
</section>

{#if showChange}
  <ChangeModal linkTree={$linkTree} onClose={() => (showChange = false)} />
{/if}
{#if showCover}
  <ChangeCoverModal {linkTreeId} onClose={() => (showCover = false)} />
{/if}
{#if showItem}
  <ItemModal {linkTreeId} item={editingItem} onClose={() => (showItem = false)} />
{/if}
