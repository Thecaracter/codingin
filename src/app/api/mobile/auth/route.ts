import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || '';

// Helper function untuk verifikasi token
async function verifyToken(authHeader: string | null) {
    if (!authHeader?.startsWith('Bearer ')) {
        throw new Error('Token tidak valid');
    }

    const token = authHeader.split(' ')[1];
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

    return { decoded, user };
}

export async function POST(req: NextRequest) {
    try {
        // Cek path untuk membedakan login dan fcm update
        const url = new URL(req.url);
        const isFcmUpdate = url.pathname.endsWith('/fcm');

        if (isFcmUpdate) {
            const { decoded, user } = await verifyToken(req.headers.get('authorization'));
            const { fcmToken } = await req.json();

            if (!fcmToken) {
                return NextResponse.json(
                    { error: 'FCM Token diperlukan' },
                    { status: 400 }
                );
            }

            const updatedUser = await prisma.user.update({
                where: { id: decoded.userId },
                data: { fcmToken },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    image: true,
                    fcmToken: true
                }
            });

            return NextResponse.json({
                message: 'FCM Token berhasil diupdate',
                data: { user: updatedUser }
            });
        }

        // Handle login
        const { email } = await req.json();

        if (!email) {
            return NextResponse.json(
                { error: 'Email diperlukan' },
                { status: 400 }
            );
        }

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
        console.error("Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: error instanceof Error && error.message === 'Token tidak valid' ? 401 : 500 }
        );
    }
}

export async function GET(req: NextRequest) {
    try {
        const { user } = await verifyToken(req.headers.get('authorization'));

        return NextResponse.json({
            message: 'Token valid',
            data: { user }
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: error instanceof Error && error.message === 'Token tidak valid' ? 401 : 500 }
        );
    }
}

export async function DELETE(req: NextRequest) {
    try {
        const { decoded } = await verifyToken(req.headers.get('authorization'));

        await prisma.user.update({
            where: { id: decoded.userId },
            data: { fcmToken: null }
        });

        return NextResponse.json({
            message: 'FCM Token berhasil dihapus'
        });

    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: error instanceof Error && error.message === 'Token tidak valid' ? 401 : 500 }
        );
    }
}