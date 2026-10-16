<script>
  import { Link, Users, User } from "lucide-svelte";
  import { currentPath, link } from "../../../router.js";
  import { cn } from "../../../helpers/toolsHelper.js";

  const menuClass = (path, href) =>
    cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium",
      path === href ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-100"
    );
</script>

<aside class="w-56 shrink-0 bg-white border-r border-slate-200 p-3 hidden sm:block">
  <nav class="space-y-1">
    <a href="/" onclick={link} class={menuClass($currentPath, "/")}><Link size={18} /> Semua Link Tree</a>
    <a href="/users" onclick={link} class={menuClass($currentPath, "/users")}><Users size={18} /> Pengguna</a>
    <a href="/profile" onclick={link} class={menuClass($currentPath, "/profile")}><User size={18} /> Profil</a>
  </nav>
</aside>
