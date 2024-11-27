export default function Portfolio() {
    const projects = [
        {
            title: 'E-commerce Platform',
            description: 'Full-stack online store with payment integration',
            tech: ['Next.js', 'PostgreSQL', 'Stripe'],
            image: '/project1.jpg'
        },
        {
            title: 'Social Media App',
            description: 'Real-time messaging and content sharing',
            tech: ['React', 'Node.js', 'MongoDB'],
            image: '/project2.jpg'
        }
    ]

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Recent Projects</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {projects.map((project) => (
                        <div key={project.title} className="rounded-lg bg-gray-800 overflow-hidden">
                            <div className="h-48 bg-gray-700"></div>
                            <div className="p-6">
                                <h3 className="text-xl font-semibold mb-2">{project.title}</h3>
                                <p className="text-gray-400 mb-4">{project.description}</p>
                                <div className="flex gap-2">
                                    {project.tech.map((tech) => (
                                        <span key={tech} className="px-3 py-1 bg-gray-700 rounded-full text-sm">
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
    )
}