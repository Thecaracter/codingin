'use client';

export default function Portfolio() {
    const projects = [
        {
            title: 'E-commerce Platform',
            description: 'Full-stack online store with payment integration',
            tech: ['Next.js', 'PostgreSQL', 'Stripe'],
            bgColor: 'from-blue-600/20 to-purple-600/20'
        },
        {
            title: 'Social Media App',
            description: 'Real-time messaging and content sharing',
            tech: ['React', 'Node.js', 'MongoDB'],
            bgColor: 'from-emerald-600/20 to-blue-600/20'
        }
    ];

    return (
        <section id="portfolio-section" className="min-h-screen py-20 px-4 relative overflow-hidden">
            <div className="max-w-6xl mx-auto relative z-10">
                <h2 className="text-3xl font-bold text-center mb-12 text-white">Recent Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <div key={project.title}
                            className="rounded-xl overflow-hidden bg-gray-800/50 backdrop-blur-sm
                                      border border-gray-700/50 hover:border-blue-500/50
                                      transition-all duration-300 group">
                            <div className="relative h-48 overflow-hidden">
                                <div className={`absolute inset-0 bg-gradient-to-br ${project.bgColor} opacity-80`} />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <span className="text-6xl transform group-hover:scale-110 transition-transform duration-500">
                                        {project.title.includes('E-commerce') ? '🛍️' : '💬'}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                            </div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2 text-white group-hover:text-blue-400 transition-colors">
                                    {project.title}
                                </h3>
                                <p className="text-gray-400 mb-4">{project.description}</p>
                                <div className="flex flex-wrap gap-2">
                                    {project.tech.map((tech) => (
                                        <span key={tech}
                                            className="px-3 py-1 bg-gray-700/50 rounded-full text-sm text-gray-300
                                                       backdrop-blur-sm border border-gray-600/50 hover:border-blue-500/50
                                                       transition-colors duration-300">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}