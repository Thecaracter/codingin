'use client';
import { useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

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
    const [row1, setRow1] = useState<Portfolio[]>([]);
    const [row2, setRow2] = useState<Portfolio[]>([]);
    const x1 = useMotionValue(0);
    const x2 = useMotionValue(0);

    useEffect(() => {
        fetch('/api/portofolio')
            .then(res => res.json())
            .then(data => {
                const portfolioData = Array.isArray(data) ? data : data.data || [];
                setProjects(portfolioData);

                // Membagi data menjadi 2 baris
                const midPoint = Math.ceil(portfolioData.length / 2);
                setRow1(portfolioData.slice(0, midPoint));
                setRow2(portfolioData.slice(midPoint));
            })
            .catch(err => {
                console.error('Error:', err);
                setProjects([]);
            });
    }, []);

    if (!projects.length) {
        return (
            <section className="min-h-screen py-20 px-4 relative overflow-hidden">
                <div className="max-w-7xl mx-auto relative z-10">
                    <h2 className="text-3xl font-bold text-center mb-12 text-white">Recent Projects</h2>
                    <div className="text-center text-white">Loading...</div>
                </div>
            </section>
        );
    }

    return (
        <section id="portfolio-section" className="min-h-screen py-20 relative overflow-hidden">
            <div className="relative z-10">
                <h2 className="text-3xl font-bold text-center mb-12 text-white">Recent Projects</h2>

                <div className="space-y-6 overflow-hidden">
                    {/* Baris Pertama */}
                    <div className="overflow-hidden px-4">
                        <motion.div
                            className="flex gap-6 cursor-grab active:cursor-grabbing"
                            drag="x"
                            dragConstraints={{
                                left: -((row1.length * 320) - (typeof window !== 'undefined' ? window.innerWidth - 32 : 0)),
                                right: 0
                            }}
                            style={{ x: x1 }}
                        >
                            {row1.map((project) => (
                                <motion.div
                                    key={project.id}
                                    className="min-w-[300px] rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm
                                    border border-gray-700/50 hover:border-blue-500/50
                                    transition-all duration-300 group flex-shrink-0"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.nama}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                                            {project.nama}
                                        </h3>
                                        <p className="text-gray-400 mb-3 text-sm">{project.deskripsi}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map((tech) => (
                                                <span key={tech}
                                                    className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300
                                                    backdrop-blur-sm border border-gray-600/50 hover:border-blue-500/50
                                                    transition-colors duration-300"
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

                    {/* Baris Kedua */}
                    <div className="overflow-hidden px-4">
                        <motion.div
                            className="flex gap-6 cursor-grab active:cursor-grabbing"
                            drag="x"
                            dragConstraints={{
                                left: -((row2.length * 320) - (typeof window !== 'undefined' ? window.innerWidth - 32 : 0)),
                                right: 0
                            }}
                            style={{ x: x2 }}
                        >
                            {row2.map((project) => (
                                <motion.div
                                    key={project.id}
                                    className="min-w-[300px] rounded-lg overflow-hidden bg-gray-800/50 backdrop-blur-sm
                                    border border-gray-700/50 hover:border-blue-500/50
                                    transition-all duration-300 group flex-shrink-0"
                                    whileHover={{ scale: 1.02 }}
                                >
                                    <div className="relative h-40 overflow-hidden">
                                        <img
                                            src={project.image}
                                            alt={project.nama}
                                            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                                    </div>
                                    <div className="p-4">
                                        <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                                            {project.nama}
                                        </h3>
                                        <p className="text-gray-400 mb-3 text-sm">{project.deskripsi}</p>
                                        <div className="flex flex-wrap gap-2">
                                            {project.techStack.map((tech) => (
                                                <span key={tech}
                                                    className="px-2 py-1 bg-gray-700/50 rounded-full text-xs text-gray-300
                                                    backdrop-blur-sm border border-gray-600/50 hover:border-blue-500/50
                                                    transition-colors duration-300"
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
            </div>
        </section>
    );
}