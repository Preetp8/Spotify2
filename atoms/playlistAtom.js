import { atom } from "recoil";

export const playlistState = atom({

    key:  "playlistState",
    default: null,

});


export const playlistIdState = atom({
    // you cant have the same id
    key: "playlistIdState",
    default: '0gkcbTzLDzAb9Qtvkh3EYU',

});