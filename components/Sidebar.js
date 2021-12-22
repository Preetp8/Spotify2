import {
    HomeIcon,
    SearchIcon,
    LibraryIcon,
    PlusCircleIcon,
    HeartIcon,
    RssIcon,
    UsersIcon,
} from "@heroicons/react/solid";
import { signOut, useSession } from "next-auth/react";
import {useEffect, useState} from "react";
import { playlistIdState } from "../atoms/playlistAtom";
import { useRecoilState } from "recoil";
import useSpotify from "../hooks/useSpotify";


function Sidebar() {
    const {data: session, status } = useSession();
    // hook
    const SpotifyAPI = useSpotify();
    const [playlist, setPlaylists] = useState([]);
    const [playlistId, setPlaylistId] = useRecoilState(playlistIdState);

    console.log("You picked playlist>>>>", playlistId);

    useEffect(() => {
        if(SpotifyAPI.getAccessToken()){
            SpotifyAPI.getUserPlaylists().then((data) => {
                setPlaylists(data.body.items);
    
            });
        }
    }, [session, SpotifyAPI])

    // console.log(playlistId);

    console.log(session);
    return (
        <div className="text-gray-500 p-5 text-sm lg:text-sm border-r
        border-gray-900 overflow-y-scroll scrollbar-hide h-screen
        sm:max-w-[12rem] lg:max-w-[15rem] hidden md:inline-flex pb-36">
            <div className="space-y-4">
                {/* home, search, etc */}

                <button className="flex items-center space-x-2
                hover:text-white">
                    <HomeIcon className="h-5 w-5"/>
                    <p>Home</p>
                </button>

                <button className="flex items-center space-x-2
                hover:text-white">
                    <SearchIcon className="h-5 w-5"/>
                    <p>Search</p>
                </button>

                <button className="flex items-center space-x-2
                hover:text-white">
                    <LibraryIcon className="h-5 w-5"/>
                    <p>Your Library</p>
                </button>

                {/* create playlist, liked songs, etc */}
                <hr className="border-t-[0.1px] border-gray-900" />

                <button className="flex items-center space-x-2
                hover:text-white">
                    <PlusCircleIcon className="h-5 w-5"/>
                    <p>Create Playlist</p>
                </button>

                <button className="flex items-center space-x-2
                hover:text-white">
                    <HeartIcon className="h-5 w-5 text-red-500"/>
                    <p>Liked Songs</p>
                </button>

                <button className="flex items-center space-x-2
                hover:text-white">
                    <RssIcon className="h-5 w-5 text-green-500"/>
                    <p>Your Episodes</p>
                </button>

                <hr className="border-t-[0.1px] border-gray-900" />

                {/* Playlists... */}
                {/* using map to make a <p> for each item in playlist
                array
                    remember to use key when mapping */}
                {playlist.map((playlist) => (
                    <p key={playlist.id} 
                    onClick={() => setPlaylistId(playlist.id)} 
                    className="cursor-pointer hover:text-white">

                        {playlist.name}
                        
                    </p>

                ))}
                


            </div>
        </div>
    )
}

export default Sidebar