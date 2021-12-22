//checks jwt token at middleware level between server and client
import{getToken} from "next-auth/jwt"
import { NextResponse } from "next/server"

export async function middleware(req) {
    //token will exist if user logged in
    const token = await getToken({ req, secret: process.env.JWT_SECRET});

    const{pathname} = req.nextUrl
    //alow request if following is true
    //1. its a request for next-aut session & provider fetching
    //2. if token exists
    if(pathname.includes('/api/auth') || token){
        return NextResponse.next(); //continue on
    }

    //redirect them to login if they dont have a token and are requesting to a 
    //protected route

    if(!token && pathname !== '/login'){
        return NextResponse.redirect("/login");
    }

}