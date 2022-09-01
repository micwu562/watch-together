<script lang="ts" context="module">
  // fuck yt types
  declare global {
    var YT: any;
  }
</script>

<script lang="ts">
  export let player: object = {};
  export let playerInitialized = () => {};

  (window as any).onYouTubeIframeAPIReady = () => {
    console.log(typeof YT);
    player = new YT.Player("player", {
      height: "585",
      width: "960",
      videoId: "M7lc1UVf-VE",
      playerVars: {
        playsinline: 1,
      },
      events: {},
    });

    // a bit of a wait
    setTimeout(playerInitialized, 1000);
  };
</script>

<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div id="player" />
