<script lang="ts">
  import YtPlayer from "./YTPlayer.svelte";
  import MenuBar from "./MenuBar.svelte";
  import { establishPlayerSync } from "./player/syncPlayer";

  let player;
  let playerInitialized = () => {
    console.log("%cPlayer Initialized", "color: red;");

    const playerStartCheckInterval = setInterval(() => {
      if (player.getPlayerState() === 1) {
        console.log("%cPlayer Started", "color: orange;");
        clearInterval(playerStartCheckInterval);
        establishPlayerSync(player);
      }
    }, 100);
  };
</script>

<div class="player">
  <YtPlayer bind:player bind:playerInitialized />
  <div class="infobox">
    <MenuBar bind:player />
  </div>
</div>

<style>
  .infobox {
    padding: 5px;
  }
</style>
