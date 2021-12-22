import {useEffect} from "react";
import {signIn, useSession} from "next-auth/react"
import SpotifyWebApi from "spotify-web-api-node";
// import SpotifyAPI from '../lib/spotify'

//if error w spotifyAPI look at 2:11:15
const SpotifyAPI = new SpotifyWebApi({
    clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
    clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,

})

function useSpotify() {

    const{data: session, status} = useSession();

    useEffect(() => {
        if(session){
            // if refresh access token fails, send user to login page
            if(session.error === 'RefreshAccessTokenError'){
                signIn();
            }

            //Singleton pattern = init spotify object once and reuse it throughout
            //app
            SpotifyAPI.setAccessToken(session.user.accessToken);
        } 
    }, [session])

    return SpotifyAPI;
}

export default useSpotify
