<script>
  import { Link2, LogOut } from "lucide-svelte";
  import { authProfile, logout } from "../../auth/states/authStore.js";
  import { navigate } from "../../../router.js";
  import { showConfirmDialog } from "../../../helpers/toolsHelper.js";
  import NavLink from "../../common/components/NavLink.svelte";
  import Avatar from "../../common/components/Avatar.svelte";

  async function handleLogout() {
    const confirmed = await showConfirmDialog("Yakin ingin keluar dari akun?");
    if (!confirmed) return;
    await logout();
    navigate("/auth/login");
  }
</script>

<header class="on-dark sticky top-0 z-40 bg-pine-950 text-white">
  <div class="flex h-16 items-center justify-between gap-3 px-4 sm:px-6">
    <NavLink href="/" class="flex items-center gap-3 rounded-lg py-1 pr-2 font-display text-lg font-extrabold">
      <span class="flex size-10 items-center justify-center rounded-lg bg-marigold-400 text-pine-950">
        <Link2 size={20} />
      </span>
      Delcom Link Tree
    </NavLink>
    <div class="flex items-center gap-2">
      <NavLink href="/profile" class="flex min-h-11 items-center gap-2.5 rounded-lg px-2 hover:bg-white/10">
        <Avatar name={$authProfile.name} photo={$authProfile.photo} size="h-9 w-9" />
        <span class="sr-only text-sm font-bold sm:not-sr-only">{$authProfile.name}</span>
      </NavLink>
      <button
        type="button"
        aria-label="Keluar"
        onclick={handleLogout}
        class="inline-grid size-11 place-items-center rounded-lg border border-white/30 text-white transition-colors hover:bg-white/10"
      >
        <LogOut size={18} />
      </button>
    </div>
  </div>
</header>
