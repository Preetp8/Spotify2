import NextAuth from "next-auth"
import SpotifyProvider from "next-auth/providers/spotify"
import SpotifyAPI, { LOGIN_URL } from "../../../lib/spotify"

async function refreshAccessToken(token) {
    try {
        
        SpotifyAPI.setAccessToken(token.accessToken);
        SpotifyAPI.setRefreshToken(token.setRefreshToken);

        //breakdown renaming body that comes from it to refreshed token
        const{body:refreshedToken} = await SpotifyAPI.refreshAccessToken();

        console.log("REFRESH TOKEN IS", refreshedToken);

        return{
            ...token,
            accessToken: refreshedToken.access_token,
            accessTokenExpires: Date.now + refreshedToken.expires_in * 1000, //reps 1hr bc 3600 returns from spotify
            //if token came back use it unless use another one
            refreshToken: refreshedToken.refresh_token ?? token.refreshToken,


        }

    } catch (error) {
        console.error(error)

        return {
            ...token,
            error: 'RefreshAccessTokenError',
        }
    }
}

export default NextAuth({
  // Configure one or more authentication providers
  providers: [
    SpotifyProvider({
      clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
      clientSecret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      authorization: LOGIN_URL,
    }),
    // ...add more providers here
  ],
  secret: process.env.JWT_SECRET,
  pages:{
      signIn: '/login'
  },
  callbacks:{
      async jwt({token, account, user}){
          //initial sign in
          if (account && user){
              return{
                  ...token,
                  accessToken: account.access_token,
                  refreshToken: account.refresh_token,
                  username: account.providerAccountId,
                  //checks if token is expired
                  accessTokenExpires: account.expires_at * 1000, 
                  //handling expiry in ms (hence * 1000)
              }
          }

          //return previous token if access token hasnt expired
          if(Date.now() < token.accessTokenExpires){
              console.log("EXISTING ACCESS TOKEN IS VALID");
              return token;
          }

          //access token expired then update it
          console.log("ACCESS TOKEN ENCPIRED REFRESHING....");
          return await refreshAccessToken(token)
      },

      async session({session, token}) {
          session.user.accessToken = token.accessToken;
          session.user.refreshToken = token.refreshToken;
          session.user.username = token.username;

          return session;
      }

  },
}); 