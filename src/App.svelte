<script lang="ts">
  import svelteLogo from "./assets/svelte.svg";
  import Counter from "./lib/Counter.svelte";
  import YtPlayer from "./lib/YTPlayer.svelte";

  let YTPlayer;
  let YTID;
</script>

<main>
  <YtPlayer bind:player={YTPlayer} />
  <button
    on:click={() => {
      YTPlayer.playVideo();
    }}>click me</button
  >
  <button
    on:click={() => {
      YTPlayer.pauseVideo();
    }}>click me</button
  >
  <input type="text" bind:value={YTID} />
  <button
    on:click={() => {
      YTPlayer.loadVideoById({
        videoId: YTID,
      });
    }}>submit</button
  >

  <p>
    Check out <a href="https://github.com/sveltejs/kit#readme" target="_blank"
      >SvelteKit</a
    >, the official Svelte app framework powered by Vite!
  </p>

  <p class="read-the-docs">Click on the Vite and Svelte logos to learn more</p>
</main>

<style>
  .read-the-docs {
    color: #888;
  }
</style>
