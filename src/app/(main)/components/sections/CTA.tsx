import Button from '../ui/Button'

export default function CTA() {
    return (
        <section className="py-20 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div
                    className="p-8 rounded-xl bg-gray-800/50 backdrop-blur-sm
                    hover:bg-gray-800/70 transition-all duration-300
                    border border-gray-700/50 hover:border-blue-500/50
                    relative group"
                >
                    <div
                        className="absolute inset-0 bg-gradient-to-br from-blue-500/5
                                to-purple-500/5 opacity-0 group-hover:opacity-100
                                transition-opacity duration-300 rounded-xl"
                    />

                    <div className="relative z-10 text-center">
                        <h2 className="text-3xl font-bold mb-3 text-white/90">
                            Ready to Start Your Project?
                        </h2>
                        <p className="text-gray-400 mb-6">
                            Let&apos;s build something amazing together
                        </p>
                        <Button className="mx-auto">Contact Us</Button>
                    </div>
                </div>
            </div>
        </section>
    )
}