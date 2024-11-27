export default function Process() {
    const steps = [
        {
            title: 'Discussion',
            description: 'We discuss your requirements and project scope'
        },
        {
            title: 'Planning',
            description: 'Create detailed project plan and timeline'
        },
        {
            title: 'Development',
            description: 'Build your project with regular updates'
        },
        {
            title: 'Delivery',
            description: 'Final testing and project handover'
        }
    ]

    return (
        <section className="py-20 px-4">
            <div className="max-w-6xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-12">How We Work</h2>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={step.title} className="relative">
                            <div className="p-6 rounded-lg bg-gray-800">
                                <div className="text-2xl font-bold text-blue-500 mb-4">0{index + 1}</div>
                                <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                                <p className="text-gray-400">{step.description}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}