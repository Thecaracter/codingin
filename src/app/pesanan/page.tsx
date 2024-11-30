"use client";

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface Pesanan {
    id: number;
    nama: string;
    namaAplikasi: string;
    keperluan: string;
    teknologi: string[];
    fitur: string[];
    deadline: string;
    akunTiktok: string;
    status: 'PENDING' | 'PROSES' | 'SELESAI' | 'DITOLAK';
    createdAt: string;
}

export default function PesananPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pesanan, setPesanan] = useState<Pesanan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [techInput, setTechInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);

    const [formData, setFormData] = useState({
        nama: '',
        namaAplikasi: '',
        keperluan: '',
        deadline: '',
        akunTiktok: ''
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetchPesanan();
        }
    }, [status, router]);

    const fetchPesanan = async () => {
        try {
            const res = await fetch('/api/pesanan');
            const data = await res.json();
            setPesanan(data);
        } catch (error) {
            console.error('Error fetching pesanan:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddTech = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && techInput.trim()) {
            e.preventDefault();
            if (!selectedTechs.includes(techInput.trim())) {
                setSelectedTechs([...selectedTechs, techInput.trim()]);
            }
            setTechInput('');
        }
    };

    const handleAddFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && featureInput.trim()) {
            e.preventDefault();
            if (!selectedFeatures.includes(featureInput.trim())) {
                setSelectedFeatures([...selectedFeatures, featureInput.trim()]);
            }
            setFeatureInput('');
        }
    };

    const removeTech = (techToRemove: string) => {
        setSelectedTechs(selectedTechs.filter(tech => tech !== techToRemove));
    };

    const removeFeature = (featureToRemove: string) => {
        setSelectedFeatures(selectedFeatures.filter(feature => feature !== featureToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedTechs.length === 0 || selectedFeatures.length === 0) {
            alert('Teknologi dan Fitur tidak boleh kosong');
            return;
        }

        setIsSubmitting(true);
        try {
            const response = await fetch('/api/pesanan', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...formData,
                    teknologi: selectedTechs,
                    fitur: selectedFeatures,
                }),
            });

            if (response.ok) {
                setFormData({
                    nama: '',
                    namaAplikasi: '',
                    keperluan: '',
                    deadline: '',
                    akunTiktok: ''
                });
                setSelectedTechs([]);
                setSelectedFeatures([]);
                await fetchPesanan();
            } else {
                const error = await response.json();
                alert(error.message || 'Gagal membuat pesanan');
            }
        } catch (error) {
            console.error('Error creating pesanan:', error);
            alert('Terjadi kesalahan saat membuat pesanan');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white">
            <div className="relative overflow-hidden bg-gradient-to-br from-blue-900 to-black py-10">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="max-w-5xl mx-auto px-4 relative">
                    <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        Pesanan Saya
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 -mt-8">
                <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-5 mb-8 backdrop-blur-xl shadow-2xl">
                    <div className="mb-4">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                            Buat Pesanan Baru
                        </h2>
                        <p className="text-sm text-gray-400 mt-1">Isi detail pesanan aplikasi Anda</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300">Nama</label>
                                <input
                                    type="text"
                                    value={formData.nama}
                                    onChange={(e) => setFormData({ ...formData, nama: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300">Nama Aplikasi</label>
                                <input
                                    type="text"
                                    value={formData.namaAplikasi}
                                    onChange={(e) => setFormData({ ...formData, namaAplikasi: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300">Keperluan</label>
                            <textarea
                                value={formData.keperluan}
                                onChange={(e) => setFormData({ ...formData, keperluan: e.target.value })}
                                rows={3}
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                required
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300">Teknologi</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedTechs.map((tech, index) => (
                                    <span
                                        key={index}
                                        className="group px-3 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20 flex items-center gap-1"
                                    >
                                        {tech}
                                        <button
                                            type="button"
                                            onClick={() => removeTech(tech)}
                                            className="hover:text-blue-200"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={techInput}
                                onChange={(e) => setTechInput(e.target.value)}
                                onKeyDown={handleAddTech}
                                placeholder="Ketik teknologi dan tekan Enter"
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-gray-300">Fitur</label>
                            <div className="flex flex-wrap gap-2 mb-2">
                                {selectedFeatures.map((feature, index) => (
                                    <span
                                        key={index}
                                        className="group px-3 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20 flex items-center gap-1"
                                    >
                                        {feature}
                                        <button
                                            type="button"
                                            onClick={() => removeFeature(feature)}
                                            className="hover:text-violet-200"
                                        >
                                            <X size={14} />
                                        </button>
                                    </span>
                                ))}
                            </div>
                            <input
                                type="text"
                                value={featureInput}
                                onChange={(e) => setFeatureInput(e.target.value)}
                                onKeyDown={handleAddFeature}
                                placeholder="Ketik fitur dan tekan Enter"
                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300">Deadline</label>
                                <input
                                    type="date"
                                    value={formData.deadline}
                                    onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-300">Akun TikTok</label>
                                <input
                                    type="text"
                                    value={formData.akunTiktok}
                                    onChange={(e) => setFormData({ ...formData, akunTiktok: e.target.value })}
                                    className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    required
                                />
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isSubmitting ? 'Submitting...' : 'Submit Pesanan'}
                        </button>
                    </form>
                </div>

                <div className="space-y-4 pb-8">
                    <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                        Riwayat Pesanan
                    </h2>

                    <div className="grid gap-4">
                        {pesanan.length === 0 ? (
                            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 text-center">
                                <p className="text-gray-400">Belum ada pesanan</p>
                            </div>
                        ) : (
                            pesanan.map((p) => (
                                <div
                                    key={p.id}
                                    className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-4 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                                >
                                    <div className="flex flex-wrap justify-between items-start gap-4 mb-3">
                                        <div>
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {p.namaAplikasi}
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                {new Date(p.createdAt).toLocaleDateString()}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${p.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-300 border border-yellow-500/20' :
                                            p.status === 'PROSES' ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20' :
                                                p.status === 'SELESAI' ? 'bg-green-500/10 text-green-300 border border-green-500/20' :
                                                    'bg-red-500/10 text-red-300 border border-red-500/20'
                                            }`}>
                                            {p.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-4">{p.keperluan}</p>

                                    <div className="grid grid-cols-2 gap-4 mb-4">
                                        <div>
                                            <h4 className="text-xs font-medium text-gray-400 mb-2">Teknologi</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {p.teknologi.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-medium text-gray-400 mb-2">Fitur</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {p.fitur.map((feature, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-3 border-t border-gray-800">
                                        <div className="flex flex-wrap justify-between text-xs text-gray-400">
                                            <div>Deadline: {new Date(p.deadline).toLocaleDateString()}</div>
                                            <div>TikTok: {p.akunTiktok}</div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}