import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET() {
    try {
        const pesanan = await prisma.pesanan.findMany(
            {
                orderBy: { createdAt: 'desc' },
            }
        )
        return NextResponse.json({
            status: 200,
            message: 'Berhasil mengambil data',
            data: pesanan
        })
    } catch (error) {
        return NextResponse.json({
            status: 500,
            message: 'Gagal mengambil data',
            error: (error as any).message
        }, { status: 500 })
    }
}

export async function POST(request: Request) {
    try {
        const body = await request.json()
        const pesanan = await prisma.pesanan.create({ data: body })
        return NextResponse.json({
            status: 201,
            message: 'Berhasil menambahkan data',
            data: pesanan
        }, { status: 201 })
    } catch (error) {
        return NextResponse.json({
            status: 400,
            message: 'Gagal menambahkan data',
            error: (error as any).message
        }, { status: 400 })
    }
}