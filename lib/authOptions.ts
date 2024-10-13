import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from "next-auth/providers/credentials"
import db from '@/app/api/config/route';
import bcrypt from 'bcrypt';

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

              // Select user from db
              const [users]: any = await db.execute('SELECT * FROM users WHERE email = ?', [email]);
              if (users.length === 0) {
                  throw new Error("No user found with this email");
              }

              const user = users[0];
              const isValidPassword = await bcrypt.compare(password, user.password);
              if (!isValidPassword) {
                  throw new Error("Invalid password");
              }
              return { id: user.email, email: user.email, username: user.username };
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
        if (account.provider === 'google') {
          // Check if the user is in users table
          const [existingUser]: any = await db.execute('SELECT * FROM users WHERE email = ?', [user.email]);
          if (existingUser.length === 0) {
            // Insert Google user in users table
            await db.execute('INSERT INTO users (email, username) VALUES (?, ?)', [user.email, user.name]);
          }
        }
        return true;
      },
      async session({ session, token }) {
        session.user.email = token.email;
        session.user.id = token.id;
        session.user.username = token.username || token.name; 
        return session;
      },
      async jwt({ token, user }) {
          if (user) {
            token.email = user.email;
            token.id = user.id;
            token.username = user.username;
            token.name = user.name;
          }
          return token;
      },
  },
};