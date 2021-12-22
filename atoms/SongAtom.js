import { atom } from "recoil"

// this tells you what track ID you have select
export const currentTrackIdState = atom({
    key: "currentTrackIdState",
    default: null,
});


//if playing true not then false
export const isPlayingState = atom({
    key: "isPlayingState",
    default: false,

});