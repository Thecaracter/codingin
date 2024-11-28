'use client';

export default function Process() {
    const steps = [
        {
            title: 'Diskusi',
            description: 'Konsultasi awal untuk memahami visi dan kebutuhan Anda.',
            icon: '💡'
        },
        {
            title: 'Perencanaan',
            description: 'Membuat peta proyek dan strategi pengembangan secara detail.',
            icon: '📋'
        },
        {
            title: 'Pengembangan',
            description: 'Membangun proyek Anda dengan update progres yang konsisten.',
            icon: '⚡'
        },
        {
            title: 'Pengiriman',
            description: 'Pengujian akhir dan serah terima proyek yang lancar.',
            icon: '🚀'
        }
    ];

    return (
        <section id="process-section" className="min-h-screen py-16 px-4 relative overflow-hidden">
            <div className="max-w-4xl mx-auto relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold mb-3 text-white">Cara Kami Bekerja</h2>
                    <p className="text-gray-400">Proses pengembangan yang telah teruji</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {steps.map((step, index) => (
                        <div
                            key={step.title}
                            className="h-[180px] p-6 rounded-xl bg-gray-800/50 backdrop-blur-sm
                                    hover:bg-gray-800/70 transition-all duration-300
                                    border border-gray-700/50 hover:border-blue-500/50
                                    relative group"
                        >
                            <div
                                className="absolute inset-0 bg-gradient-to-br from-blue-500/5
                                        to-purple-500/5 opacity-0 group-hover:opacity-100
                                        transition-opacity duration-300 rounded-xl"
                            />

                            <div className="relative z-10 h-full flex flex-col">
                                <div className="flex items-center justify-between mb-3">
                                    <span className="text-2xl font-bold text-blue-500">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <span className="text-xl">{step.icon}</span>
                                </div>

                                <h3 className="text-lg font-semibold mb-2 text-white/90">
                                    {step.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}