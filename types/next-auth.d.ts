import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      image?: string; 
      name?: string;
      email_verified?: boolean | null;
    };
  }

  interface User {
    id: string;
    email: string;
    username?: string;
    image?: string;
    name?: string;
    email_verified?: boolean | null;
  }

  interface JWT {
    id: string;
    email: string;
    username?: string;
    image?: string;
    name?: string;
  }
}
