'use client'
import { usePathname } from 'next/navigation'

export default function AuthTemplate({
    children,
}: {
    children: React.ReactNode
}) {
    return <>{children}</>
}