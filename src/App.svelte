<script lang="ts">
  import { onMount } from "svelte";
  import { clientID } from "./lib/clientData";

  import SyncedPlayer from "./lib/SyncedPlayer.svelte";

  onMount(() => {
    clientID.set(Math.floor(Math.random() * 10000000));
  });
</script>

<main>
  <SyncedPlayer />

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank"
      >SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
  .read-the-docs {
    color: #888;
  }
</style>
