import { DefaultSession, DefaultUser } from "next-auth";
import { JWT, DefaultJWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      username?: string;
      jobId?: number;
      level?: number;
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    accessToken?: string;
    username?: string;
    jobId?: number;
    level?: number;
  }
}

declare module "next-auth/jwt" {
  interface JWT extends DefaultJWT {
    accessToken?: string;
    username?: string;
    jobId?: number;
    level?: number;
  }
}
