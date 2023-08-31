import type { User } from "next-auth";

import type { EnvSchema } from "@/lib/env";

declare global {
  namespace NodeJS {
    interface ProcessEnv extends EnvSchema {}
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: User["id"];
  }
}

declare module "next-auth" {
  interface Session {
    user: User & {
      id: User["id"];
    };
  }
}

declare module "socket.io" {
  interface ServerOptions {
    addTrailingSlash: boolean;
  }
}
