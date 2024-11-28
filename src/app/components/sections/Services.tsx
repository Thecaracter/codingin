'use client'

interface ServiceCardProps {
    title: string;
    description: string;
    icon: string;
}

function ServiceCard({ title, description, icon }: ServiceCardProps) {
    return (
        <div className="p-8 rounded-xl bg-gray-800/50 backdrop-blur-sm hover:bg-gray-800/70 transition-all duration-300 relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <div className="relative z-10">
                <div className="w-16 h-16 mb-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                    <span className="text-3xl">{icon}</span>
                </div>
                <h3 className="text-xl font-bold mb-3 text-white/90">{title}</h3>
                <p className="text-gray-400 leading-relaxed">{description}</p>
            </div>
        </div>
    );
}

export default function Services() {
    const services = [
        {
            title: 'Web Development',
            description: 'Building modern, responsive websites using Next.js, React, and cutting-edge technologies for optimal user experience.',
            icon: '🌐',
            color: '#60A5FA'
        },
        {
            title: 'Mobile Apps',
            description: 'Developing cross-platform mobile applications with React Native and native integrations for seamless performance.',
            icon: '📱',
            color: '#34D399'
        },
        {
            title: 'Backend Development',
            description: 'Creating robust, scalable backend systems with Node.js, Python, and cloud infrastructure for reliable operations.',
            icon: '⚙️',
            color: '#F472B6'
        }
    ];

    return (
        <section className="relative min-h-screen py-24 px-4 bg-gray-900">
            <div className="max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                        Our Services
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        Delivering cutting-edge solutions with expertise and innovation
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <ServiceCard key={service.title} {...service} />
                    ))}
                </div>
            </div>
        </section>
    );
}