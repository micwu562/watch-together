import { get } from "svelte/store";
import { clientID } from "../clientData";
import {
  onDBPlayerStateUpdate,
  onDBVideoURLUpdate,
  updateDBPlayerState,
} from "../database/databaseOps";
import { PlayerInterface } from "./playerInterface";

const computeActualTime = (playerState) => {
  if (playerState.playState === 2) return playerState.videoTime;
  return (
    playerState.videoTime +
    ((new Date().getTime() - playerState.realTime) * playerState.playbackRate) /
      1000
  );
};

export const establishPlayerSync = (player) => {
  // create player interface
  const playerInterface = new PlayerInterface(player);

  // SYNC: sync player when db changes
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
    const actualTime = computeActualTime(playerState);
    playerInterface.seekTo(
      // bit of a hack - if videos already over, set time to end - 1s
      Math.min(actualTime, player.getDuration() - 1),
      playerState.playState
    );
  });

  // SYNC: sync database when player changes
  const updatePlayerPos = () => {
    // only accept playState values of 1 or 2 (fallback to 2)
    let playState = player.getPlayerState() === 1 ? 1 : 2;

    updateDBPlayerState({
      playState: playState,
      videoTime: player.getCurrentTime(),
      playbackRate: player.getPlaybackRate(),
    });
  };

  playerInterface.userEventHandlers.onStateChange = updatePlayerPos;
  playerInterface.userEventHandlers.onPlaybackRateChange = updatePlayerPos;
  playerInterface.userEventHandlers.pauseScrub = updatePlayerPos;

  // SYNC: sync link changes
  onDBVideoURLUpdate((snapshot) => {
    const url = snapshot.val();
    console.log(player.getVideoUrl());
    playerInterface.loadVideo(snapshot.val());
  });
};
