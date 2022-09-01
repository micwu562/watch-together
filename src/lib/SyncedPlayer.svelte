<script lang="ts">
  import { syncPlayer } from "./syncPlayer";

  import YtPlayer from "./YTPlayer.svelte";

  let player;
  let playerInitialized = () => {
    syncPlayer(player);
  };

  let urlInput = "";
  const loadYTVideo = () => {
    player.loadVideoById({
      videoId: urlInput,
    });
  };
</script>

<div class="player">
  <YtPlayer bind:player bind:playerInitialized />
  <div>
    <input type="text" bind:value={urlInput} />
    <button on:click={loadYTVideo}>Change Video</button>
    <button
      on:click={() => {
        player.playVideo();
      }}>Play</button
    >
    <button
      on:click={() => {
        player.pauseVideo();
      }}>Stop</button
    >
  </div>
</div>
