interface eventEntry {
  timeStamp: number;
  type: string;
  data: any;
}
interface eventHandlers {
  onStateChange?: (e: number) => void;
  onPlaybackRateChange?: (e: number) => void;
  pauseScrub?: (e: number) => void;
}

type Interval = ReturnType<typeof setInterval>;

export class PlayerInterface {
  player: any; // oops
  CODE_EVENTS: eventEntry[];
  eventCleaner: Interval;
  scrubDetectionInterval: Interval;
  userEventHandlers: eventHandlers;

  constructor(player) {
    this.player = player;

    // setup event anticipation
    this.CODE_EVENTS = [];

    this.eventCleaner = setInterval(() => {
      const rightNow = new Date().getTime();
      this.CODE_EVENTS = this.CODE_EVENTS.filter(
        (item) => rightNow - item.timeStamp < 1500
      );
    }, 300);
    this.userEventHandlers = {};

    // setup raw event handlers
    ["onStateChange", "onPlaybackRateChange"].forEach((name) => {
      this.player.addEventListener(name, (e) => {
        this.handleRawEvent(name, e.data);
      });
    });

    this.videoChanges = 0;
  }

  // Event anticipation bs
  // Lets code distinguish between user-triggered and code-triggered events
  registerCodeEvent(type: string, data: any) {
    this.CODE_EVENTS.push({
      timeStamp: new Date().getTime(),
      type: type,
      data: data,
    });
  }
  isUserEvent(type: string, data: any) {
    let foundIndex = this.CODE_EVENTS.findIndex(
      (e) => e.type === type && e.data === data
    );
    if (foundIndex === -1) {
      console.log(`%c✅ ${type}:${data}`, "color: lime");
      return true;
    }

    this.CODE_EVENTS.splice(foundIndex, 1);
    console.log(`%c⛔ ${type}:${data}`, "color: red");
    return false;
  }

  // Player control functions
  // Will not trigger onUser events
  playVideo() {
    this.registerCodeEvent("onStateChange", 1);
    this.player.playVideo();
  }
  pauseVideo() {
    this.registerCodeEvent("onStateChange", 2);
    this.player.pauseVideo();
  }
  seekTo(time: number, currentPlayerStatus: number) {
    console.log(`seeking to: ${time}`);
    if (currentPlayerStatus === 2) {
      this.registerCodeEvent("pauseScrub", time);
    } else {
      this.registerCodeEvent("onStateChange", 1);
    }
    this.player.seekTo(time);
  }
  changePlaybackRate(rate: number) {
    this.registerCodeEvent("onPlaybackRateChange", rate);
    this.player.setPlaybackRate(rate);
  }

  // Interval for checking of play head moved while paused
  // (necessary since no events fire while player is paused)
  prevTime: number;
  prevPlayerState: number;

  checkForPauseScrub() {
    const currentTime = this.player.getCurrentTime();
    const currentPlayerState = this.player.getPlayerState();

    if (
      currentPlayerState === 2 &&
      this.prevPlayerState !== 1 &&
      currentTime !== this.prevTime
    ) {
      this.dispatchUserEvent("pauseScrub", currentTime);
    }

    this.prevTime = currentTime;
    this.prevPlayerState = currentPlayerState;
  }

  // Event Handlers
  handleRawEvent(type: string, data: any) {
    // uhhhhh lol
    if (type === "onStateChange" && !(data === 1 || data === 2)) return;
    if (this.isUserEvent(type, data)) this.dispatchUserEvent(type, data);
  }
  handleRawStateChange(e: { data: number }) {
    if (!(e.data === 1 || e.data === 2)) return;
  }
  dispatchUserEvent(type: string, data: any) {
    if (this.userEventHandlers[type]) this.userEventHandlers[type](data);
  }

  videoChanges: number;
  loadVideo(id: string) {
    if (this.videoChanges++ === 0) return;
    this.player.loadVideoById({
      videoId: id,
    });
  }
}
