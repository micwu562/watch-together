<script lang="ts" context="module">
  // fuck yt types
  declare global {
    var YT: any;
  }
</script>

<script lang="ts">
  import { currentVideoURL } from "./clientData";

  import { getDBVideoURL } from "./database/databaseOps";

  export let player: object = {};
  export let playerInitialized = () => {};

  (window as any).onYouTubeIframeAPIReady = async () => {
    // get video URL
    let videoURL = await getDBVideoURL();
    // even though we know the url, set it to "" so that onValue reloads video.
    currentVideoURL.set(videoURL);

    player = new YT.Player("player", {
      height: "585",
      width: "960",
      videoId: videoURL,
      playerVars: {
        playsinline: 1,
        modestbranding: 1,
      },
      events: {
        onReady: playerInitialized,
      },
    });
  };
</script>

<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div id="player" />
