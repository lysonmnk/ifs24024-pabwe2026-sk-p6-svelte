<script>
  import { onMount } from "svelte";
  import LinkTreeNavbar from "../components/LinkTreeNavbar.svelte";
  import LinkTreeSidebar from "../components/LinkTreeSidebar.svelte";
  import { profile, loadProfile } from "../../users/states/usersStore.js";
  import { logout } from "../../auth/states/authStore.js";
  import { isSuccess } from "../../../helpers/apiHelper.js";

  let { children } = $props();

  onMount(async () => {
    if (!$profile) {
      const res = await loadProfile();
      if (!isSuccess(res)) logout();
    }
  });
</script>

<div class="min-h-screen flex flex-col">
  <LinkTreeNavbar />
  <div class="flex flex-1">
    <LinkTreeSidebar />
    <main class="flex-1 p-4 sm:p-6 min-w-0">
      {@render children()}
    </main>
  </div>
</div>
