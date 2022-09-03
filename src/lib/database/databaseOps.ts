import { database } from "./firebase";
import {
  ref,
  set,
  onValue,
  DataSnapshot,
  get,
  remove,
  update,
} from "firebase/database";
import { get as getStore } from "svelte/store";
import { clientID } from "../clientData";

// refs
const playerStateRef = ref(database, "playerState");
const videoURLRef = ref(database, "videoURL");
const usersRef = ref(database, "users");

// PLAYER SYNCHRONIZATION
// writing to db
export const setDBPlayerState = (val) => {
  set(playerStateRef, val);
};
export const setDBVideoURL = (val) => {
  set(videoURLRef, val);
};

// subscribing to db
type SnapshotHandler = (snapshot: DataSnapshot) => void;
export const onDBPlayerStateUpdate = (handler: SnapshotHandler) => {
  onValue(playerStateRef, handler);
};
export const onDBVideoURLUpdate = (handler: SnapshotHandler) => {
  onValue(videoURLRef, handler);
};

// getting db value once: used when player is loaded
export const getDBPlayerState = async () => {
  return get(playerStateRef).then((snapshot) => {
    return snapshot.val();
  });
};
export const getDBVideoURL = async () => {
  return get(videoURLRef).then((snapshot) => {
    return snapshot.val();
  });
};

// USER MANAGEMENT
export const addUser = (id: string) => {
  set(ref(database, `users/${id}`), `Sped#${id}`);
};
export const removeUser = (id: string) => {
  set(ref(database, `users/${id}`), null);
};

export const updateDBPlayerState = (state: object) => {
  const updates = Object.fromEntries(
    Object.entries(state).map(([key, val]) => [`/${key}`, val])
  );
  update(playerStateRef, {
    "/realTime": new Date().getTime(),
    "/lastActionBy": getStore(clientID),
    ...updates,
  });
};
