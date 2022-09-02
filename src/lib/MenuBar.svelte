<script lang="ts">
  import { get } from "svelte/store";
  import { tick } from "svelte";
  import { clientID } from "./clientData";

  import { setDBVideoURL, setDBPlayerState } from "./database/databaseOps";
  export let player;

  let urlInput = "";

  let html = "";
  const handleInputChange = async (e) => {
    const plainText = e.target.textContent;
    html = plainText;
  };

  const loadYTVideo = () => {
    setDBVideoURL(html);
    setDBPlayerState({
      playState: 2,
      videoTime: 0,
      realTime: new Date().getTime(),
      playbackRate: player.getPlaybackRate(),
      lastActionBy: get(clientID),
    });
  };
</script>

<div class="menubar">
  <i class="bx bx-link linkIcon" />
  <div
    class="urlInput"
    contenteditable="true"
    data-ph="paste link here (this textbox is kinda broken rn)"
    bind:innerHTML={html}
    on:input={handleInputChange}
  />
  <button on:click={loadYTVideo}>Change Video</button>
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
    border: none;
    border-radius: 0;
    border-bottom: 2px solid #555;
    transition: border-color 0.1s;

    color: #777;
    outline: none;

    text-align: left;

    padding: 2px 5px;
    width: 400px;
    margin-right: 10px;
  }
  [contenteditable="true"]:empty:not(:focus):before {
    content: attr(data-ph);
    color: #555;
    font-style: italic;
  }
  .urlInput:focus {
    border-color: #777;
  }
</style>
