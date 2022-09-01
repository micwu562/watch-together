import { database } from "./firebase";
import { ref, set, onValue } from "firebase/database";
import { clientID } from "./clientData";
import { get } from "svelte/store";

const playerStateDBRef = ref(database, "playerState");
const videoURLRef = ref(database, "videoURL");

export const syncPlayer = (player) => {
  let ANTICIPATED_EVENTS = [];
  const addAnticipatedEvent = (data) => {
    ANTICIPATED_EVENTS.push({ timeStamp: new Date().getTime(), ...data });
  };
  const anticipateEvent = (event) => {
    console.log(ANTICIPATED_EVENTS);
    let foundIndex = ANTICIPATED_EVENTS.findIndex(
      (entry) => entry.type === event.type && entry.value === event.value
    );
    if (foundIndex === -1) {
      console.log(`${event.type} NOT DENIED`);
      return false;
    }
    ANTICIPATED_EVENTS.splice(foundIndex, 1);
    console.log("DENIED GG");
    return true;
  };
  const clearOldEventsInterval = setInterval(() => {
    const rightNow = new Date().getTime();
    ANTICIPATED_EVENTS = ANTICIPATED_EVENTS.filter(
      (item) => rightNow - item.timeStamp < 2000
    );
  }, 2000);

  const aiPlayVideo = () => {
    addAnticipatedEvent({ type: "onStateChange", value: 1 });
    player.playVideo();
  };
  const aiPauseVideo = () => {
    addAnticipatedEvent({ type: "onStateChange", value: 2 });
    player.pauseVideo();
  };
  const aiSeekTo = (time, currentStatus) => {
    addAnticipatedEvent(
      currentStatus === 2
        ? { type: "pauseScrub", value: time } // if paused, anticipate pauseScrub
        : { type: "onStateChange", value: 1 } // otherwise anticipate playState change
    );
    player.seekTo(time);
  };
  const aiChangePlaybackRate = (rate) => {
    addAnticipatedEvent({ type: "onPlaybackRateChange", value: rate });
    player.setPlaybackRate(rate);
  };

  let prevTime, prevPlayerState;
  let scrubDetectionInterval;
  const checkForPauseScrub = () => {
    const currentTime = player.getCurrentTime();
    const currentPlayerState = player.getPlayerState();

    if (
      currentPlayerState === 2 &&
      prevPlayerState !== 1 &&
      currentTime !== prevTime
    ) {
      onScrubWhilePaused(currentTime);
    }

    prevTime = currentTime;
    prevPlayerState = currentPlayerState;
  };
  scrubDetectionInterval = setInterval(checkForPauseScrub, 50);

  const updatePlayerPos = () => {
    // only accept playState values of 1 or 2 (fallback to 2)
    let playState = player.getPlayerState();
    playState = playState === 1 || playState === 2 ? playState : 2;

    const newState = {
      playState: playState,
      videoTime: player.getCurrentTime(),
      realTime: new Date().getTime(),
      playbackRate: player.getPlaybackRate(),
      lastActionBy: get(clientID),
    };

    set(playerStateDBRef, newState);
  };

  // SIGNAL play / scrub while playing; pause
  player.addEventListener("onStateChange", (e) => {
    console.log(`statechange: ${e.data}`);
    if (!(e.data === 1 || e.data === 2)) return; // only care abt play/pause
    if (anticipateEvent({ type: "onStateChange", value: e.data })) return; // ignore artificial events
    updatePlayerPos();
  });

  // SIGNAL playback speed
  player.addEventListener("onPlaybackRateChange", (e) => {
    console.log(`playbackchange: ${e.data}`);
    if (anticipateEvent({ type: "onPlaybackRateChange", value: e.data }))
      return;
    updatePlayerPos();
  });

  const onScrubWhilePaused = (time) => {
    if (anticipateEvent({ type: "pauseScrub", value: time })) return;
    updatePlayerPos();
  };

  // SIGNAL url change

  // SIGNAL

  // RECEIVE playerState change
  // note - update the scrubcheckinterval if necessary

  const syncPlayerPos = (playerState) => {
    // TODO: just don't call the functions if the values never changed.
    // oops

    if (playerState.lastActionBy === get(clientID)) return;

    if (playerState.playState === 2) {
      aiPauseVideo();
    } else if (playerState.playState === 1) {
      aiPlayVideo();
    }

    aiChangePlaybackRate(playerState.playbackRate);

    const timeOffset = (new Date().getTime() - playerState.realTime) / 1000;
    aiSeekTo(playerState.videoTime + timeOffset, playerState.playState);
  };
  onValue(playerStateDBRef, (snapshot) => {
    console.log("value changed");
    syncPlayerPos(snapshot.val());
  });
  onValue(videoURLRef, (snapshot) => {
    console.log(snapshot.val());
    player.loadVideoById({
      videoId: snapshot.val(),
    });
  });

  return () => {
    player.removeEventListener("onStateChange");
    player.removeEventListener("onPlaybackRateChange");
    clearInterval(scrubDetectionInterval);
    clearInterval(clearOldEventsInterval);
  };
};
