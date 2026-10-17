<script>
  import Modal from "../../common/components/Modal.svelte";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";
  import { changeCover, isChangingCover } from "../states/linkTreesStore.js";

  let { linkTreeId, onclose } = $props();

  let file = $state(null);

  function pick(event) {
    file = event.target.files[0];
  }

  async function submit(event) {
    event.preventDefault();
    if (!file) {
      await showWarningDialog("Pilih gambar sampul terlebih dahulu");
      return;
    }
    const ok = await changeCover(linkTreeId, file);
    if (ok) onclose();
  }
</script>

<Modal title="Ubah Sampul" {onclose}>
  <form onsubmit={submit} class="space-y-5">
    <div>
      <label for="cover-file" class="field-label">Gambar Sampul</label>
      <input
        id="cover-file"
        type="file"
        accept="image/*"
        onchange={pick}
        class="field cursor-pointer py-2 text-sm file:mr-3 file:rounded-md file:border-0 file:bg-pine-100 file:px-3 file:py-1.5 file:font-bold file:text-pine-800"
      />
    </div>
    <button
      type="submit"
      disabled={$isChangingCover}
      class="btn-primary w-full"
    >
      {$isChangingCover ? "Mengunggah..." : "Unggah"}
    </button>
  </form>
</Modal>
