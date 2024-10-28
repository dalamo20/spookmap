import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from 'bcrypt';
import { db } from '@/app/firebaseConfig';
import { collection, doc, getDoc, setDoc, query, where, getDocs } from "firebase/firestore";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials as { email: string, password: string };
        
        // Get user from Firestore
        const userDocRef = doc(db, "users", email);
        const userDoc = await getDoc(userDocRef);
        if (!userDoc.exists()) {
          throw new Error("No user found with this email");
        }

        const userData = userDoc.data();
        const isValidPassword = await bcrypt.compare(password, userData.password);
        if (!isValidPassword) {
          throw new Error("Invalid password");
        }

        return { id: userDoc.id, email: userData.email, username: userData.username };
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",  
    error: "/auth/error",  
    newUser: "/auth/register" 
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account && account.provider === 'google') {
        // console.log("Received user object:", user);
    
        try {
          const newUserRef = doc(db, "users", user.email);
          // console.log("Creating user in Firestore with email:", user.email);
          
          await setDoc(newUserRef, {
            email: user.email,
            username: user.name || "Unknown",
            createdAt: new Date(),
          });
    
          console.log("User created successfully.");
        } catch (err: any) {
          console.error("Error creating user document in Firestore:", err.message);
          return false;
        }
      }
      return true;
    },
    async jwt({ token, account }) {
      if (account) {
        token.email_verified = account.email_verified; 
        // console.log("JWT token claims after Google Sign-In: ", token);
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        // Fetch users doc using email
        const userDocRef = doc(db, "users", session.user.email);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          // Username in session obj
          session.user.username = userData.username || null;
        } else {
          console.warn(`User document not found for email: ${session.user.email}`);
        }
        session.user.email_verified = token.email_verified;
      }
      return session;
    }
  }   
}  
