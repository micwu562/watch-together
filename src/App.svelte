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
</main>
