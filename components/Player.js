import { 
    HeartIcon,
    VolumeUpIcon as VolumeDownIcon,
} from "@heroicons/react/outline";

import{
    FastForwardIcon,
    PauseIcon,
    PlayIcon,
    ReplyIcon,
    RewindIcon,
    VolumeUpIcon,
    SwitchHorizontalIcon,
} from "@heroicons/react/solid";


import { debounce } from "lodash";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { currentTrackIdState, isPlayingState } from "../atoms/SongAtom";
import useSongInfo from "../hooks/useSongInfo";
import useSpotify from "../hooks/useSpotify"



function Player() {
    const SpotifyAPI = useSpotify();
    const{ data: session, status} = useSession();
    const [currentTrackId, setCurrentIdTrack] = 
        useRecoilState(currentTrackIdState);
    const[isPlaying, setIsPlaying] = useRecoilState(isPlayingState);
    const [volume, setVolume] = useState(50);

    //custom hook
    //has info about currently seclected song
    const songInfo = useSongInfo();


    const fetchCurrentSong = () => {
        if(!songInfo) {
            //got current playing track and set it as currentIdTrack
            SpotifyAPI.getMyCurrentPlayingTrack().then((data) => {
                console.log("Now Playing: ", data.body?.item);
                setCurrentIdTrack(data.body?.item?.id);

                //adjusted isPlaying by calling to get current playback state
                //true or false
                SpotifyAPI.getMyCurrentPlaybackState().then((data) => {
                    setIsPlaying(data.body?.is_playing);
                });
            });
        }
    }

    const handlePlayPause = () => {
        SpotifyAPI.getMyCurrentPlaybackState().then((data) => {
            if(data.body.is_playing){
                SpotifyAPI.pause();
                //set global car
                setIsPlaying(false);
            } else {
                SpotifyAPI.play();
                setIsPlaying(true);
            }
        }); 
    };

    useEffect(() => {
        if(SpotifyAPI.getAccessToken() && !currentTrackId){
            //fetch song indo
            fetchCurrentSong();
            setVolume(50);
        }
        //arr of dependencies
    }, [currentTrackId, SpotifyAPI, session])


    useEffect(() => {
        if(volume > 0 && volume < 100){
            debouncedAdjustVolume(volume);
        }
    }, [volume]);


    const debouncedAdjustVolume = useCallback(
        // this is reg use effect
        debounce((volume) => {
            SpotifyAPI.setVolume(volume).catch((err) => {});
        }, 300), //debounce after 500 ms
        []
    );

    return (
        <div className="h-24 bg-gradient-to-b from-black to-green-900
        text-white grid grid-cols-3 text-xs md:text-base px-2 md:px-8">
            {/* Left */}
            <div className="flex items-center space-x-4">
                <img 
                className="hidden md:inline h-10 w-10" 
                src={songInfo?.album.images?.[0]?.url} 
                alt="" /
                >
                
                <div>
                    <h3>{songInfo?.name}</h3>
                    <p>{songInfo?.artists?.[0]?.name}</p>
                </div>
            </div>
            
            {/* Center */}
            <div className="flex items-center justify-evenly">
                {/* added "button" to globals.css and edited css there */}
                <SwitchHorizontalIcon className="button"/>
                <RewindIcon 
                onClick={() => SpotifyAPI.skipToPrevious()}
                className="button"/>
                
                {isPlaying ? (
                    //made button bigger
                    <PauseIcon onClick={handlePlayPause} className="button w-10 h-10" />
                ): (
                    <PlayIcon onClick={handlePlayPause} className="button w-10 h-10"/>
                )}

                <FastForwardIcon className="button"/>

                <ReplyIcon className="button"/>

            </div>

            {/* Right */}
            <div className="flex items-center space-x-3 md:space-x-4 justify-end
            pr-5">
                {/* onclick changes volume by 10 */}
                <VolumeDownIcon 
                onClick={() => volume > 0 &&  setVolume(volume-10)} 
                className="button"/>
                
                <input 
                className="slider" 
                type="range"
                value={volume}
                //with sliders requests can get excessive
                //use a debounce, it will use a wait for a certain amt 
                //of seconds and then only use ONE request (useCallback)
                onChange={(e) => setVolume(Number(e.target.value))}
                min={0} 
                max={100} />

                <VolumeUpIcon 
                onClick={() => volume < 100 &&  setVolume(volume+10)} 
                className="button"/>
            </div>

        </div>
    )
}

export default Player
