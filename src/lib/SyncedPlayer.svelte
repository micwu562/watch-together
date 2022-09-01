<script lang="ts">
  import { syncPlayer } from "./syncPlayer";
  import YtPlayer from "./YTPlayer.svelte";

  import { database } from "./firebase";
  import { ref, set } from "firebase/database";
  import { get } from "svelte/store";
  import { clientID } from "./clientData";

  let player;
  let playerInitialized = () => {
    syncPlayer(player);
  };

  let urlInput = "";

  const playerStateDBRef = ref(database, "playerState");
  const videoURLRef = ref(database, "videoURL");

  const loadYTVideo = () => {
    const newState = {
      playState: 2,
      videoTime: 0,
      realTime: new Date().getTime(),
      playbackRate: player.getPlaybackRate(),
      lastActionBy: get(clientID),
    };

    set(videoURLRef, urlInput);
    set(playerStateDBRef, newState);
  };
</script>

<div class="player">
  <YtPlayer bind:player bind:playerInitialized />
  <div>
    <input type="text" bind:value={urlInput} />
    <button on:click={loadYTVideo}>Change Video</button>
  </div>
</div>
