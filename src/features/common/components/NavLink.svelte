<script>
  import { navigate } from "../../../router.js";

  let { href, class: className, children } = $props();

  function go(event) {
    event.preventDefault();
    navigate(href);
  }
</script>

<a {href} class={className} onclick={go}>{@render children()}</a>
