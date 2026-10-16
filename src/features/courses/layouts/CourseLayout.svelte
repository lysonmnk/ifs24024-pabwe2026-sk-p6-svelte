<script lang="ts">
  import type { Snippet } from "svelte";
  import Navbar from "../../../components/Navbar.svelte";
  import Sidebar from "../../../components/Sidebar.svelte";
  import AuthSessionRedirect from "../../auth/components/AuthSessionRedirect.svelte";
  import { authStore, loadProfile } from "../../auth/states/authStore";

  let { children }: { children: Snippet } = $props();
  let menuOpen = $state(false);

  $effect(() => {
    if ($authStore.token && !$authStore.profile && !$authStore.loading) void loadProfile();
  });
</script>

<svelte:head>
  {#if !$authStore.profile}
    <title>Memuat sesi · Delcom Courses</title>
  {/if}
</svelte:head>

<AuthSessionRedirect mode="protected" />

{#if $authStore.profile}
  <div class="min-h-screen">
    <Navbar onmenu={() => (menuOpen = !menuOpen)} />
    <div class="lg:flex">
      <Sidebar open={menuOpen} onnavigate={() => (menuOpen = false)} />
      <main id="main-content" class="min-w-0 flex-1 p-4 sm:p-8">{@render children()}</main>
    </div>
  </div>
{:else}
  <main id="main-content" class="grid min-h-screen place-items-center">
    <h1 class="sr-only">Delcom Courses</h1>
    <p class="text-ink-500" role="status">Memuat sesi...</p>
  </main>
{/if}