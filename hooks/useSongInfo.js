//when fetching a track it gives info in one way 
//when playng trakck it gives info in another way
//this hook takes the ID given from either and gives the song info back

import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState } from "../atoms/SongAtom";
import useSpotify from "./useSpotify";


function useSongInfo() {
    const SpotifyAPI = useSpotify();
    const [currentIdTrack, setCurrentIdTrack] = 
        useRecoilState(currentTrackIdState);
    const [songInfo, setSongInfo] = useState(null);


    //
    useEffect(() => {
        //this is how to run async code INSIDE USEEFFECT (encapsulate it)
        const fetchSongInfo = async() => {
            if (currentIdTrack){
                //how to fetch from frontend
                const trackInfo = await fetch(
                    //passing in id of track
                    `https://api.spotify.com/v1/tracks/${currentIdTrack}`,
                    //second argument that has the authorization
                    {
                        headers: {
                            //when request made to API access token put inside header
                            //we can pass it around using Bearer (token)
                            //shows spotify that the user can access
                            Authorization: `Bearer ${SpotifyAPI.getAccessToken()}`,
                        }
                    }
                    //then the response is pass it to json
                ).then(res => res.json());

                setSongInfo(trackInfo);
            }
        }
        fetchSongInfo();
        //
    }, [currentIdTrack, SpotifyAPI])

    return songInfo;
}

export default useSongInfo


//3:14:11