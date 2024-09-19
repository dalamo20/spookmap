import { authOptions } from "@/lib/authOptions";
import NextAuth from "next-auth";
import GoogleProvider from 'next-auth/providers/google';


const handler = NextAuth(authOptions);

export async function POST(request: Request) {
    try { 
        const { email, password } = await request.json();
        console.log({email, password});
    } catch(error: any){
        console.log(error.messsage);
    }
}