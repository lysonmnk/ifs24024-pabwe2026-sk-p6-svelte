<script>
  import ModalShell from "../components/ModalShell.svelte";
  import { changeCover } from "../states/linkTreesStore.js";
  import { handleResult, showWarningDialog } from "../../../helpers/toolsHelper.js";

  let { linkTreeId, onClose } = $props();
  let file = $state(null);

  const onFile = (event) => {
    file = event.target.files[0];
  };

  async function submit(event) {
    event.preventDefault();
    if (!file) {
      await showWarningDialog("Pilih berkas cover terlebih dahulu");
      return;
    }
    const res = await changeCover(linkTreeId, file);
    await handleResult(res, onClose);
  }
</script>

<ModalShell title="Ubah Sampul" {onClose}>
  <form onsubmit={submit} class="space-y-3" data-testid="cover-form">
    <input type="file" accept="image/*" aria-label="Pilih berkas sampul" onchange={onFile} data-testid="cover-input" class="text-sm" />
    <button type="submit" class="w-full rounded-lg bg-indigo-600 text-white py-2 text-sm font-semibold">Unggah sampul</button>
  </form>
</ModalShell>
