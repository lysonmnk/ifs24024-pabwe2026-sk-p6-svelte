<script>
  import Navbar from "../components/Navbar.svelte";
  import Sidebar from "../components/Sidebar.svelte";

  let { children } = $props();
</script>

<!-- Bingkai gelap (header + rel) membungkus kanvas konten yang terang. -->
<div class="min-h-screen bg-pine-950">
  <Navbar />
  <div class="md:grid md:grid-cols-[15rem_minmax(0,1fr)]">
    <Sidebar />
    <main class="min-h-[calc(100vh-4rem)] min-w-0 bg-sage-100 px-4 pb-28 pt-7 sm:px-8 md:rounded-tl-3xl md:pb-12 md:pt-9">
      <div class="mx-auto max-w-5xl">
        {@render children()}
      </div>
    </main>
  </div>
</div>
