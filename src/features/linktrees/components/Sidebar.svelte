<script>
  import { Layers, Users, User } from "lucide-svelte";
  import { currentPath } from "../../../router.js";
  import { cn } from "../../../helpers/toolsHelper.js";
  import NavLink from "../../common/components/NavLink.svelte";

  const menus = [
    { href: "/", label: "Semua Link Tree", icon: Layers, match: /^\/($|link-trees)/ },
    { href: "/users", label: "Pengguna", icon: Users, match: /^\/users/ },
    { href: "/profile", label: "Profil", icon: User, match: /^\/profile/ },
  ];
</script>

<!-- Desktop: rel vertikal di kiri. Seluler: bilah tab tetap di bawah layar. -->
<aside
  class="on-dark fixed inset-x-0 bottom-0 z-30 border-t border-white/15 bg-pine-950 md:static md:border-0 md:px-4 md:pb-8 md:pt-4"
>
  <nav
    aria-label="Menu utama"
    class="mx-auto flex max-w-lg gap-1 p-2 md:sticky md:top-20 md:max-w-none md:flex-col md:p-0"
  >
    {#each menus as menu (menu.href)}
      <NavLink
        href={menu.href}
        class={cn(
          "flex min-h-12 flex-1 flex-col items-center justify-center gap-1 rounded-lg px-2 py-1.5 text-xs font-bold md:flex-none md:flex-row md:justify-start md:gap-3 md:px-3.5 md:py-2.5 md:text-sm",
          menu.match.test($currentPath)
            ? "bg-indigo-600 text-white shadow-[inset_4px_0_0_0_var(--color-marigold-400)]"
            : "text-pine-100 hover:bg-white/10"
        )}
      >
        <menu.icon size={18} />
        <span>{menu.label}</span>
      </NavLink>
    {/each}
  </nav>
</aside>
