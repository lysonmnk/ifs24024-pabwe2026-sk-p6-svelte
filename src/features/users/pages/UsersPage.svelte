<script>
  import { onMount } from "svelte";
  import { users, loadUsers } from "../states/usersStore.js";

  onMount(() => {
    loadUsers();
  });
</script>

<section>
  <h1 class="text-xl font-bold mb-4">Pengguna</h1>
  {#if $users.length === 0}
    <p class="text-slate-500" data-testid="users-empty">Belum ada pengguna.</p>
  {:else}
    <ul class="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {#each $users as user (user.id)}
        <li class="flex items-center gap-3 bg-white border border-slate-200 rounded-xl p-3">
          <div class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div class="min-w-0">
            <p class="font-semibold truncate">{user.name}</p>
            <p class="text-sm text-slate-500 truncate">{user.email}</p>
          </div>
        </li>
      {/each}
    </ul>
  {/if}
</section>
