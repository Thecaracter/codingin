export default function Services() {
    const services = [
        {
            title: 'Web Development',
            description: 'Modern websites using Next.js and React',
            icon: '🌐',
        },
        {
            title: 'Mobile Apps',
            description: 'Cross-platform mobile applications',
            icon: '📱',
        },
        {
            title: 'Backend Development',
            description: 'Scalable APIs and databases',
            icon: '⚙️',
        }
    ]

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">Our Services</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {services.map((service) => (
                        <div key={service.title} className="p-6 rounded-lg bg-gray-800">
                            <div className="text-4xl mb-4">{service.icon}</div>
                            <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                            <p className="text-gray-400">{service.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}