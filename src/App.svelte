<script>
  import { currentPath, resolveRoute, navigate } from "./router.js";
  import { authToken } from "./features/auth/states/authStore.js";
  import AuthLayout from "./features/auth/layouts/AuthLayout.svelte";
  import LoginPage from "./features/auth/pages/LoginPage.svelte";
  import RegisterPage from "./features/auth/pages/RegisterPage.svelte";
  import LinkTreeLayout from "./features/linktrees/layouts/LinkTreeLayout.svelte";
  import HomePage from "./features/linktrees/pages/HomePage.svelte";
  import DetailPage from "./features/linktrees/pages/DetailPage.svelte";
  import UsersPage from "./features/users/pages/UsersPage.svelte";
  import ProfilePage from "./features/users/pages/ProfilePage.svelte";
  import NotFoundPage from "./features/common/pages/NotFoundPage.svelte";

  const route = $derived(resolveRoute($currentPath));

  // Penjaga rute: halaman aplikasi butuh token, halaman auth tidak boleh diakses saat login.
  $effect(() => {
    if (route.layout === "app" && !$authToken) navigate("/auth/login", { replace: true });
    else if (route.layout === "auth" && $authToken) navigate("/", { replace: true });
  });
</script>

{#if route.layout === "auth"}
  <AuthLayout>
    {#if route.page === "login"}
      <LoginPage />
    {:else}
      <RegisterPage />
    {/if}
  </AuthLayout>
{:else if route.layout === "app"}
  <LinkTreeLayout>
    {#if route.page === "home"}
      <HomePage />
    {:else if route.page === "detail"}
      {#key route.params.linkTreeId}
        <DetailPage linkTreeId={route.params.linkTreeId} />
      {/key}
    {:else if route.page === "users"}
      <UsersPage />
    {:else}
      <ProfilePage />
    {/if}
  </LinkTreeLayout>
{:else}
  <NotFoundPage />
{/if}
