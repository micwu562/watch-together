import { writable } from "svelte/store";

export let clientID = writable(0);
export let currentVideoURL = writable("");
