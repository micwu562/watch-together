<script lang="ts">
  import { get } from "svelte/store";

  import { onMount, onDestroy } from "svelte";
  import { clientID } from "./lib/clientData";
  import { addUser, removeUser } from "./lib/database/databaseOps";

  import SyncedPlayer from "./lib/SyncedPlayer.svelte";

  onMount(() => {
    clientID.set(Math.floor(Math.random() * 10000000));
    addUser(get(clientID).toString());
  });
  const beforeUnload = () => {
    removeUser(get(clientID).toString());
  };
</script>

<svelte:window on:beforeunload={beforeUnload} />

<main>
  <SyncedPlayer />
</main>
