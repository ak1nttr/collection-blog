import { Post } from "@/types/post";
import React, { useState, ChangeEvent } from "react";

interface PostModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (post: Post) => void;
}

const PostModal: React.FC<PostModalProps> = ({ isOpen, onClose, onSubmit }) => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState<File[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    function generatePostCode() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let result = '';
        for (let i = 0; i < 8; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    }

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);
        setImages(prev => [...prev, ...filesArray]);
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = () => {
        setError(null);

        if (!title || title.length > 50) {
            setError("Başlık zorunlu ve maksimum 50 karakter olmalıdır");
            return;
        }
        if (!description || description.length > 300) {
            setError("Ürün açıklaması zorunlu ve maksimum 300 karakter olmalıdır");
            return;
        }
        if (!price || isNaN(Number(price.replace(",", ".")))) {
            setError("Ürün fiyatı geçerli bir sayı olmalıdır");
            return;
        }

        const post: Post = {
            id: generatePostCode(),
            title,
            description,
            price: parseFloat(price.replace(",", ".")),
            images: images.map((file) => URL.createObjectURL(file)),
        };

        // upload images to server or cloud storage, get their URLs
        // save post with image URLs
        console.log("Submitting post:", post);

        setLoading(true);
        onSubmit(post);
        setLoading(false);
        onClose();

        // reset form
        setTitle("");
        setDescription("");
        setPrice("");
        setImages([]);
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div 
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={handleBackdropClick}
        >
            <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl transform transition-all">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-gray-100">
                    <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-yellow-500 rounded-xl flex items-center justify-center">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">Yeni bir ürün oluştur</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {error && (
                        <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3">
                            <p className="text-red-700 text-sm">{error}</p>
                        </div>
                    )}

                    {/* Title Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                            </svg>
                            <span>Ürün Başlığı</span>
                        </label>
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="bir başlık girin..."
                                maxLength={50}
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                            <div className="absolute right-3 top-3 text-xs text-gray-400">
                                {title.length}/50
                            </div>
                        </div>
                    </div>

                    {/* Description Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Ürün Açıklaması</span>
                        </label>
                        <div className="relative">
                            <textarea
                                placeholder="Ürün için detaylı bir açıklama girin..."
                                maxLength={300}
                                rows={4}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                            />
                            <div className="absolute right-3 bottom-3 text-xs text-gray-400">
                                {description.length}/300
                            </div>
                        </div>
                    </div>

                    {/* Price Input */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <svg className="w-6 h-6" fill="none" stroke="green" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                            </svg>
                            <span>Fiyat</span>
                        </label>
                        <div className="relative">
                            <div className="absolute left-4 top-3 text-gray-500 font-semibold">₺</div>
                            <input
                                type="text"
                                placeholder="0.00"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Image Upload */}
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Ürün fotoğrafları</span>
                        </label>
                        <div className="border-2 border-dashed border-orange-200 rounded-xl p-6 hover:border-orange-300 transition-colors">
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleImageChange}
                                className="hidden"
                                id="image-upload"
                            />
                            <label
                                htmlFor="image-upload"
                                className="cursor-pointer flex flex-col items-center space-y-2 text-center"
                            >
                                <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                    <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-gray-700">Fotoğrafları seçmek için tıklayın</p>
                                    <p className="text-xs text-gray-500">PNG, JPG, GIF - 10MB max</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Image Previews */}
                    {images.length > 0 && (
                        <div className="space-y-2">
                            <p className="text-sm font-semibold text-gray-700">Image Previews ({images.length})</p>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {images.map((file, idx) => (
                                    <div key={idx} className="relative group">
                                        <img
                                            src={URL.createObjectURL(file)}
                                            alt={`preview-${idx}`}
                                            className="w-full h-24 object-cover rounded-lg border border-gray-200"
                                        />
                                        <button
                                            onClick={() => removeImage(idx)}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-red-50 transition-colors font-medium"
                    >
                        İptal
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    >
                        {loading ? (
                            <>
                                <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                <span>Oluşturuluyor...</span>
                            </>
                        ) : (
                            <>
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                                <span>Ürün Oluştur</span>
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PostModal;