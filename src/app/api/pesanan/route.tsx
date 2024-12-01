import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth"

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        const body = await req.json();
        const {
            nama,
            namaAplikasi,
            keperluan,
            teknologi,
            fitur,
            deadline,
            akunTiktok
        } = body;
        if (!nama || !namaAplikasi || !keperluan || !teknologi || !fitur || !deadline || !akunTiktok) {
            return NextResponse.json(
                { error: 'Data tidak lengkap' },
                { status: 400 }
            );
        }
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const pesanan = await prisma.pesanan.create({
            data: {
                userId: user.id,
                nama,
                namaAplikasi,
                keperluan,
                teknologi,
                fitur,
                deadline: new Date(deadline),
                akunTiktok,
                status: 'PENDING'
            }
        });

        return NextResponse.json(pesanan);
    } catch (error) {
        console.error("Error in POST /api/pesanan:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function GET(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }
        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }
        const pesanan = await prisma.pesanan.findMany({
            where: { userId: user.id },
            orderBy: { createdAt: 'desc' }
        });

        return NextResponse.json(pesanan);
    } catch (error) {
        console.error("Error in GET /api/pesanan:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}