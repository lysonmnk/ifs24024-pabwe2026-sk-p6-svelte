<script>
  import { Link, LogOut } from "lucide-svelte";
  import { profile } from "../../users/states/usersStore.js";
  import { logout } from "../../auth/states/authStore.js";
  import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
  import { link } from "../../../router.js";

  async function onLogout() {
    if (await showConfirmDialog("Yakin ingin keluar dari akun?")) logout();
  }
</script>

<header class="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-4">
  <a href="/" onclick={link} class="flex items-center gap-2 font-extrabold text-indigo-600">
    <Link size={22} /> Delcom Link Tree
  </a>
  <div class="flex items-center gap-3">
    {#if $profile}
      <span class="text-sm font-medium" data-testid="navbar-name">{$profile.name}</span>
    {/if}
    <button type="button" onclick={onLogout} class="flex items-center gap-1 text-sm text-slate-600 hover:text-red-600">
      <LogOut size={16} /> Keluar
    </button>
  </div>
</header>
