import { database } from "./firebase";
import { ref, set, onValue, DataSnapshot, get } from "firebase/database";

// refs
const playerStateRef = ref(database, "playerState");
const videoURLRef = ref(database, "videoURL");

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
