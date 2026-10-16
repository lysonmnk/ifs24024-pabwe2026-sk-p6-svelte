<script>
  import ModalShell from "../components/ModalShell.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { changeLinkTree } from "../states/linkTreesStore.js";
  import { handleResult } from "../../../helpers/toolsHelper.js";

  let { linkTree, onClose } = $props();

  const title = useInput(linkTree.title);
  const type = useInput(linkTree.type);
  const description = useInput(linkTree.description);
  const titleValue = title.value;
  const typeValue = type.value;
  const descriptionValue = description.value;

  async function submit(event) {
    event.preventDefault();
    const res = await changeLinkTree(linkTree.id, {
      title: $titleValue,
      type: $typeValue,
      description: $descriptionValue,
    });
    await handleResult(res, onClose);
  }
</script>

<ModalShell title="Ubah Link Tree" {onClose}>
  <form onsubmit={submit} class="space-y-3" data-testid="change-form">
    <div>
      <label for="change-title" class="block text-sm font-medium mb-1">Judul</label>
      <input id="change-title" required value={$titleValue} oninput={title.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </div>
    <div>
      <label for="change-type" class="block text-sm font-medium mb-1">Tipe</label>
      <select id="change-type" bind:value={$typeValue}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="public">Public</option>
        <option value="unlisted">Unlisted</option>
        <option value="private">Private</option>
      </select>
    </div>
    <div>
      <label for="change-description" class="block text-sm font-medium mb-1">Deskripsi</label>
      <textarea id="change-description" rows="3" required value={$descriptionValue} oninput={description.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
    </div>
    <button type="submit" class="w-full rounded-lg bg-indigo-600 text-white py-2 text-sm font-semibold">Simpan perubahan</button>
  </form>
</ModalShell>
