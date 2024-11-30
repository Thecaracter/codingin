'use client';

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { useState, useEffect } from "react";

function getInitials(name: string) {
    return name
        .split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
}

export default function Navbar() {
    const { data: session } = useSession();
    const [showDropdown, setShowDropdown] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (showDropdown) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, [showDropdown]);

    if (!session) {
        return (
            <div className="fixed top-0 right-0 p-4 z-50">
                <Link href="/auth/login">
                    <button className="p-2 rounded-full bg-black/50 hover:bg-black/70 backdrop-blur-sm 
                                     border border-white/20 transition-all duration-300 group">
                        <LogIn className="w-5 h-5 text-white group-hover:text-blue-400 transition-colors" />
                    </button>
                </Link>
            </div>
        );
    }

    const userInitials = session.user?.name ? getInitials(session.user.name) : '??';

    return (
        <div className="fixed top-0 right-0 p-4 z-50">
            <div className="relative">
                <button
                    onClick={() => setShowDropdown(!showDropdown)}
                    className="flex items-center gap-2 p-2 rounded-full bg-black/50 hover:bg-black/70 
                             backdrop-blur-sm border border-white/20 transition-all duration-300"
                >
                    {!scrolled && (
                        <div className="hidden sm:block text-sm text-white transition-all duration-300">
                            {session.user?.name || session.user?.email}
                        </div>
                    )}
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 
                                  flex items-center justify-center text-white font-medium text-sm">
                        {userInitials}
                    </div>
                </button>

                {showDropdown && (
                    <div className="absolute right-0 mt-2 w-48 rounded-lg bg-black/80 backdrop-blur-sm 
                                  border border-white/20 overflow-hidden">
                        <div className="px-4 py-3 border-b border-white/10">
                            <p className="text-sm text-white">{session.user?.name}</p>
                            <p className="text-xs text-gray-300 truncate">{session.user?.email}</p>
                        </div>
                        <div className="px-4 py-3 border-b border-white/10">
    <Link href="/pesanan">
        Pesanan
    </Link>
</div>
                        <button
                            onClick={() => signOut()}
                            className="w-full px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors 
                                     text-left"
                        >
                            Sign out
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}