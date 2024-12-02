'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X as XIcon, Loader2, Plus, Calendar, Upload, CheckCircle2, AlertCircle } from 'lucide-react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { formatDistance } from 'date-fns';
import { id } from 'date-fns/locale';
import UploadBukti from './components/UploadBukti';

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
    buktiDP?: string;
    buktiPelunasan?: string;
}

export default function PesananPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [pesanan, setPesanan] = useState<Pesanan[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
    const [selectedPesanan, setSelectedPesanan] = useState<number | null>(null);
    const [uploadType, setUploadType] = useState<'buktiDP' | 'buktiPelunasan' | null>(null);

    const [techInput, setTechInput] = useState('');
    const [featureInput, setFeatureInput] = useState('');
    const [selectedTechs, setSelectedTechs] = useState<string[]>([]);
    const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
    const [formData, setFormData] = useState({
        nama: '',
        namaAplikasi: '',
        keperluan: '',
        deadline: new Date(),
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
            const newTechs = techInput
                .split(',')
                .map(tech => tech.trim())
                .filter(tech => tech && !selectedTechs.includes(tech));
            setSelectedTechs([...selectedTechs, ...newTechs]);
            setTechInput('');
        }
    };

    const handleAddFeature = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && featureInput.trim()) {
            e.preventDefault();
            const newFeatures = featureInput
                .split(',')
                .map(feature => feature.trim())
                .filter(feature => feature && !selectedFeatures.includes(feature));
            setSelectedFeatures([...selectedFeatures, ...newFeatures]);
            setFeatureInput('');
        }
    };

    const removeTech = (techToRemove: string) => {
        setSelectedTechs(selectedTechs.filter(tech => tech !== techToRemove));
    };

    const removeFeature = (featureToRemove: string) => {
        setSelectedFeatures(selectedFeatures.filter(feature => feature !== featureToRemove));
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20';
            case 'PROSES':
                return 'bg-blue-500/10 text-blue-300 border-blue-500/20';
            case 'SELESAI':
                return 'bg-green-500/10 text-green-300 border-green-500/20';
            case 'DITOLAK':
                return 'bg-red-500/10 text-red-300 border-red-500/20';
            default:
                return 'bg-gray-500/10 text-gray-300 border-gray-500/20';
        }
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
                    deadline: formData.deadline.toISOString(),
                    teknologi: selectedTechs,
                    fitur: selectedFeatures,
                }),
            });

            if (response.ok) {
                setFormData({
                    nama: '',
                    namaAplikasi: '',
                    keperluan: '',
                    deadline: new Date(),
                    akunTiktok: ''
                });
                setSelectedTechs([]);
                setSelectedFeatures([]);
                await fetchPesanan();
                setIsModalOpen(false);
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

    const handleUploadClick = (pesananId: number, type: 'buktiDP' | 'buktiPelunasan') => {
        setSelectedPesanan(pesananId);
        setUploadType(type);
        setIsUploadModalOpen(true);
    };

    if (status === 'loading' || isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#030712]">
            {/* Header Section */}
            <div className="relative bg-gradient-to-b from-gray-900 to-[#030712] py-8 sm:py-12">
                <div className="absolute inset-0 bg-[url('/grid.svg')] bg-top [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
                <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div className="space-y-1">
                            <h1 className="text-2xl sm:text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                                Pesanan Saya
                            </h1>
                            <p className="text-sm text-gray-400">
                                Kelola dan pantau status pesanan aplikasi Anda
                            </p>
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="group px-4 py-2 bg-gradient-to-r from-blue-500 to-violet-500 rounded-lg text-sm font-medium hover:from-blue-600 hover:to-violet-600 transition-all duration-200 flex items-center gap-2"
                        >
                            <Plus className="h-4 w-4 group-hover:rotate-90 transition-transform duration-200" />
                            Buat Pesanan
                        </button>
                    </div>
                </div>
            </div>

            {/* Upload Modal */}
            {isUploadModalOpen && selectedPesanan && uploadType && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-md">
                        <div className="p-5 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                                Upload Bukti {uploadType === 'buktiDP' ? 'DP' : 'Pelunasan'}
                            </h2>
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <XIcon size={20} />
                            </button>
                        </div>
                        <div className="p-5 space-y-4">
                            <UploadBukti
                                pesananId={selectedPesanan}
                                jenisBukti={uploadType}
                                onSuccess={() => {
                                    setIsUploadModalOpen(false);
                                    fetchPesanan();
                                }}
                            />
                            <button
                                onClick={() => setIsUploadModalOpen(false)}
                                className="w-full mt-4 py-2 px-4 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Create Order Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl w-full max-w-2xl max-h-[90vh] overflow-auto animate-in fade-in zoom-in duration-200">
                        <div className="p-5 border-b border-gray-800 flex justify-between items-center sticky top-0 bg-gray-900/80 backdrop-blur-sm">
                            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                                Buat Pesanan Baru
                            </h2>
                            <button
                                onClick={() => setIsModalOpen(false)}
                                className="p-1 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <XIcon size={20} />
                            </button>
                        </div>

                        <div className="p-5">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                {/* Nama dan Nama Aplikasi */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

                                {/* Keperluan */}
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

                                {/* Teknologi */}
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
                                                    <XIcon size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={techInput}
                                        onChange={(e) => setTechInput(e.target.value)}
                                        onKeyDown={handleAddTech}
                                        placeholder="Ketik teknologi (pisahkan dengan koma) dan tekan Enter"
                                        className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Fitur */}
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
                                                    <XIcon size={14} />
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                    <input
                                        type="text"
                                        value={featureInput}
                                        onChange={(e) => setFeatureInput(e.target.value)}
                                        onKeyDown={handleAddFeature}
                                        placeholder="Ketik fitur (pisahkan dengan koma) dan tekan Enter"
                                        className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    />
                                </div>

                                {/* Deadline dan Akun TikTok */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-xs font-medium text-gray-300">Deadline</label>
                                        <div className="relative">
                                            <DatePicker
                                                selected={formData.deadline}
                                                onChange={(date: Date | null) => {
                                                    if (date) {
                                                        setFormData({ ...formData, deadline: date });
                                                    }
                                                }}
                                                dateFormat="dd/MM/yyyy"
                                                minDate={new Date()}
                                                showYearDropdown
                                                yearDropdownItemNumber={10}
                                                scrollableYearDropdown
                                                className="w-full bg-black/50 border border-gray-800 rounded-lg p-2 pr-10 text-sm text-white hover:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all cursor-pointer"
                                                required
                                            />
                                            <Calendar className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
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

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-gradient-to-r from-blue-500 to-violet-500 hover:from-blue-600 hover:to-violet-600 text-white text-sm font-medium py-2 px-4 rounded-lg transition-all duration-200 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Memproses...
                                        </>
                                    ) : (
                                        'Submit Pesanan'
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Daftar Pesanan */}
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-violet-400">
                            Riwayat Pesanan
                        </h2>
                    </div>

                    <div className="grid gap-4">
                        {pesanan.length === 0 ? (
                            <div className="bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-8 text-center">
                                <div className="max-w-sm mx-auto space-y-4">
                                    <p className="text-gray-400">Belum ada pesanan yang dibuat</p>
                                    <button
                                        onClick={() => setIsModalOpen(true)}
                                        className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
                                    >
                                        Buat pesanan pertama Anda
                                    </button>
                                </div>
                            </div>
                        ) : (
                            pesanan.map((p) => (
                                <div
                                    key={p.id}
                                    className="group bg-gradient-to-br from-gray-900 to-black border border-gray-800 rounded-xl p-6 hover:border-gray-700 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10"
                                >
                                    <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-4">
                                        <div className="space-y-1">
                                            <h3 className="text-lg font-bold text-white group-hover:text-blue-400 transition-colors">
                                                {p.namaAplikasi}
                                            </h3>
                                            <p className="text-xs text-gray-400">
                                                Dibuat {formatDistance(new Date(p.createdAt), new Date(), {
                                                    addSuffix: true,
                                                    locale: id
                                                })}
                                            </p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(p.status)}`}>
                                            {p.status}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-300 mb-6">{p.keperluan}</p>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                        <div>
                                            <h4 className="text-xs font-medium text-gray-400 mb-2">Teknologi</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {p.teknologi.map((tech, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-500/10 text-blue-300 border border-blue-500/20"
                                                    >
                                                        {tech}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="text-xs font-medium text-gray-400 mb-2">Fitur</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {p.fitur.map((feature, i) => (
                                                    <span
                                                        key={i}
                                                        className="px-2.5 py-1 rounded-full text-xs font-medium bg-violet-500/10 text-violet-300 border border-violet-500/20"
                                                    >
                                                        {feature}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Bukti Pembayaran Section */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-gray-800">
                                        {/* Bukti DP */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-medium text-gray-400">Bukti DP</h4>
                                                {p.status === 'PENDING' && !p.buktiDP && (
                                                    <button
                                                        onClick={() => handleUploadClick(p.id, 'buktiDP')}
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 text-blue-300 hover:bg-blue-500/20 transition-colors text-xs font-medium"
                                                    >
                                                        <Upload size={14} />
                                                        Upload DP
                                                    </button>
                                                )}
                                            </div>
                                            {p.buktiDP ? (
                                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                                    <CheckCircle2 size={16} />
                                                    Bukti DP telah diupload
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <AlertCircle size={16} />
                                                    Belum ada bukti DP
                                                </div>
                                            )}
                                        </div>

                                        {/* Bukti Pelunasan */}
                                        <div className="space-y-2">
                                            <div className="flex items-center justify-between">
                                                <h4 className="text-xs font-medium text-gray-400">Bukti Pelunasan</h4>
                                                {p.status === 'SELESAI' && p.buktiDP && !p.buktiPelunasan && (
                                                    <button
                                                        onClick={() => handleUploadClick(p.id, 'buktiPelunasan')}
                                                        className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-300 hover:bg-violet-500/20 transition-colors text-xs font-medium"
                                                    >
                                                        <Upload size={14} />
                                                        Upload Pelunasan
                                                    </button>
                                                )}
                                            </div>
                                            {p.buktiPelunasan ? (
                                                <div className="flex items-center gap-2 text-green-400 text-sm">
                                                    <CheckCircle2 size={16} />
                                                    Bukti pelunasan telah diupload
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2 text-gray-500 text-sm">
                                                    <AlertCircle size={16} />
                                                    Belum ada bukti pelunasan
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    <div className="pt-4 border-t border-gray-800 mt-6">
                                        <div className="flex flex-wrap justify-between gap-4 text-xs text-gray-400">
                                            <div className="flex items-center gap-2">
                                                <span>Deadline:</span>
                                                <span className="text-gray-300">
                                                    {new Date(p.deadline).toLocaleDateString('id-ID', {
                                                        year: 'numeric',
                                                        month: 'long',
                                                        day: 'numeric'
                                                    })}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span>TikTok:</span>
                                                <span className="text-gray-300">{p.akunTiktok}</span>
                                            </div>
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