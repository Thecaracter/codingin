// app/api/mobile/portfolio/route.ts
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";
import jwt from 'jsonwebtoken';

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

export async function GET() {
    try {
        const portfolios = await prisma.portofolio.findMany({
            orderBy: { createdAt: 'desc' }
        });
        return NextResponse.json(portfolios);
    } catch (error) {
        console.error("Error:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

export async function POST(req: NextRequest) {
    try {
        const authHeader = req.headers.get('authorization');
        const token = authHeader?.split(' ')[1];

        if (!token) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || ''
        ) as {
            userId: number;
            email: string;
            role: string;
            isMobile: boolean;
        };

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
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
        }, { status: 201 });

    } catch (error) {
        console.error("Error:", error);
        if (error instanceof jwt.JsonWebTokenError) {
            return NextResponse.json(
                { error: 'Invalid token' },
                { status: 401 }
            );
        }
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}