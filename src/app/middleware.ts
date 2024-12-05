import { withAuth, type NextAuthMiddlewareOptions } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'
import jwt from 'jsonwebtoken'

export default withAuth(
    async function middleware(request: NextRequestWithAuth) {
        const path = request.nextUrl.pathname
        const token = request.nextauth.token

        // Handle mobile API requests
        if (path.startsWith('/api/mobile')) {
            const authHeader = request.headers.get('authorization')

            // Skip check for mobile auth endpoint
            if (path === '/api/mobile/auth') {
                return NextResponse.next()
            }

            if (!authHeader?.startsWith('Bearer ')) {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                )
            }

            try {
                const mobileToken = authHeader.split(' ')[1]
                const decoded = jwt.verify(
                    mobileToken,
                    process.env.JWT_SECRET || process.env.NEXTAUTH_SECRET || ''
                ) as {
                    userId: number
                    role: string
                    isMobile: boolean
                }

                if (!decoded.isMobile || decoded.role !== 'ADMIN') {
                    throw new Error('Invalid token')
                }
                return NextResponse.next()
            } catch {
                return NextResponse.json(
                    { error: 'Unauthorized' },
                    { status: 401 }
                )
            }
        }

        // Handle web routes
        if (path.startsWith('/dashboard') || path.startsWith('/pesanan')) {
            if (!token) {
                return NextResponse.redirect(new URL('/auth/login', request.url))
            }
        }

        if (path.startsWith('/auth') && token) {
            return NextResponse.redirect(new URL('/dashboard', request.url))
        }

        return NextResponse.next()
    },
    {
        callbacks: {
            authorized: ({ token }) => !!token
        }
    } as NextAuthMiddlewareOptions
)

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/auth/:path*',
        '/pesanan/:path*',
        '/api/mobile/:path*'
    ]
}