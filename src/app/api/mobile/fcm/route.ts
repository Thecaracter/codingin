import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';

const SECRET = process.env.NEXTAUTH_SECRET || '';

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
        where: { id: decoded.userId }
    });

    if (!user) {
        throw new Error('User not found');
    }

    return { decoded, user };
}

export async function POST(req: NextRequest) {
    try {
        const { decoded } = await verifyToken(req.headers.get('authorization'));
        const { fcmToken } = await req.json();

        if (!fcmToken) {
            return NextResponse.json(
                { error: 'FCM Token diperlukan' },
                { status: 400 }
            );
        }

        const updatedUser = await prisma.user.update({
            where: { id: decoded.userId },
            data: { fcmToken }
        });

        return NextResponse.json({
            message: 'FCM Token berhasil diupdate',
            data: { user: updatedUser }
        });

    } catch (error) {
        console.error("Error updating FCM token:", error);
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
        console.error("Error deleting FCM token:", error);
        return NextResponse.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: error instanceof Error && error.message === 'Token tidak valid' ? 401 : 500 }
        );
    }
}