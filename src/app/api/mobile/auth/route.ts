
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import * as jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.NEXTAUTH_SECRET!;

export async function POST(req: NextRequest) {
    try {
        const { email, provider, accessToken } = await req.json();

        if (!email || !provider) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }


        let isValidToken = false;
        if (process.env.NODE_ENV === 'development') {
            console.log('Development mode: Skipping token verification');
            isValidToken = true;
        } else {
            isValidToken = await verifySocialToken(provider, accessToken);
        }

        if (!isValidToken) {
            return NextResponse.json(
                { error: 'Invalid social token' },
                { status: 401 }
            );
        }

        const user = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                image: true,
            },
        });

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Unauthorized. Admin access only.' },
                { status: 403 }
            );
        }

        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        return NextResponse.json({
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                image: user.image
            }
        });

    } catch (error) {
        console.error('Auth error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    return NextResponse.json({
        message: 'Mobile auth endpoint active',
        providers: ['google', 'github']
    });
}

function verifySocialToken(provider: any, accessToken: any): boolean | PromiseLike<boolean> {
    throw new Error('Function not implemented.');
}
