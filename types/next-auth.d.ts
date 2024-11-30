// src/types/next-auth.d.ts
import { DefaultSession } from "next-auth";
import { Role } from "@prisma/client";

declare module "next-auth" {
    interface Session {
        user: {
            id: number;
            role: Role;
        } & DefaultSession["user"]
    }

    interface User {
        id: number;
        role: Role;
    }
}

declare module "next-auth/jwt" {
    interface JWT {
        id?: number;
        role?: Role;
    }
}