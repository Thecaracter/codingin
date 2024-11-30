'use client';

import { signIn } from 'next-auth/react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleLogin = async (provider: string) => {
        try {
            setIsLoading(true);
            await signIn(provider, {
                callbackUrl: '/',
                redirect: false,
            });

            router.push('/');
            router.refresh();
        } catch (error) {
            console.error('Login error:', error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-violet-900 flex flex-col items-center justify-center p-4">
            {/* Animated background overlay */}
            <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(68,_0,_255,_0.2)_50%,transparent_75%,transparent_100%)] bg-[length:400%_400%] animate-gradient-xy pointer-events-none"></div>

            <div className="relative w-full max-w-[400px] space-y-8 bg-gray-900/80 backdrop-blur-xl p-8 rounded-lg border border-purple-500/30 shadow-[0_0_15px_rgba(149,_0,_255,_0.5)] animate-pulse-subtle">
                {/* Logo */}
                <div className="flex justify-center">
                    <div className="w-16 h-16 relative">
                        <div className="absolute inset-0 bg-cyan-500 rounded-lg rotate-45 animate-pulse"></div>
                        <div className="absolute inset-2 bg-gray-900 rounded-lg rotate-45"></div>
                        <div className="absolute inset-4 bg-purple-500 rounded-lg rotate-45 animate-pulse"></div>
                    </div>
                </div>

                {/* Header */}
                <div className="space-y-2 text-center">
                    <h2 className="text-3xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">
                        Access Terminal
                    </h2>
                    <p className="text-sm text-cyan-400/80">
                        Initialize authentication sequence
                    </p>
                </div>

                {/* Buttons */}
                <div className="space-y-4">
                    {/* GitHub Login Button */}
                    <button
                        onClick={() => handleLogin('github')}
                        disabled={isLoading}
                        className="relative flex w-full justify-center items-center space-x-3 rounded-md bg-gray-800 hover:bg-gray-700 px-4 py-3 text-sm font-medium text-cyan-400 transition-all duration-300 border border-purple-500/50 hover:border-purple-500 hover:shadow-[0_0_10px_rgba(149,_0,_255,_0.5)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 group"
                    >
                        <svg className="h-5 w-5 group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"
                            />
                        </svg>
                        <span className="group-hover:text-purple-400 transition-colors">Connect via GitHub</span>
                    </button>

                    {/* Google Login Button */}
                    <button
                        onClick={() => handleLogin('google')}
                        disabled={isLoading}
                        className="relative flex w-full justify-center items-center space-x-3 rounded-md bg-gray-800 hover:bg-gray-700 px-4 py-3 text-sm font-medium text-cyan-400 transition-all duration-300 border border-purple-500/50 hover:border-purple-500 hover:shadow-[0_0_10px_rgba(149,_0,_255,_0.5)] focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-70 group"
                    >
                        <svg className="h-5 w-5 group-hover:text-purple-400 transition-colors" viewBox="0 0 24 24">
                            <path
                                fill="currentColor"
                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                                fill="currentColor"
                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                                fill="currentColor"
                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                        </svg>
                        <span className="group-hover:text-purple-400 transition-colors">Connect via Google</span>
                    </button>
                </div>

                {/* Loading Spinner */}
                {isLoading && (
                    <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-2 border-purple-500 border-t-transparent shadow-[0_0_10px_rgba(149,_0,_255,_0.5)]"></div>
                    </div>
                )}
            </div>
        </div>
    );
}