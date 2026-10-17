<script>
  import { resolveAssetUrl, hasImage } from "../../../helpers/toolsHelper.js";

  let { name, photo, size = "h-9 w-9" } = $props();

  const src = $derived(resolveAssetUrl(photo));
  const initial = $derived(name.charAt(0).toUpperCase());
</script>

{#if hasImage(src)}
  <img {src} alt="" class="{size} rounded-full object-cover ring-2 ring-white" />
{:else}
  <span
    aria-hidden="true"
    data-testid="avatar-initial"
    class="{size} inline-flex shrink-0 items-center justify-center rounded-full bg-pine-100 font-display text-sm font-extrabold text-pine-800 ring-2 ring-white"
  >{initial}</span>
{/if}
