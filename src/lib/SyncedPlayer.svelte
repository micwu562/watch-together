<script lang="ts">
  import YtPlayer from "./YTPlayer.svelte";
  import MenuBar from "./MenuBar.svelte";
  import { PlayerInterface } from "./player/playerInterface";
  import {
    onDBPlayerStateUpdate,
    setDBPlayerState,
  } from "./database/databaseOps";
  import { get } from "svelte/store";
  import { clientID } from "./clientData";

  let player, playerInterface;
  let playerInitialized = () => {
    console.log("%cPlayer Initialized", "color: red;");

    const playerStartCheckInterval = setInterval(() => {
      if (player.getPlayerState() === 1) {
        console.log("%cPlayer Started", "color: orange;");
        clearInterval(playerStartCheckInterval);

        establishPlayerSync();
      }
    }, 100);
  };

  const establishPlayerSync = () => {
    // create player interface
    playerInterface = new PlayerInterface(player);

    // syncs player when db changes
    onDBPlayerStateUpdate((snapshot) => {
      const playerState = snapshot.val();
      if (playerState.lastActionBy === get(clientID)) return;

      console.log("%c synchronizing...", "color: yellow");

      if (playerState.playState !== player.getPlayerState()) {
        playerState.playState === 2
          ? playerInterface.pauseVideo()
          : playerInterface.playVideo();
      }

      if (playerState.playbackRate !== player.getPlaybackRate())
        playerInterface.changePlaybackRate(playerState.playbackRate);

      // compensate for lag (not needed when paused)
      const timeOffset =
        playerState.playState === 2
          ? 0
          : ((new Date().getTime() - playerState.realTime) *
              playerState.playbackRate) /
            1000;
      playerInterface.seekTo(
        // bit of a hack - if videos already over, set time to end - 1s
        Math.min(playerState.videoTime + timeOffset, player.getDuration() - 1),
        playerState.playState
      );
    });

    playerInterface.userEventHandlers.onStateChange = updatePlayerPos;
    playerInterface.userEventHandlers.onPlaybackRateChange = updatePlayerPos;
    playerInterface.userEventHandlers.pauseScrub = updatePlayerPos;
  };

  const updatePlayerPos = () => {
    // only accept playState values of 1 or 2 (fallback to 2)
    let playState = player.getPlayerState() === 1 ? 1 : 2;

    setDBPlayerState({
      playState: playState,
      videoTime: player.getCurrentTime(),
      realTime: new Date().getTime(),
      playbackRate: player.getPlaybackRate(),
      lastActionBy: get(clientID),
    });
  };
</script>

<div class="player">
  <YtPlayer bind:player bind:playerInitialized />
  <div class="infobox">
    <MenuBar player />
  </div>
</div>

<style>
  .infobox {
    background-color: #282828;
    color: #303030;
    padding: 5px;
  }
</style>
