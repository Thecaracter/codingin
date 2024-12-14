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

async function deleteFromCloudinary(imageUrl: string) {
    try {
        const publicId = `portfolio/${imageUrl.split('/').pop()?.split('.')[0]}`;
        await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error('Error deleting from Cloudinary:', error);
    }
}

async function verifyToken(req: NextRequest) {
    const authHeader = req.headers.get('authorization');
    if (!authHeader?.startsWith('Bearer ')) {
        return null;
    }

    try {
        const token = authHeader.split(' ')[1];
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
            where: { id: decoded.userId }
        });

        if (!user || user.role !== 'ADMIN' || !decoded.isMobile) {
            return null;
        }

        return user;
    } catch {
        return null;
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
        console.error("Error:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT - Update portfolio
export async function PUT(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(req);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { nama, deskripsi, techStack, link, image } = body;

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
        console.error("Error:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE - Delete portfolio
export async function DELETE(
    req: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const user = await verifyToken(req);
        if (!user) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
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
        console.error("Error:", error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// OPTIONS - Handle CORS
export async function OPTIONS(req: NextRequest) {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
    });
}