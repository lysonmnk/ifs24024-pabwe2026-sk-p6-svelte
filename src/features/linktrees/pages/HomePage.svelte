<script>
  import { onMount } from "svelte";
  import { Plus, Search, Trash2, Link2 } from "lucide-svelte";
  import { authProfile } from "../../auth/states/authStore.js";
  import {
    linkTrees,
    isLoading,
    filterMine,
    fetchLinkTrees,
    deleteLinkTree,
    deleteAllLinkTrees,
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
  import AddModal from "../modals/AddModal.svelte";

  let query = $state("");
  let showAdd = $state(false);

  const filtered = $derived(
    $linkTrees.filter((tree) =>
      `${tree.title} ${tree.description}`.toLowerCase().includes(query.toLowerCase())
    )
  );

  const countType = (type) => $linkTrees.filter((tree) => tree.type === type).length;
  const stats = $derived([
    { label: "Total", value: $linkTrees.length },
    { label: "Publik", value: countType("public") },
    { label: "Tidak Terdaftar", value: countType("unlisted") },
    { label: "Privat", value: countType("private") },
    { label: "Total Tautan", value: $linkTrees.reduce((sum, tree) => sum + tree.total_links, 0) },
  ]);

  onMount(() => {
    fetchLinkTrees();
  });

  function toggleMine(event) {
    filterMine.set(event.target.checked);
    fetchLinkTrees();
  }

  async function handleDelete(tree) {
    const confirmed = await showConfirmDialog(`Hapus link tree "${tree.title}"?`);
    if (confirmed) await deleteLinkTree(tree.id);
  }

  async function handleDeleteAll() {
    const confirmed = await showConfirmDialog(
      "Hapus SEMUA link tree milikmu? Tindakan ini tidak dapat dibatalkan."
    );
    if (confirmed) await deleteAllLinkTrees();
  }
</script>

<div class="space-y-6">
  <div class="flex flex-wrap items-center justify-between gap-4">
    <h1 class="text-3xl font-extrabold text-ink sm:text-4xl">Semua Link Tree</h1>
    <div class="flex flex-wrap gap-2">
      <button type="button" onclick={handleDeleteAll} class="btn-danger">
        <Trash2 size={16} /> Hapus Semua
      </button>
      <button type="button" onclick={() => (showAdd = true)} class="btn-primary">
        <Plus size={16} /> Tambah
      </button>
    </div>
  </div>

  <dl class="card flex flex-wrap divide-x divide-sage-200 overflow-hidden">
    {#each stats as stat (stat.label)}
      <div class="flex min-w-[7.5rem] flex-1 flex-col gap-0.5 px-4 py-3">
        <dt class="text-sm text-muted">{stat.label}</dt>
        <dd class="font-display text-2xl font-extrabold text-pine-800">{stat.value}</dd>
      </div>
    {/each}
  </dl>

  <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
    <div class="relative min-w-60 flex-1">
      <Search size={18} class="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted" />
      <input
        type="search"
        placeholder="Cari link tree..."
        aria-label="Cari link tree"
        bind:value={query}
        class="field pl-10"
      />
    </div>
    <label class="switch inline-flex min-h-11 items-center gap-3 text-sm font-bold text-ink">
      <input type="checkbox" class="peer sr-only" checked={$filterMine} onchange={toggleMine} />
      <span
        aria-hidden="true"
        class="relative h-6 w-11 shrink-0 rounded-full bg-slate-500 transition-colors after:absolute after:left-0.5 after:top-0.5 after:size-5 after:rounded-full after:bg-white after:transition-transform peer-checked:bg-pine-600 peer-checked:after:translate-x-5 peer-focus-visible:outline-3 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-pine-600"
      ></span>
      Milik saya
    </label>
  </div>

  {#if $isLoading}
    <p class="py-12 text-center text-muted">Memuat data...</p>
  {:else if filtered.length === 0}
    <p class="rounded-xl border-2 border-dashed border-sage-400 px-4 py-12 text-center text-muted">
      Belum ada link tree.
    </p>
  {:else}
    <div class="grid gap-4 lg:grid-cols-2">
      {#each filtered as tree (tree.id)}
        {@const meta = TYPE_META[tree.type]}
        <article class="card flex overflow-hidden border-l-4 {meta.accent}">
          {#if hasImage(tree.cover)}
            <img src={resolveAssetUrl(tree.cover)} alt={`Sampul ${tree.title}`} class="w-28 shrink-0 object-cover sm:w-36" />
          {:else}
            <div class="grid w-28 shrink-0 place-items-center bg-pine-800 text-marigold-400 sm:w-36">
              <Link2 size={34} />
            </div>
          {/if}
          <div class="flex min-w-0 flex-1 flex-col gap-2.5 p-4">
            <div class="flex flex-wrap items-start justify-between gap-x-3 gap-y-1.5">
              <h2 class="min-w-0 break-words text-lg font-extrabold leading-snug">
                <NavLink href={`/link-trees/${tree.id}`} class="text-ink hover:text-pine-700 hover:underline">
                  {tree.title}
                </NavLink>
              </h2>
              <span class="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-bold {meta.badge}">
                <meta.icon size={12} /> {meta.label}
              </span>
            </div>
            <p class="line-clamp-2 text-sm text-muted">{tree.description}</p>
            <div class="mt-auto flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-muted">
              <Avatar name={tree.author.name} photo={tree.author.photo} size="h-6 w-6" />
              <span class="font-bold text-ink">{tree.author.name}</span>
              <span>· {tree.total_links} tautan</span>
              <span>· {formatDate(tree.created_at)}</span>
            </div>
            {#if tree.user_id === $authProfile.id}
              <button
                type="button"
                aria-label={`Hapus ${tree.title}`}
                onclick={() => handleDelete(tree)}
                class="-ml-3 inline-flex min-h-11 w-fit items-center gap-1.5 rounded-lg px-3 text-sm font-bold text-red-700 hover:bg-red-50"
              >
                <Trash2 size={16} /> Hapus
              </button>
            {/if}
          </div>
        </article>
      {/each}
    </div>
  {/if}
</div>

{#if showAdd}
  <AddModal onclose={() => (showAdd = false)} />
{/if}
