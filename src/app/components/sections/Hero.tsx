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
            {/* Three.js Background */}
            <ThreeBackground />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/80 to-black" />

            {/* Content */}
            <div className="relative flex flex-col justify-center items-center min-h-[100dvh] py-20">
                <div className="z-10 w-full max-w-7xl text-center space-y-8 px-4 sm:px-6 lg:px-8 mx-auto">
                    {/* Animated Badge */}
                    <div
                        className={`inline-flex items-center px-3 sm:px-4 py-1.5 sm:py-2 rounded-full 
                            bg-white/10 backdrop-blur-sm border border-white/20 transition-all duration-700
                            ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                    >
                        <span className="animate-pulse w-2 h-2 rounded-full bg-blue-400 mr-2" />
                        <span className="text-xs sm:text-sm text-gray-300">Professional Development & IT Solutions</span>
                    </div>

                    {/* Main Title */}
                    <div className={`space-y-4 sm:space-y-6 transition-all duration-700 delay-100 
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight px-4">
                            <span className="bg-clip-text text-transparent bg-gradient-to-r 
                                from-blue-500 via-purple-500 to-pink-500 animate-gradient bg-300">
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

                    {/* CTA Buttons */}
                    <div className={`flex flex-col sm:flex-row items-center gap-3 sm:gap-4 justify-center 
                        transition-all duration-700 delay-300 px-4
                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                        <button className="group relative w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 
                            rounded-lg text-base sm:text-lg font-medium transition-all duration-300 
                            hover:scale-105 overflow-hidden">
                            {/* Button Background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 
                                group-hover:scale-105 transition-transform duration-300" />
                            {/* Button Glow */}
                            <div className="absolute inset-0 opacity-50 bg-gradient-to-r from-blue-600 
                                to-purple-600 blur-xl group-hover:opacity-75 transition-opacity duration-300" />
                            {/* Button Content */}
                            <span className="relative flex items-center justify-center">
                                Diskusi Project
                                <ChevronRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 
                                    transition-transform" />
                            </span>
                        </button>

                        <button className="w-full sm:w-auto px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg 
                            text-base sm:text-lg font-medium bg-white/10 backdrop-blur-sm hover:bg-white/20 
                            transition-all border border-white/20 hover:scale-105 duration-300">
                            Lihat Portfolio
                        </button>
                    </div>

                    {/* Services Grid */}
                    <div className="space-y-4 mt-16 sm:mt-20">
                        <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 
                            sm:gap-4 lg:gap-6 px-4">
                            {visibleServices.map((service, index) => (
                                <div
                                    key={service.name}
                                    className={`group relative p-4 sm:p-6 rounded-xl bg-gradient-to-b 
                                        from-white/10 to-white/5 hover:from-blue-500/20 
                                        hover:to-purple-500/20 backdrop-blur-sm transition-all duration-500 
                                        hover:scale-105 border border-white/10 flex flex-col items-center
                                        ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
                                    style={{
                                        transitionDelay: `${500 + index * 100}ms`,
                                    }}
                                >
                                    {/* Card Glow Effect */}
                                    <div className="absolute inset-0 rounded-xl bg-blue-500/20 blur-xl 
                                        opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                    {/* Card Content */}
                                    <div className="relative z-10 flex flex-col items-center text-center w-full">
                                        {/* Icon Container */}
                                        <div className="mb-3 sm:mb-4 transform-gpu group-hover:-translate-y-1 
                                            transition-transform duration-300 flex justify-center">
                                            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-lg bg-gradient-to-br 
                                                from-blue-500 to-purple-500 p-2 sm:p-2.5 ring-2 ring-white/10 
                                                group-hover:ring-white/20 transition-all duration-300 flex items-center justify-center">
                                                <service.icon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                                            </div>
                                        </div>

                                        {/* Text Content */}
                                        <div className="space-y-1 sm:space-y-2 transform-gpu group-hover:-translate-y-1 
                                            transition-transform duration-300 text-center">
                                            <h3 className="text-sm sm:text-base font-semibold text-white 
                                                group-hover:text-blue-300 transition-colors duration-300">
                                                {service.name}
                                            </h3>
                                            <p className="text-xs sm:text-sm text-gray-400 group-hover:text-gray-300 
                                                transition-colors duration-300">
                                                {service.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Show More Button - Only visible on mobile when not all services are shown */}
                        {!showAll && isMobile && (
                            <button
                                onClick={() => setShowAll(true)}
                                className="flex items-center justify-center gap-2 mx-auto px-4 py-2 
                                    text-sm text-gray-300 hover:text-white transition-colors duration-300"
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