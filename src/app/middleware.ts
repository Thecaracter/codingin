import { withAuth, type NextAuthMiddlewareOptions } from "next-auth/middleware"
import { NextResponse } from 'next/server'
import type { NextRequestWithAuth } from 'next-auth/middleware'

export default withAuth(
    async function middleware(request: NextRequestWithAuth) {
        const path = request.nextUrl.pathname
        const token = request.nextauth.token


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
    matcher: ['/dashboard/:path*', '/auth/:path*', '/pesanan/:path*']
}