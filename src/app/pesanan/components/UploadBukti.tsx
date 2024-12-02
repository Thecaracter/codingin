'use client';

import { useState } from 'react';
import { toast } from 'react-hot-toast';
import { Loader2, Copy, Upload } from 'lucide-react';
import Image from 'next/image';

interface UploadBuktiProps {
    pesananId: number;
    jenisBukti: 'buktiDP' | 'buktiPelunasan';
    onSuccess: () => void;
}

const PAYMENT_INFO = {
    bank: {
        name: 'Bank BCA',
        account: '1234567890',
        holder: 'John Doe'
    }
};

export default function UploadBukti({ pesananId, jenisBukti, onSuccess }: UploadBuktiProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            toast.error('Ukuran file maksimal 5MB');
            return;
        }

        if (!file.type.startsWith('image/')) {
            toast.error('File harus berupa gambar');
            return;
        }

        setSelectedFile(file);
        const preview = URL.createObjectURL(file);
        setPreviewUrl(preview);
    };

    const handleSubmit = async () => {
        if (!selectedFile || !previewUrl) return;
    
        try {
            setIsUploading(true);
            console.log('Starting upload process...', {
                pesananId,
                jenisBukti,
                fileSize: selectedFile.size,
                fileType: selectedFile.type
            });
    
            const base64 = await new Promise<string>((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => {
                    const result = reader.result as string;
                    console.log('Base64 conversion complete, length:', result.length);
                    resolve(result);
                };
                reader.onerror = (error) => reject(error);
                reader.readAsDataURL(selectedFile);
            });
    
            console.log('Sending request to server...');
            const response = await fetch('/api/pesanan', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    pesananId,
                    jenisBukti,
                    bukti: base64
                }),
            });
    
            console.log('Server response status:', response.status);
            console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
            const responseText = await response.text();
            console.log('Raw response:', responseText);
    
            let data;
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                console.error('Failed to parse JSON response:', e);
                throw new Error('Invalid server response format');
            }
    
            if (!response.ok) {
                throw new Error(data.error || 'Terjadi kesalahan saat upload');
            }
    
            toast.success(data.message || 'Berhasil mengupload bukti pembayaran');
            onSuccess();
            setSelectedFile(null);
            setPreviewUrl(null);
    
        } catch (error: any) {
            console.error('Upload error details:', error);
            toast.error(error.message || 'Gagal mengupload bukti pembayaran');
        } finally {
            setIsUploading(false);
        }
    };

    const copyToClipboard = (text: string) => {
        navigator.clipboard.writeText(text);
        toast.success('Berhasil menyalin ke clipboard');
    };

    return (
        <div className="space-y-6">
            {/* Payment Information */}
            <div className="bg-gray-900/50 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-300 mb-3">Informasi Pembayaran</h3>
                <div className="bg-black/30 p-3 rounded-md space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300">{PAYMENT_INFO.bank.name}</span>
                        <button
                            onClick={() => copyToClipboard(PAYMENT_INFO.bank.account)}
                            className="text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 text-sm"
                        >
                            <span>{PAYMENT_INFO.bank.account}</span>
                            <Copy size={14} />
                        </button>
                    </div>
                    <p className="text-sm text-gray-400">a.n {PAYMENT_INFO.bank.holder}</p>
                </div>
            </div>

            {/* Upload Section */}
            <div className="space-y-4">
                <h3 className="text-sm font-medium text-gray-300">
                    Upload Bukti {jenisBukti === 'buktiDP' ? 'DP' : 'Pelunasan'}
                </h3>

                {/* Preview Image */}
                {previewUrl && (
                    <div className="space-y-4">
                        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black/30">
                            <Image
                                src={previewUrl}
                                alt="Preview bukti pembayaran"
                                fill
                                className="object-contain"
                            />
                        </div>
                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setSelectedFile(null);
                                    setPreviewUrl(null);
                                }}
                                className="px-4 py-2 rounded-lg border border-gray-600 text-gray-300 hover:bg-gray-800 transition-colors text-sm"
                            >
                                Batal
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={isUploading}
                                className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white transition-colors text-sm flex items-center gap-2"
                            >
                                {isUploading ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        <span>Mengupload...</span>
                                    </>
                                ) : (
                                    <>
                                        <Upload size={16} />
                                        <span>Upload Bukti</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Upload Input */}
                {!previewUrl && (
                    <div className="relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            disabled={isUploading}
                            className={`w-full h-32 border-2 border-dashed rounded-lg
                                ${isUploading ? 'border-gray-600 cursor-not-allowed' : 'border-gray-700 cursor-pointer'}
                                focus:outline-none focus:border-blue-500 transition-colors duration-200
                                file:hidden`}
                        />
                        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                            <p className="text-sm text-gray-400">Klik atau seret file ke sini</p>
                            <p className="mt-1 text-xs text-gray-500">PNG, JPG (max. 5MB)</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}