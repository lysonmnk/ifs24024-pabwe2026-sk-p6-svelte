<script>
  import ModalShell from "../components/ModalShell.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { addItem, changeItem } from "../states/linkTreesStore.js";
  import { handleResult } from "../../../helpers/toolsHelper.js";

  let { linkTreeId, item, onClose } = $props();

  const title = useInput(item ? item.title : "");
  const url = useInput(item ? item.url : "");
  const titleValue = title.value;
  const urlValue = url.value;

  async function submit(event) {
    event.preventDefault();
    const data = { title: $titleValue, url: $urlValue };
    const res = item
      ? await changeItem(linkTreeId, item.id, data)
      : await addItem(linkTreeId, data);
    await handleResult(res, onClose);
  }
</script>

<ModalShell title={item ? "Ubah Tautan" : "Tambah Tautan"} {onClose}>
  <form onsubmit={submit} class="space-y-3" data-testid="item-form">
    <div>
      <label for="item-title" class="block text-sm font-medium mb-1">Judul tautan</label>
      <input id="item-title" required value={$titleValue} oninput={title.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </div>
    <div>
      <label for="item-url" class="block text-sm font-medium mb-1">URL</label>
      <input id="item-url" type="url" required value={$urlValue} oninput={url.onChange}
        class="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
    </div>
    <button type="submit" class="w-full rounded-lg bg-indigo-600 text-white py-2 text-sm font-semibold">Simpan</button>
  </form>
</ModalShell>
