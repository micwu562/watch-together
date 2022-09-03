<script lang="ts">
  import { setDBVideoURL, updateDBPlayerState } from "./database/databaseOps";
  import { parseURL, setVideoURL } from "./database/setVideoUrl";

  let urlInput = "";

  const loadYTVideo = () => {
    setDBVideoURL(parseURL(urlInput));
    updateDBPlayerState({
      playState: 2,
      videoTime: 0,
      videoURL: urlInput,
    });
    urlInput = "";
  };
</script>

<div class="menubar">
  <i class="bx bx-link linkIcon" />
  <input
    class="urlInput"
    bind:value={urlInput}
    placeholder="enter url or id here"
  />
  <button on:click={loadYTVideo} style="margin-right: 5px;">Play</button>
  <button on:click={loadYTVideo} style="margin-right: 0px;">Queue</button>
  <!-- <button on:click={() => {}}>Search</button> -->
</div>

<style>
  .linkIcon {
    color: #777;
    margin-top: 2px;
  }

  .menubar {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
  }

  .urlInput {
    transition: border-color 0.1s;

    color: #777;
    outline: none;

    text-align: left;

    padding: 2px 5px;
    width: 400px;
    margin-right: 10px;
  }
  .urlInput:focus {
    border-color: #777;
  }
</style>
