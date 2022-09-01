<script lang="ts" context="module">
  // fuck yt types
  declare global {
    var YT: any;
  }
</script>

<script lang="ts">
  export let player: object = {};

  (window as any).onYouTubeIframeAPIReady = () => {
    console.log(typeof YT);
    player = new YT.Player("player", {
      height: "390",
      width: "640",
      videoId: "M7lc1UVf-VE",
      playerVars: {
        playsinline: 1,
      },
      events: {},
    });
  };
</script>

<svelte:head>
  <script src="https://www.youtube.com/iframe_api"></script>
</svelte:head>

<div id="player" />
