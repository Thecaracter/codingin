import { AuthOptions, Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID ?? "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
        }),
        GithubProvider({
            clientId: process.env.GITHUB_ID ?? "",
            clientSecret: process.env.GITHUB_SECRET ?? "",
        }),
    ],
    callbacks: {
        async signIn({ user, account, profile }) {
            if (!user.email) return false;

            try {
                const existingUser = await prisma.user.findUnique({
                    where: { email: user.email },
                });

                if (!existingUser) {
                    await prisma.user.create({
                        data: {
                            email: user.email,
                            name: user.name || 'Anonymous',
                            image: user.image,
                            role: 'USER',
                        },
                    });
                }

                return true;
            } catch (error) {
                console.error("Error in signIn callback:", error);
                return false;
            }
        },
        async session({ session, token }: { session: Session; token: JWT }) {
            if (session.user) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: session.user.email! },
                    select: { id: true, role: true },
                });

                if (dbUser) {
                    session.user.id = dbUser.id.toString();
                    session.user.role = dbUser.role;
                }
            }
            return session;
        },
        async jwt({ token }: { token: JWT }) {
            if (token.email) {
                const dbUser = await prisma.user.findUnique({
                    where: { email: token.email },
                    select: { id: true, role: true },
                });

                if (dbUser) {
                    token.id = dbUser.id.toString();
                    token.role = dbUser.role;
                }
            }
            return token;
        }
    },
    pages: {
        signIn: '/auth/login',
    },
    session: {
        strategy: 'jwt',
    },
};