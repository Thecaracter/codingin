
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
            );
        }


        if (user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized access' },
                { status: 403 }
            );
        }

        const token = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                isMobile: true
            },
            process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || '',
            {
                expiresIn: '30d',
            }
        );

        return NextResponse.json({
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    role: user.role
                }
            }
        });
    } catch (error) {
        console.error("Error in mobile auth:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}