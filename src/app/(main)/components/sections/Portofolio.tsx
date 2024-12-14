'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';
import Image from 'next/image';

interface Portfolio {
    id: number;
    nama: string;
    deskripsi: string;
    techStack: string[];
    link: string;
    image: string;
}

export default function Portfolio() {
    const [projects, setProjects] = useState<Portfolio[]>([]);
    const [windowWidth, setWindowWidth] = useState(0);
    const x = useMotionValue(0);

    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
        };

        handleResize();

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        fetch('/api/portofolio')
            .then(res => res.json())
            .then(data => {
                const portfolioData = Array.isArray(data) ? data : data.data || [];
                setProjects(portfolioData);
            })
            .catch(err => {
                console.error('Error:', err);
                setProjects([]);
            });
    }, []);

    if (!projects.length) {
        return (
            <section className="min-h-screen py-20 px-4 relative overflow-hidden bg-black">
                <div className="max-w-7xl mx-auto relative z-10">
                    <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-[#4461F2] to-[#7C3AED] inline-block text-transparent bg-clip-text">Recent Projects</h2>
                    <div className="text-center text-[#4461F2]">Loading...</div>
                </div>
            </section>
        );
    }

    const calculateConstraint = () => {
        const cardWidth = 300;
        const gap = 24;
        const totalWidth = (projects.length * cardWidth) + ((projects.length - 1) * gap);
        const viewportWidth = windowWidth || 1200;

        // Hitung offset untuk centering
        const remainingSpace = Math.max(0, viewportWidth - totalWidth);
        const initialOffset = remainingSpace / 2;

        return {
            left: -(totalWidth - viewportWidth + gap),
            right: 0
        };
    };

    return (
        <section className="min-h-screen py-10 md:py-20 relative overflow-hidden bg-black">
            <div
                className="absolute inset-0 bg-[url('/stars.png')] opacity-50"
                style={{ backgroundSize: '200px 200px' }}
            />
            <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-[#4461F2] to-[#7C3AED] inline-block text-transparent bg-clip-text w-full">
                    Recent Projects
                </h2>

                <div className="overflow-hidden px-4">
                    <motion.div
                        className="flex gap-6 cursor-grab active:cursor-grabbing"
                        drag="x"
                        dragConstraints={calculateConstraint()}
                        style={{ x }}
                        dragElastic={0.1}
                        dragTransition={{ bounceStiffness: 600, bounceDamping: 20 }}
                    >
                        {projects.map((project) => (
                            <motion.div
                                key={project.id}
                                className="w-[300px] rounded-xl overflow-hidden bg-[#15162c]/90 backdrop-blur-sm border border-[#4461F2]/30 hover:border-[#4461F2] transition-all duration-300 group flex-shrink-0 shadow-lg hover:shadow-[#4461F2]/20"
                                whileHover={{ scale: 1.02, y: -5 }}
                            >
                                <div className="relative h-40 overflow-hidden">
                                    <Image
                                        src={project.image}
                                        alt={project.nama}
                                        width={300}
                                        height={160}
                                        className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#15162c] via-[#15162c]/40 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />
                                </div>
                                <div className="p-5">
                                    <h3 className="text-lg font-bold mb-2 text-[#4461F2] group-hover:text-[#7C3AED] transition-colors">
                                        {project.nama}
                                    </h3>
                                    <p className="text-gray-400 mb-4 text-sm line-clamp-2 group-hover:text-gray-300 transition-colors">
                                        {project.deskripsi}
                                    </p>
                                    <div className="flex flex-wrap gap-2">
                                        {project.techStack.map((tech) => (
                                            <span key={tech}
                                                className="px-3 py-1 bg-[#4461F2]/10 rounded-full text-xs text-[#4461F2] border border-[#4461F2]/30 hover:border-[#7C3AED] hover:text-[#7C3AED] hover:bg-[#7C3AED]/10 transition-all duration-300"
                                            >
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
}