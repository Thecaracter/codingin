import { NextRequest, NextResponse } from 'next/server';
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../auth/[...nextauth]/auth";
import { v2 as cloudinary } from 'cloudinary';
import { kirimNotifikasiKeAdmin } from '@/lib/firebase-admin';

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

        // Kirim notifikasi ke admin untuk pesanan baru
        await kirimNotifikasiKeAdmin(
            pesanan,
            "Pesanan Baru",
            `${nama} membuat pesanan baru untuk aplikasi ${namaAplikasi}`,
            {
                type: 'NEW_ORDER',
                orderId: pesanan.id.toString()
            }
        );

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

        const searchParams = new URL(req.url).searchParams;
        const role = searchParams.get('role');

        const user = await prisma.user.findUnique({
            where: { email: session.user.email },
        });
        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        // Jika user adalah admin dan request untuk melihat semua pesanan
        if (role === 'admin' && user.role === 'ADMIN') {
            const pesanan = await prisma.pesanan.findMany({
                include: {
                    user: {
                        select: {
                            name: true,
                            email: true
                        }
                    }
                },
                orderBy: { createdAt: 'desc' }
            });
            return NextResponse.json(pesanan);
        }

        // Jika user biasa, hanya tampilkan pesanan mereka
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
        console.log('Received request body:', body);

        const { pesananId, status, jenisBukti, bukti } = body;

        // Cek jika ini adalah update status dari admin
        if (status) {
            const user = await prisma.user.findUnique({
                where: { email: session.user.email },
            });

            if (!user || user.role !== 'ADMIN') {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
            }

            const updatedPesanan = await prisma.pesanan.update({
                where: { id: parseInt(pesananId.toString()) },
                data: { status }
            });

            // Kirim notifikasi untuk perubahan status
            await kirimNotifikasiKeAdmin(
                updatedPesanan,
                "Status Pesanan Diubah",
                `Status pesanan ${updatedPesanan.namaAplikasi} diubah menjadi ${status}`,
                {
                    type: 'STATUS_CHANGE',
                    orderId: pesananId.toString(),
                    status: status
                }
            );

            return NextResponse.json({
                message: 'Status pesanan berhasil diupdate',
                data: updatedPesanan
            });
        }

        // Proses upload bukti pembayaran
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

        const buktiUrl = await uploadToCloudinary(
            bukti,
            jenisBukti === 'buktiDP' ? 'dp' : 'pelunasan'
        );

        // Update pesanan dengan bukti dan status baru
        const updateData: any = {
            [jenisBukti]: buktiUrl
        };

        if (jenisBukti === 'buktiDP') {
            updateData.status = 'PROSES';
        }

        const updatedPesanan = await prisma.pesanan.update({
            where: { id: parseInt(pesananId.toString()) },
            data: updateData
        });

        // Kirim notifikasi untuk upload bukti pembayaran
        await kirimNotifikasiKeAdmin(
            updatedPesanan,
            jenisBukti === 'buktiDP' ? "Bukti DP Diterima" : "Bukti Pelunasan Diterima",
            `${user.name} telah mengupload ${jenisBukti === 'buktiDP' ? 'bukti DP' : 'bukti pelunasan'} untuk pesanan ${updatedPesanan.namaAplikasi}`,
            {
                type: 'PAYMENT_PROOF',
                orderId: pesananId.toString(),
                jenisBukti: jenisBukti,
                status: updatedPesanan.status
            }
        );

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