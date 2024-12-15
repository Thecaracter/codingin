import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const errorResponse = (message: string, status: number) => {
    return NextResponse.json(
        { success: false, error: message },
        { status }
    );
};

const successResponse = (data: any, message: string, status: number) => {
    return NextResponse.json(
        {
            success: true,
            message,
            data
        },
        { status }
    );
};

export async function GET() {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return errorResponse("Server configuration error", 500);
        }

        const portfolios = await prisma.portofolio.findMany({
            orderBy: { createdAt: 'desc' }
        });

        if (!portfolios.length) {
            return successResponse([], "No portfolios found", 200);
        }

        return successResponse(portfolios, "Portfolios retrieved successfully", 200);
    } catch (error) {
        console.error("Error in GET /api/mobile/portofolio:", error);
        return errorResponse("Internal server error", 500);
    }
}

export async function POST(req: NextRequest) {
    try {
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            return errorResponse("Server configuration error", 500);
        }

        const formData = await req.formData();
        const nama = formData.get('nama')?.toString() || '';
        const deskripsi = formData.get('deskripsi')?.toString() || '';
        const techStackString = formData.get('techStack')?.toString() || '';
        const link = formData.get('link')?.toString() || '';
        const file = formData.get('image') as File;

        if (!nama.trim()) {
            return errorResponse("Nama is required", 400);
        }

        if (!deskripsi.trim()) {
            return errorResponse("Deskripsi is required", 400);
        }

        if (!techStackString.trim()) {
            return errorResponse("TechStack is required", 400);
        }

        if (!link.trim()) {
            return errorResponse("Link is required", 400);
        }

        if (!file) {
            return errorResponse("Image is required", 400);
        }

        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedTypes.includes(file.type)) {
            return errorResponse("Invalid file type. Only JPEG, PNG, WEBP, and GIF are allowed", 400);
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            return errorResponse("File size too large. Maximum size is 5MB", 400);
        }

        const techStack = Array.from(new Set(techStackString.split(',').map(tech => tech.trim()).filter(tech => tech.length > 0)));

        if (techStack.length === 0) {
            return errorResponse("At least one technology must be specified", 400);
        }

        try {
            new URL(link);
        } catch (e) {
            return errorResponse("Invalid URL format", 400);
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        try {
            const result = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream(
                    {
                        folder: 'portfolio',
                        resource_type: 'auto',
                        allowed_formats: ['jpg', 'png', 'gif', 'webp'],
                        max_bytes: maxSize
                    },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                ).end(buffer);
            });

            const portfolio = await prisma.portofolio.create({
                data: {
                    nama,
                    deskripsi,
                    techStack,
                    link,
                    image: (result as any).secure_url,
                }
            });

            return successResponse(portfolio, "Portfolio berhasil ditambahkan", 201);

        } catch (cloudinaryError) {
            console.error("Cloudinary upload error:", cloudinaryError);
            return errorResponse("Error uploading image", 500);
        }

    } catch (error) {
        console.error("Error in POST /api/mobile/portofolio:", error);
        if ((error as any).code === 'P2002') {
            return errorResponse("A portfolio with this name already exists", 409);
        }
        return errorResponse("Internal server error", 500);
    }
}