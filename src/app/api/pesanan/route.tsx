// src/app/api/pesanan/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

async function uploadToCloudinary(base64File: string, folder: string) {
    try {
        const result = await cloudinary.uploader.upload(base64File, {
            folder: `pesanan/${folder}`,
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

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

export async function PATCH(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.email) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        console.log('Received request body:', body); // Debug log

        const { pesananId, jenisBukti, bukti } = body;

        if (!pesananId || !jenisBukti || !bukti) {
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

        const pesanan = await prisma.pesanan.findFirst({
            where: {
                id: parseInt(pesananId.toString()),
                userId: user.id
            }
        });

        if (!pesanan) {
            return NextResponse.json({ error: 'Pesanan tidak ditemukan' }, { status: 404 });
        }

        // Cek status berdasarkan jenis bukti
        if (jenisBukti === 'buktiDP') {
            if (pesanan.status !== 'PENDING') {
                return NextResponse.json(
                    { error: 'Bukti DP hanya bisa diupload saat status PENDING' },
                    { status: 400 }
                );
            }
        } else if (jenisBukti === 'buktiPelunasan') {
            if (pesanan.status !== 'SELESAI') {
                return NextResponse.json(
                    { error: 'Bukti pelunasan hanya bisa diupload saat status SELESAI' },
                    { status: 400 }
                );
            }
            if (!pesanan.buktiDP) {
                return NextResponse.json(
                    { error: 'Harap upload bukti DP terlebih dahulu' },
                    { status: 400 }
                );
            }
        }

        console.log('Uploading to Cloudinary...'); // Debug log
        const buktiUrl = await uploadToCloudinary(
            bukti,
            jenisBukti === 'buktiDP' ? 'dp' : 'pelunasan'
        );

        console.log('Upload successful, updating database...'); // Debug log

        // Update pesanan dengan bukti dan status baru jika perlu
        const updateData: any = {
            [jenisBukti]: buktiUrl
        };

        // Update status ke PROSES jika yang diupload adalah buktiDP
        if (jenisBukti === 'buktiDP') {
            updateData.status = 'PROSES';
        }

        const updatedPesanan = await prisma.pesanan.update({
            where: { id: parseInt(pesananId.toString()) },
            data: updateData
        });

        console.log('Database updated successfully'); 

        return NextResponse.json({
            message: `Berhasil mengupload ${jenisBukti === 'buktiDP' ? 'bukti DP' : 'bukti pelunasan'}`,
            data: updatedPesanan
        });

    } catch (error) {
        console.error("Error in PATCH /api/pesanan:", error);
        return NextResponse.json({
            error: 'Internal server error: ' + (error as Error).message
        }, { status: 500 });
    }
}