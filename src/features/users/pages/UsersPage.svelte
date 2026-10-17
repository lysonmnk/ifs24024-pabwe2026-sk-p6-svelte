<script>
  import { onMount } from "svelte";
  import { users, isUsersLoading, fetchUsers } from "../states/userStore.js";
  import { formatDate } from "../../../helpers/toolsHelper.js";
  import Avatar from "../../common/components/Avatar.svelte";

  onMount(() => {
    fetchUsers();
  });
</script>

<div class="space-y-6">
  <h1 class="text-3xl font-extrabold text-ink sm:text-4xl">Pengguna</h1>

  {#if $isUsersLoading}
    <p class="py-12 text-center text-muted">Memuat data...</p>
  {:else if $users.length === 0}
    <p class="rounded-xl border-2 border-dashed border-sage-400 px-4 py-12 text-center text-muted">
      Belum ada pengguna.
    </p>
  {:else}
    <ul class="card divide-y divide-sage-200 overflow-hidden">
      {#each $users as user (user.id)}
        <li class="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3.5 sm:px-5">
          <Avatar name={user.name} photo={user.photo} size="h-11 w-11" />
          <div class="min-w-0 flex-1">
            <p class="truncate font-bold text-ink">{user.name}</p>
            <p class="truncate text-sm text-muted">{user.email}</p>
          </div>
          <p class="w-full pl-[3.75rem] text-sm text-muted sm:w-auto sm:pl-0">Bergabung {formatDate(user.created_at)}</p>
        </li>
      {/each}
    </ul>
  {/if}
</div>
