import { ChevronDownIcon } from "@heroicons/react/outline";
import { shuffle } from "lodash";
import { useSession } from "next-auth/react"
import {useEffect, useState} from "react";
import { useRecoilState, useRecoilValue } from "recoil";
import { playlistIdState, playlistState } from "../atoms/playlistAtom";
import useSpotify from "../hooks/useSpotify";
import Songs from "./Songs";
import { signOut } from "next-auth/react";

const colors = [
    "from-indigo-500",
    "from-blue-500",
    "from-green-500",
    "from-orange-500",
    "from-pink-500",
    "from-purple-500",
    "from-red-500",

];


function Center() {
    const{data: session} = useSession();
    const[color, setColor] = useState(null);
    const SpotifyAPI = useSpotify();
    const playlistId = useRecoilValue(playlistIdState);
    const [playlist, setPlaylist] = useRecoilState(playlistState);


    useEffect(() => {
        // shuffle the color array and pop a value off
        setColor(shuffle(colors).pop());
    }, [playlistId])


    useEffect(() => {
        SpotifyAPI.getPlaylist(playlistId)
            .then((data) =>{
                setPlaylist(data.body);
        })
        .catch((err) => console.log("Something went wrong!!!!!", err));
    }, [SpotifyAPI, playlistId])


    // console.log(playlist);


    return (
        // just use flexgrow not flex flexgrow since thatll use minimal space
        <div className="flex-grow h-screen overflow-y-scroll scrollbar-hide">
            {/* moves to top 5 right 8 location  */}
            <header className="absolute top-5 right-8">
                <div className="flex items-center bg-black space-x-3 
                opacity-90 hover:opacity-80 cursor-pointer rounded-full 
                p-1 pr-2 text-white" onClick={signOut}>
                    <img className="rounded-full w-10 h-10" src={session?.user.image} alt="" />
                    <h1>{session?.user.name}</h1>
                    <ChevronDownIcon className="h-5 w-5"/>
                </div>
            </header>

{/* items-end because they are at the baseline */}
            <section 
                className={`flex items-end space-x-7 bg-gradient-to-b 
                to-black ${color} h-80 text-white p-8`}
            >
                <img className="h-44 w-44 shadow-2xl" 
                src={playlist?.images?.[0]?.url} 
                alt="" />

                <div>
                    <p>PLAYLIST</p>
                    <h1 className="text-2xl md:text-3xl xl:text-5xl font-bold">{playlist?.name}</h1>
                </div>

            </section>

            <div>
                <Songs />
            </div>

        </div>
    )
}

export default Center
