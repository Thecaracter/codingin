import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/auth";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

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

// GET - Fetch all portfolios
export async function GET() {
    try {
        const portfolios = await prisma.portofolio.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(portfolios);
    } catch (error) {
        console.error("Error in GET /api/mobile/portofolio:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

// POST - Create new portfolio
export async function POST(req: NextRequest) {
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

        if (!nama || !deskripsi || !techStack || !link || !image) {
            return NextResponse.json(
                { error: 'Data tidak lengkap' },
                { status: 400 }
            );
        }

        const imageUrl = await uploadToCloudinary(image);

        const portfolio = await prisma.portofolio.create({
            data: {
                nama,
                deskripsi,
                techStack,
                link,
                image: imageUrl,
            }
        });

        return NextResponse.json({
            message: 'Portfolio berhasil ditambahkan',
            data: portfolio
        });
    } catch (error) {
        console.error("Error in POST /api/mobile/portofolio:", error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}