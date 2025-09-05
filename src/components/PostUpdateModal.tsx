import { generateSlug } from "@/lib/slugify";
import { Category } from "@/types/category";
import { Post, UploadedImage } from "@/types/post";
import React, { useState, ChangeEvent, useEffect } from "react";
import { getCategories } from "@/services/categoryService";
import { updatePost, deletePost } from "@/services/postService";

interface PostManageModalProps {
    isOpen: boolean;
    onClose: () => void;
    posts: Post[];
    onSuccess?: () => void;
    onDelete?: () => void;
    onError?: (error: string) => void;
}

const PostUpdateModal: React.FC<PostManageModalProps> = ({ 
    isOpen, 
    onClose, 
    posts,
    onSuccess,
    onDelete,
    onError
}) => {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [mode, setMode] = useState<"search" | "edit" | "delete">("search");
    
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [images, setImages] = useState<UploadedImage[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
    const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const filteredPosts = posts.filter(post =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase())
    );

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            const target = event.target as HTMLElement;
            if (!target.closest('[data-category-dropdown]')) {
                setIsCategoryDropdownOpen(false);
            }
        };

        const fetchCategories = async () => {
            const cats = await getCategories();
            const flattenedCategories: Category[] = [];

            const flattenTree = (categories: Category[]) => {
                categories.forEach(cat => {
                    flattenedCategories.push(cat);
                    if (cat.children && cat.children.length > 0) {
                        flattenTree(cat.children);
                    }
                });
            };

            flattenTree(cats);
            setCategories(flattenedCategories);
        };
        fetchCategories();

        if (isCategoryDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isCategoryDropdownOpen]);

    // Populate form when editing a post
    useEffect(() => {
        if (selectedPost && mode === "edit" && categories.length > 0) {
            if (title === "" && description === "" && price === "") {
                setTitle(selectedPost.title);
                setDescription(selectedPost.description);
                setPrice(selectedPost.price.toString());

                // Convert image URLs to UploadedImage format
                const postImages: UploadedImage[] = (selectedPost.images ?? []).map(imageUrl => ({
                    file: null as any, // Not needed for existing images
                    url: imageUrl,
                    key: imageUrl,
                    uploading: false,
                    error: null
                }));
                setImages(postImages);

                // Find and set categories
                const postCategories = categories.filter(cat =>
                    (selectedPost.categories ?? []).includes(cat.title)
                );
                setSelectedCategories(postCategories);
            }
        }
    }, [selectedPost, mode, categories]);

    if (!isOpen) return null;

    const uploadImageToR2 = async (file: File): Promise<string> => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.error || "Image upload failed");
        }

        return result.url;
    };

    const handleImageChange = async (e: ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files) return;
        const filesArray = Array.from(e.target.files);

        const newImages: UploadedImage[] = filesArray.map(file => ({
            file,
            url: null,
            key: null,
            uploading: true,
            error: null
        }));

        setImages(prev => [...prev, ...newImages]);

        for (let i = 0; i < filesArray.length; i++) {
            const file = filesArray[i];
            const imageIndex = images.length + i;

            try {
                const result = await uploadImageToR2(file);
                const imageKey = result;

                setImages(prev => prev.map((img, idx) =>
                    idx === imageIndex
                        ? { ...img, url: result, key: imageKey, uploading: false }
                        : img
                ));
            } catch (error) {
                setImages(prev => prev.map((img, idx) =>
                    idx === imageIndex
                        ? {
                            ...img,
                            uploading: false,
                            error: error instanceof Error ? error.message : 'Upload failed'
                        }
                        : img
                ));
            }
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImages(images.filter((_, index) => index !== indexToRemove));
    };

    const retryImageUpload = async (index: number) => {
        const imageToRetry = images[index];
        if (!imageToRetry) return;

        setImages(prev => prev.map((img, idx) =>
            idx === index
                ? { ...img, uploading: true, error: null }
                : img
        ));

        try {
            const result = await uploadImageToR2(imageToRetry.file);
            const imageKey = result;

            setImages(prev => prev.map((img, idx) =>
                idx === index
                    ? { ...img, key: imageKey, url: result, uploading: false }
                    : img
            ));
        } catch (error) {
            setImages(prev => prev.map((img, idx) =>
                idx === index
                    ? {
                        ...img,
                        uploading: false,
                        error: error instanceof Error ? error.message : 'Upload failed'
                    }
                    : img
            ));
        }
    };

    const handleUpdate = async () => {
        if (!selectedPost) return;
        
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
        
        const stillUploading = images.some(img => img.uploading);
        if (stillUploading) {
            setError("Lütfen tüm resimlerin yüklenmesini bekleyin");
            return;
        }

        const failedUploads = images.filter(img => img.error);
        if (failedUploads.length > 0) {
            setError("Lütfen yüklenemeyen resimleri yeniden yükleyin veya kaldırın");
            return;
        }
        
        setLoading(true);

        try {
            const uploadedImageKeys = images.map(img => img.key!).filter(Boolean);

            const updatedPost: Post = {
                ...selectedPost,
                title,
                description,
                price: parseFloat(price.replace(",", ".")),
                images: uploadedImageKeys,
                slug: generateSlug(title),
                categories: selectedCategories.map(cat => cat.title),
            };

            await updatePost(selectedPost.id!, updatedPost);
            onSuccess && onSuccess();
            resetForm();
            setMode("search");
        } catch (error) {
            setError("Gönderi güncellenirken bir hata oluştu");
            onError && onError("Gönderi güncellenirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!selectedPost) return;
        
        setLoading(true);
        try {
            await deletePost(selectedPost.id!);
            onSuccess && onSuccess();
            onDelete && onDelete();
            resetForm();
            setMode("search");
        } catch (error) {
            setError("Gönderi silinirken bir hata oluştu");
            onError && onError("Gönderi silinirken bir hata oluştu");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setPrice("");
        setImages([]);
        setSelectedCategories([]);
        setSelectedPost(null);
        setError(null);
        setSearchQuery("");
    };

    const handleBackdropClick = (e: React.MouseEvent) => {
        if (e.target === e.currentTarget) {
            onClose();
            resetForm();
            setMode("search");
        }
    };

    const selectPostForEdit = (post: Post) => {
        setSelectedPost(post);
        setMode("edit");
    };

    const selectPostForDelete = (post: Post) => {
        setSelectedPost(post);
        setMode("delete");
    };

    const uploadProgress = images.length > 0
        ? (images.filter(img => img.url && !img.error).length / images.length) * 100
        : 0;

    const getModalTitle = () => {
        switch (mode) {
            case "edit": return "Ürünü Düzenle";
            case "delete": return "Ürünü Sil";
            default: return "Ürün Yönetimi";
        }
    };

    const getModalIcon = () => {
        switch (mode) {
            case "edit": 
                return (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                );
            case "delete":
                return (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                );
        }
    };

    const getHeaderColor = () => {
        switch (mode) {
            case "edit": return "bg-blue-500";
            case "delete": return "bg-red-500";
            default: return "bg-yellow-500";
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
                        <div className={`w-10 h-10 ${getHeaderColor()} rounded-xl flex items-center justify-center`}>
                            {getModalIcon()}
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900">{getModalTitle()}</h2>
                    </div>
                    <button
                        onClick={() => {
                            onClose();
                            resetForm();
                            setMode("search");
                        }}
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

                    {mode === "search" && (
                        <>
                            {/* Search Bar */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                    <span>Ürün Ara</span>
                                </label>
                                <input
                                    type="text"
                                    placeholder="Ürün başlığı ile ara..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                />
                            </div>

                            {/* Posts List */}
                            <div className="space-y-2">
                                <p className="text-sm font-semibold text-gray-700">
                                    Ürünler ({filteredPosts.length})
                                </p>
                                <div className="max-h-96 overflow-y-auto space-y-2">
                                    {filteredPosts.length === 0 ? (
                                        <div className="text-center py-8 text-gray-500">
                                            <svg className="w-12 h-12 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v1M9 4V3a1 1 0 011-1h4a1 1 0 011 1v1" />
                                            </svg>
                                            {searchQuery ? "Arama kriterlerinize uygun ürün bulunamadı" : "Henüz ürün bulunmuyor"}
                                        </div>
                                    ) : (
                                        filteredPosts.map((post) => (
                                            <div key={post.id} className="border border-gray-200 rounded-xl p-4 hover:border-gray-300 transition-colors">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900">{post.title}</h3>
                                                        <p className="text-sm text-gray-500 mt-1 line-clamp-2">{post.description}</p>
                                                        <p className="text-sm font-semibold text-green-600 mt-2">₺{post.price}</p>
                                                    </div>
                                                    <div className="flex space-x-2 ml-4">
                                                        <button
                                                            onClick={() => selectPostForEdit(post)}
                                                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Düzenle"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => selectPostForDelete(post)}
                                                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                            title="Sil"
                                                        >
                                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            </div>
                        </>
                    )}

                    {mode === "delete" && selectedPost && (
                        <div className="text-center py-6">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ürünü Silmek İstediğinizden Emin misiniz?</h3>
                            <p className="text-gray-600 mb-4">
                                "<span className="font-medium">{selectedPost.title}</span>" adlı ürün kalıcı olarak silinecek. Bu işlem geri alınamaz.
                            </p>
                            <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
                                <div className="flex">
                                    <svg className="w-5 h-5 text-red-400 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                    </svg>
                                    <p className="text-sm text-red-700">
                                        Bu ürüne ait tüm veriler (resimler, kategoriler, açıklamalar) kalıcı olarak silinecektir.
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    {mode === "edit" && selectedPost && (
                        <>
                            {/* Upload Progress Bar */}
                            {images.length > 0 && images.some(img => img.uploading) && (
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Resimler yükleniyor...</span>
                                        <span className="text-gray-600">{Math.round(uploadProgress)}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
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
                                        placeholder="Ürün başlığı girin..."
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

                            {/* Categories Selection */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-700 flex items-center space-x-2">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 00-2 2v2m0 0V9a2 2 0 012-2m0 0h14m-14 0v6a2 2 0 002 2m12 0a2 2 0 002-2" />
                                    </svg>
                                    <span>Kategoriler</span>
                                </label>

                                {/* Selected Categories Display */}
                                {selectedCategories.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        {selectedCategories.map((category, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                                            >
                                                <span className="mr-1">{category.icon}</span>
                                                {category.title}
                                                <button
                                                    type="button"
                                                    onClick={() => setSelectedCategories(prev => prev.filter((_, i) => i !== index))}
                                                    className="ml-2 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                )}

                                {/* Dropdown */}
                                <div className="relative" data-category-dropdown>
                                    <button
                                        type="button"
                                        onClick={() => setIsCategoryDropdownOpen(prev => !prev)}
                                        className="relative w-full cursor-pointer rounded-xl border border-gray-200 bg-white py-3 pl-4 pr-10 text-left focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                    >
                                        <span className="block truncate text-gray-500">
                                            {selectedCategories.length > 0
                                                ? `${selectedCategories.length} kategori seçildi`
                                                : "Kategorileri seçin..."
                                            }
                                        </span>
                                        <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
                                            <svg
                                                className={`h-5 w-5 text-gray-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20"
                                                fill="currentColor"
                                            >
                                                <path
                                                    fillRule="evenodd"
                                                    d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                                                    clipRule="evenodd"
                                                />
                                            </svg>
                                        </span>
                                    </button>

                                    {/* Dropdown Menu */}
                                    {isCategoryDropdownOpen && (
                                        <div className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-xl bg-white py-1 shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none border border-gray-100">
                                            {categories.map((category, index) => {
                                                const isSelected = selectedCategories.some(cat => cat.title === category.title);

                                                return (
                                                    <div
                                                        key={index}
                                                        onClick={() => {
                                                            if (isSelected) {
                                                                setSelectedCategories(prev => prev.filter(cat => cat.title !== category.title));
                                                            } else {
                                                                setSelectedCategories(prev => [...prev, category]);
                                                            }
                                                        }}
                                                        className={`relative cursor-pointer select-none py-3 pl-4 pr-9 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-blue-50 text-blue-900' : 'text-gray-900'
                                                            }`}
                                                    >
                                                        <div className="flex items-center space-x-2">
                                                            <span className="text-lg">{category.icon}</span>
                                                            <span className={`block truncate ${isSelected ? 'font-medium' : 'font-normal'}`}>
                                                                {category.title}
                                                            </span>
                                                        </div>

                                                        {isSelected && (
                                                            <span className="absolute inset-y-0 right-0 flex items-center pr-4 text-blue-600">
                                                                <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                            </span>
                                                        )}
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    )}
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
                                        disabled={images.some(img => img.uploading)}
                                    />
                                    <label
                                        htmlFor="image-upload"
                                        className={`cursor-pointer flex flex-col items-center space-y-2 text-center ${images.some(img => img.uploading) ? 'opacity-50 cursor-not-allowed' : ''
                                            }`}
                                    >
                                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center">
                                            <svg className="w-6 h-6 text-cyan-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                            </svg>
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-gray-700">
                                                {images.some(img => img.uploading)
                                                    ? 'Resimler yükleniyor...'
                                                    : 'Fotoğrafları seçmek için tıklayın'
                                                }
                                            </p>
                                            <p className="text-xs text-gray-500">PNG, JPG, GIF - 10MB max</p>
                                        </div>
                                    </label>
                                </div>
                            </div>

                            {/* Image Previews */}
                            {images.length > 0 && (
                                <div className="space-y-2">
                                    <p className="text-sm font-semibold text-gray-700">
                                        Resim Önizlemeleri ({images.filter(img => img.url).length}/{images.length})
                                    </p>
                                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                        {images.map((image, idx) => (
                                            <div key={idx} className="relative group">
                                                <div className="relative">
                                                    <img
                                                        src={image.url || (image.file ? URL.createObjectURL(image.file) : '')}
                                                        alt={`preview-${idx}`}
                                                        className={`w-full h-24 object-cover rounded-lg border border-gray-200 ${image.uploading ? 'opacity-50' : ''
                                                            } ${image.error ? 'border-red-300' : ''}`}
                                                    />

                                                    {/* Upload Status Overlay */}
                                                    {image.uploading && (
                                                        <div className="absolute inset-0 bg-black/30 rounded-lg flex items-center justify-center">
                                                            <svg className="animate-spin w-6 h-6 text-white" fill="none" viewBox="0 0 24 24">
                                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Success Checkmark */}
                                                    {image.url && !image.error && (
                                                        <div className="absolute top-1 left-1 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                                                            <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                                            </svg>
                                                        </div>
                                                    )}

                                                    {/* Error Indicator */}
                                                    {image.error && (
                                                        <div className="absolute inset-0 bg-red-500/20 rounded-lg flex items-center justify-center">
                                                            <div className="text-center">
                                                                <svg className="w-6 h-6 text-red-500 mx-auto mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                                </svg>
                                                                <button
                                                                    onClick={() => retryImageUpload(idx)}
                                                                    className="text-xs bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                                                                >
                                                                    Tekrar Dene
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Remove Button */}
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
                        </>
                    )}
                </div>

                {/* Footer */}
                <div className="flex justify-end space-x-3 p-6 border-t border-gray-100 bg-gray-50/50">
                    {mode === "search" && (
                        <button
                            onClick={() => {
                                onClose();
                                resetForm();
                                setMode("search");
                            }}
                            className="cursor-pointer px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors font-medium"
                        >
                            Kapat
                        </button>
                    )}

                    {(mode === "edit" || mode === "delete") && (
                        <>
                            <button
                                onClick={() => {
                                    setMode("search");
                                    resetForm();
                                }}
                                className="cursor-pointer px-6 py-3 text-gray-700 bg-white border border-gray-200 rounded-xl hover:bg-red-50 transition-colors font-medium"
                            >
                                Geri
                            </button>
                            
                            {mode === "edit" && (
                                <button
                                    onClick={handleUpdate}
                                    disabled={loading || images.some(img => img.uploading) || images.some(img => img.error)}
                                    className="cursor-pointer px-6 py-3 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl hover:to-yellow-700 hover:from-orange-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Güncelleniyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Ürünü Güncelle</span>
                                        </>
                                    )}
                                </button>
                            )}

                            {mode === "delete" && (
                                <button
                                    onClick={handleDelete}
                                    disabled={loading}
                                    className="cursor-pointer px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl hover:from-red-700 hover:to-red-800 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Siliniyor...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            <span>Ürünü Sil</span>
                                        </>
                                    )}
                                </button>
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PostUpdateModal;