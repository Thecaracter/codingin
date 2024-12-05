import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';

// Gunakan langsung NEXTAUTH_SECRET
const SECRET = process.env.NEXTAUTH_SECRET || '';

export async function POST(req: NextRequest) {
    try {
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email diperlukan' },
                { status: 400 }
            );
        }

        // Cek apakah user adalah admin
        const user = await prisma.user.findFirst({
            where: {
                email: email,
                role: 'ADMIN',
            },
        });

        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized: Hanya admin yang bisa mengakses aplikasi mobile' },
                { status: 403 }
            );
        }

        // Generate mobile token dengan NEXTAUTH_SECRET
        const mobileToken = jwt.sign(
            {
                userId: user.id,
                email: user.email,
                role: user.role,
                isMobile: true
            },
            SECRET,
            { expiresIn: '30d' }
        );

        return NextResponse.json({
            message: 'Login berhasil',
            data: {
                token: mobileToken,
                user: {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    image: user.image
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

export async function GET(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        if (!authHeader?.startsWith('Bearer ')) {
            return NextResponse.json(
                { error: 'Token tidak valid' },
                { status: 401 }
            );
        }

        const token = authHeader.split(' ')[1];
        try {
            const decoded = jwt.verify(token, SECRET) as {
                userId: number;
                email: string;
                role: string;
                isMobile: boolean;
            };

            if (!decoded.isMobile || decoded.role !== 'ADMIN') {
                throw new Error('Invalid token');
            }

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    image: true,
                    fcmToken: true
                }
            });

            if (!user) {
                throw new Error('User not found');
            }

            return NextResponse.json({
                message: 'Token valid',
                data: { user }
            });

        } catch (error) {
            return NextResponse.json(
                { error: 'Token tidak valid' },
                { status: 401 }
            );
        }
    } catch (error) {
        console.error("Error verifying token:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}