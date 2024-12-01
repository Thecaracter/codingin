'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { Code, Layout, Smartphone, Database, MessagesSquare, ChevronRight, Blocks, PencilRuler, Globe, ChevronDown } from 'lucide-react'

interface TypewriterEffectProps {
    text: string
    className?: string
    delay?: number
}

const TypewriterEffect = ({ text, className = '', delay = 50 }: TypewriterEffectProps) => {
    const [displayedText, setDisplayedText] = useState('')
    const [currentIndex, setCurrentIndex] = useState(0)

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex])
                setCurrentIndex(prev => prev + 1)
            }, delay)

            return () => clearTimeout(timeout)
        }
    }, [currentIndex, delay, text])

    return (
        <p className={className}>
            {displayedText}
            <span className="animate-pulse">|</span>
        </p>
    )
}

const ThreeBackground = dynamic(() => import('../three/ThreeBackground'), {
    ssr: false,
    loading: () => <div className="absolute inset-0 bg-black" />
})

const services = [
    {
        name: 'Web Development',
        icon: Globe,
        description: 'Website modern & responsif'
    },
    {
        name: 'UI/UX Design',
        icon: PencilRuler,
        description: 'Design interaktif & menarik'
    },
    {
        name: 'Mobile Apps',
        icon: Smartphone,
        description: 'Aplikasi Android & iOS'
    },
    {
        name: 'Backend System',
        icon: Database,
        description: 'API & sistem scalable'
    },
    {
        name: 'Project IT',
        icon: Blocks,
        description: 'Web, mobile & sistem custom'
    },
    {
        name: 'Konsultasi',
        icon: MessagesSquare,
        description: 'Bimbingan programming'
    }
]

export default function Hero() {
    const [mounted, setMounted] = useState(false)
    const [showAll, setShowAll] = useState(false)
    const [startTyping, setStartTyping] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    const handleWhatsAppClick = () => {
        window.open('https://wa.me/+6283182192666', '_blank')
    }

    const handleDiscordClick = () => {
        window.open('YOUR_DISCORD_INVITE_LINK', '_blank')
    }

    useEffect(() => {
        setMounted(true)
        const timer = setTimeout(() => setStartTyping(true), 1000)

        const checkMobile = () => setIsMobile(window.innerWidth <= 768)
        checkMobile()
        window.addEventListener('resize', checkMobile)

        return () => {
            clearTimeout(timer)
            window.removeEventListener('resize', checkMobile)
        }
    }, [])

    const visibleServices = !showAll && isMobile ? services.slice(0, 3) : services

    return (
        <section className="min-h-[100dvh] relative overflow-hidden bg-black">
            <ThreeBackground />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />
            <div className="relative flex flex-col justify-center items-center min-h-[100dvh] py-20">
                <div className="z-10 w-full max-w-7xl text-center space-y-8 px-4 sm:px-6 lg:px-8 mx-auto">
                    <div className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-700 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <span className="animate-pulse w-2 h-2 rounded-full bg-blue-400 mr-2" />
                        <span className="text-xs sm:text-sm text-gray-300">Professional Development & IT Solutions</span>
                    </div>

                    <div className={`space-y-4 sm:space-y-6 transition-all duration-700 delay-100 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight px-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-300">
                                Solusi Digital &
                            </span>
                            <br className="hidden sm:block" />
                            <span className="text-white mt-2 sm:mt-0 inline-block">Layanan IT</span>
                        </h1>

                        {startTyping ? (
                            <TypewriterEffect
                                text="Jasa pengembangan aplikasi profesional & konsultasi IT untuk kebutuhan bisnis dan akademik Anda"
                                className="text-base sm:text-lg md:text-xl text-gray-300 max-w-xl sm:max-w-2xl mx-auto px-4"
                                delay={30}
                            />
                        ) : (
                            <div className="h-[1.5em] sm:h-[1.75em] md:h-[2em]" />
                        )}
                    </div>

                    <div className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center transition-all duration-700 delay-300 px-4 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <button onClick={handleWhatsAppClick} className="group relative w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-medium transition-all duration-300 hover:scale-105 overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 group-hover:scale-105 transition-transform duration-300" />
                            <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-600 to-purple-600 blur-xl group-hover:opacity-75 transition-opacity duration-300" />
                            <span className="relative flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                </svg>
                                Diskusi Project
                                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </button>

                        <button onClick={handleDiscordClick} className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg text-base sm:text-lg font-medium bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all border border-white/20 hover:scale-105 duration-300">
                            <span className="flex items-center justify-center">
                                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.118.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.157 2.418z" />
                                </svg>
                                Join Discord
                            </span>
                        </button>
                    </div>

                    <div className="space-y-4 mt-16 sm:mt-20">
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 lg:gap-6 px-4">
                            {visibleServices.map((service, index) => (
                                <div
                                    key={service.name}
                                    className={`group relative p-4 sm:p-6 rounded-xl bg-gradient-to-b from-white/10 to-white/5 hover:from-blue-500/20 hover:to-purple-500/20 backdrop-blur-sm transition-all duration-500 hover:scale-105 border border-white/10 flex flex-col items-center ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                    style={{
                                        transitionDelay: `${500 + index * 100}ms`,
                                    }}
                                >
                                    <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                    <div className="relative z-10 flex flex-col items-center text-center w-full">
                                        <div className="mb-3 sm:mb-4 transform-gpu group-hover:-translate-y-1 transition-transform duration-300 flex justify-center">
                                            <div className="w-10 h-10 sm:w-12sm:h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 p-2 sm:p-2.5 ring-2 ring-white/10 group-hover:ring-white/20 transition-all duration-300 flex items-center justify-center">
                                                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                            </div>
                                        </div>

                                        <div className="space-y-1 sm:space-y-2 transform-gpu group-hover:-translate-y-1 transition-transform duration-300 text-center">
                                            <h3 className="text-sm sm:text-base font-semibold text-white group-hover:text-blue-300 transition-colors duration-300">
                                                {service.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {!showAll && isMobile && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="flex items-center justify-center gap-2 mx-auto px-4 py-2 text-sm text-gray-300 hover:text-white transition-colors duration-300"
                            >
                                Lihat Selengkapnya
                                <ChevronDown className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}