<script>
  import Modal from "../../common/components/Modal.svelte";
  import { useInput } from "../../../hooks/useInput.js";
  import { showWarningDialog } from "../../../helpers/toolsHelper.js";
  import { TYPE_OPTIONS } from "../linkTreeTypes.js";
  import { addLinkTree, isAdding } from "../states/linkTreesStore.js";

  let { onclose, options = TYPE_OPTIONS } = $props();

  const title = useInput("");
  const type = useInput("public");
  const description = useInput("");

  async function submit(event) {
    event.preventDefault();
    if (!$title.trim()) {
      await showWarningDialog("Judul wajib diisi");
      return;
    }
    const ok = await addLinkTree({
      title: $title.trim(),
      type: $type,
      description: $description,
    });
    if (ok) onclose();
  }
</script>

<Modal title="Tambah Link Tree" {onclose}>
  <form onsubmit={submit} class="space-y-5">
    <div>
      <label for="add-title" class="field-label">Judul</label>
      <input
        id="add-title"
        type="text"
        value={$title}
        oninput={title.onChange}
        class="field"
      />
    </div>
    <div>
      <label for="add-type" class="field-label">Tipe</label>
      <select
        id="add-type"
        value={$type}
        onchange={type.onChange}
        class="field"
      >
        {#each options as option (option.value)}
          <option value={option.value}>{option.label}</option>
        {/each}
      </select>
    </div>
    <div>
      <label for="add-description" class="field-label">Deskripsi</label>
      <textarea
        id="add-description"
        rows="3"
        value={$description}
        oninput={description.onChange}
        class="field"
      ></textarea>
    </div>
    <button
      type="submit"
      disabled={$isAdding}
      class="btn-primary w-full"
    >
      {$isAdding ? "Menyimpan..." : "Simpan"}
    </button>
  </form>
</Modal>
