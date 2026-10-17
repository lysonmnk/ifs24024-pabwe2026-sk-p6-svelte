<script>
  import { onMount } from "svelte";
  import { Pencil, Image, Plus, Trash2, ExternalLink, ArrowLeft, Link2 } from "lucide-svelte";
  import { authProfile } from "../../auth/states/authStore.js";
  import {
    linkTree,
    isDetailLoading,
    fetchLinkTree,
    deleteItem,
  } from "../states/linkTreesStore.js";
  import { TYPE_META } from "../linkTreeTypes.js";
  import {
    showConfirmDialog,
    formatDate,
    resolveAssetUrl,
    hasImage,
  } from "../../../helpers/toolsHelper.js";
  import NavLink from "../../common/components/NavLink.svelte";
  import Avatar from "../../common/components/Avatar.svelte";
  import ChangeModal from "../modals/ChangeModal.svelte";
  import ChangeCoverModal from "../modals/ChangeCoverModal.svelte";
  import ItemModal from "../modals/ItemModal.svelte";

  let { linkTreeId } = $props();

  let showChange = $state(false);
  let showCover = $state(false);
  let showItem = $state(false);
  let editingItem = $state(null);

  onMount(() => {
    linkTree.set(null);
    fetchLinkTree(linkTreeId);
  });

  function openAddItem() {
    editingItem = null;
    showItem = true;
  }

  function openEditItem(item) {
    editingItem = item;
    showItem = true;
  }

  async function handleDeleteItem(tree, item) {
    const confirmed = await showConfirmDialog(`Hapus tautan "${item.title}"?`);
    if (confirmed) await deleteItem(tree.id, item.id);
  }
</script>

<div class="space-y-7">
  <NavLink href="/" class="inline-flex min-h-11 items-center gap-1.5 rounded-lg text-sm font-bold text-pine-700 hover:text-pine-900 hover:underline">
    <ArrowLeft size={16} /> Semua Link Tree
  </NavLink>

  {#if $isDetailLoading}
    <h1 class="py-10 text-center font-display text-xl font-bold text-muted">Memuat data...</h1>
  {:else if !$linkTree}
    <h1 class="py-10 text-center font-display text-xl font-bold text-muted">Link tree tidak ditemukan.</h1>
  {:else}
    {@const tree = $linkTree}
    {@const isOwner = tree.user_id === $authProfile.id}
    {@const meta = TYPE_META[tree.type]}
    <section class="card flex flex-col gap-6 border-l-4 p-5 sm:p-6 md:flex-row {meta.accent}">
      {#if hasImage(tree.cover)}
        <img
          src={resolveAssetUrl(tree.cover)}
          alt={`Sampul ${tree.title}`}
          class="aspect-[4/3] w-full rounded-lg object-cover md:w-72 md:shrink-0"
        />
      {:else}
        <div class="grid aspect-[4/3] w-full place-items-center rounded-lg bg-pine-800 text-marigold-400 md:w-72 md:shrink-0">
          <Link2 size={56} />
        </div>
      {/if}
      <div class="flex min-w-0 flex-1 flex-col gap-4">
        <div class="space-y-2">
          <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold {meta.badge}">
            <meta.icon size={12} /> {meta.label}
          </span>
          <h1 class="break-words text-3xl font-extrabold leading-tight text-ink sm:text-4xl">{tree.title}</h1>
        </div>
        <p class="text-base text-ink">{tree.description}</p>
        <div class="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
          <Avatar name={tree.author.name} photo={tree.author.photo} size="h-7 w-7" />
          <span class="font-bold text-ink">{tree.author.name}</span>
          <span>· dibuat {formatDate(tree.created_at)}</span>
        </div>
        {#if isOwner}
          <div class="mt-auto flex flex-wrap gap-2">
            <button type="button" onclick={() => (showChange = true)} class="btn-secondary">
              <Pencil size={16} /> Ubah Data
            </button>
            <button type="button" onclick={() => (showCover = true)} class="btn-secondary">
              <Image size={16} /> Ubah Sampul
            </button>
          </div>
        {/if}
      </div>
    </section>

    <section class="space-y-4">
      <div class="flex flex-wrap items-center justify-between gap-3">
        <h2 class="text-2xl font-extrabold text-ink">{`Daftar Tautan (${tree.items.length})`}</h2>
        {#if isOwner}
          <button type="button" onclick={openAddItem} class="btn-primary">
            <Plus size={16} /> Tambah Tautan
          </button>
        {/if}
      </div>

      {#if tree.items.length === 0}
        <p class="rounded-xl border-2 border-dashed border-sage-400 px-4 py-12 text-center text-muted">
          Belum ada tautan.
        </p>
      {:else}
        <ul class="space-y-2.5">
          {#each tree.items as item (item.id)}
            <li class="card flex items-center justify-between gap-3 py-2 pl-2 pr-3">
              <a
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                class="flex min-h-12 min-w-0 flex-1 items-center gap-3 rounded-lg px-2 hover:bg-pine-50"
              >
                <span class="grid size-10 shrink-0 place-items-center rounded-lg bg-pine-100 text-pine-800">
                  <ExternalLink size={18} />
                </span>
                <span class="min-w-0">
                  <span class="block truncate font-bold text-ink">{item.title}</span>
                  <span class="block truncate text-sm text-muted">{item.url}</span>
                </span>
              </a>
              {#if isOwner}
                <div class="flex shrink-0">
                  <button
                    type="button"
                    aria-label={`Ubah tautan ${item.title}`}
                    onclick={() => openEditItem(item)}
                    class="btn-icon"
                  >
                    <Pencil size={18} />
                  </button>
                  <button
                    type="button"
                    aria-label={`Hapus tautan ${item.title}`}
                    onclick={() => handleDeleteItem(tree, item)}
                    class="btn-icon text-red-700 hover:bg-red-50"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              {/if}
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    {#if showChange}
      <ChangeModal linkTree={tree} onclose={() => (showChange = false)} />
    {/if}
    {#if showCover}
      <ChangeCoverModal linkTreeId={tree.id} onclose={() => (showCover = false)} />
    {/if}
    {#if showItem}
      <ItemModal linkTreeId={tree.id} item={editingItem} onclose={() => (showItem = false)} />
    {/if}
  {/if}
</div>
