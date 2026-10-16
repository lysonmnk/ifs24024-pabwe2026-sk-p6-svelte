<script>
  import ModalShell from "../components/ModalShell.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { addLinkTree } from "../states/linkTreesStore.js";
  import { handleResult } from "../../../helpers/toolsHelper.js";

  let { onClose } = $props();

  const title = useInput();
  const type = useInput("public");
  const description = useInput();
  const titleValue = title.value;
  const typeValue = type.value;
  const descriptionValue = description.value;

  async function submit(event) {
    event.preventDefault();
    const res = await addLinkTree({
      title: $titleValue,
      type: $typeValue,
      description: $descriptionValue,
    });
    await handleResult(res, onClose);
  }
</script>

<ModalShell title="Tambah Link Tree" {onClose}>
  <form onsubmit={submit} class="space-y-3" data-testid="add-form">
    <div>
      <label for="add-title" class="block text-sm font-medium mb-1">Judul</label>
      <input id="add-title" required value={$titleValue} oninput={title.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </div>
    <div>
      <label for="add-type" class="block text-sm font-medium mb-1">Tipe</label>
      <select id="add-type" bind:value={$typeValue}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm">
        <option value="public">Public</option>
        <option value="unlisted">Unlisted</option>
        <option value="private">Private</option>
      </select>
    </div>
    <div>
      <label for="add-description" class="block text-sm font-medium mb-1">Deskripsi</label>
      <textarea id="add-description" rows="3" required value={$descriptionValue} oninput={description.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"></textarea>
    </div>
    <button type="submit" class="w-full rounded-lg bg-indigo-600 text-white py-2 text-sm font-semibold">Simpan</button>
  </form>
</ModalShell>
