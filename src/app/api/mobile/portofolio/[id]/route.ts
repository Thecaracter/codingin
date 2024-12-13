import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { v2 as cloudinary } from "cloudinary";

// Konfigurasi Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Fungsi untuk upload ke Cloudinary
async function uploadToCloudinary(base64File: string) {
    try {
        const result = await cloudinary.uploader.upload(base64File, {
            folder: 'portfolio',
            resource_type: 'auto'
        });
        return result.secure_url;
    } catch (error) {
        console.error('Error uploading to Cloudinary:', error);
        throw error;
    }
}

// Fungsi untuk delete dari Cloudinary
async function deleteFromCloudinary(imageUrl: string) {
    try {
        const publicId = imageUrl.split('/').pop()?.split('.')[0];
        if (publicId) {
            await cloudinary.uploader.destroy(`portfolio/${publicId}`);
        }
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
        throw error;
    }
}

// GET - Fetch single portfolio
export async function GET(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const portfolio = await prisma.portofolio.findUnique({
            where: { id: parseInt(params.id) }
        });

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Portfolio tidak ditemukan' },
                { status: 404 }
            );
        }

        return NextResponse.json(portfolio);
    } catch (error) {
        console.error("Error in GET /api/mobile/portofolio/[id]:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// PUT - Update portfolio
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only admin can manage portfolio' },
                { status: 403 }
            );
        }

        const body = await req.json();
        const { nama, deskripsi, techStack, link, image } = body;

        // Validasi input
        if (!nama || !deskripsi || !techStack || !link) {
            return NextResponse.json(
                { error: 'Data tidak lengkap' },
                { status: 400 }
            );
        }

        const existingPortfolio = await prisma.portofolio.findUnique({
            where: { id: parseInt(params.id) }
        });

        if (!existingPortfolio) {
            return NextResponse.json(
                { error: 'Portfolio tidak ditemukan' },
                { status: 404 }
            );
        }

        let imageUrl = existingPortfolio.image;
        if (image) {
            await deleteFromCloudinary(existingPortfolio.image);
            imageUrl = await uploadToCloudinary(image);
        }

        const portfolio = await prisma.portofolio.update({
            where: { id: parseInt(params.id) },
            data: {
                nama,
                deskripsi,
                techStack,
                link,
                image: imageUrl,
            }
        });

        return NextResponse.json({
            message: 'Portfolio berhasil diupdate',
            data: portfolio
        });
    } catch (error) {
        console.error("Error in PUT /api/mobile/portofolio/[id]:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// DELETE - Delete portfolio
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
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

        if (!user || user.role !== 'ADMIN') {
            return NextResponse.json(
                { error: 'Only admin can manage portfolio' },
                { status: 403 }
            );
        }

        const portfolio = await prisma.portofolio.findUnique({
            where: { id: parseInt(params.id) }
        });

        if (!portfolio) {
            return NextResponse.json(
                { error: 'Portfolio tidak ditemukan' },
                { status: 404 }
            );
        }

        await deleteFromCloudinary(portfolio.image);

        await prisma.portofolio.delete({
            where: { id: parseInt(params.id) }
        });

        return NextResponse.json({
            message: 'Portfolio berhasil dihapus'
        });
    } catch (error) {
        console.error("Error in DELETE /api/mobile/portofolio/[id]:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}