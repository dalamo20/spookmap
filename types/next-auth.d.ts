import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    id: string;
    email: string;
    username?: string; 
    name?: string; 
    image?: string;
  }

  interface Session {
    user: {
      id: string;
      email: string;
      username?: string;
      name?: string;
    };
  }

  interface JWT {
    id: string;
    email: string;
    username?: string;
    name?: string;
  }
}
