import prisma from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(request: Request, { params }: { params: { id: string } }) {
    try {
        const pesanan = await prisma.pesanan.findUnique({
            where: { id: Number(params.id) }
        })
        if (!pesanan) {
            return NextResponse.json({
                status: 404,
                message: 'Data tidak ditemukan'
            }, { status: 404 })
        }
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

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
    try {
        const body = await request.json()
        const pesanan = await prisma.pesanan.update({
            where: { id: Number(params.id) },
            data: body
        })
        return NextResponse.json({
            status: 200,
            message: 'Berhasil mengubah data',
            data: pesanan
        })
    } catch (error) {
        return NextResponse.json({
            status: 400,
            message: 'Gagal mengubah data',
            error: (error as any).message
        }, { status: 400 })
    }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.pesanan.delete({
            where: { id: Number(params.id) }
        })
        return NextResponse.json({
            status: 200,
            message: 'Berhasil menghapus data'
        })
    } catch (error) {
        return NextResponse.json({
            status: 400,
            message: 'Gagal menghapus data',
            error: (error as any).message
        }, { status: 400 })
    }
}