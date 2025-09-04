"use client";

import { useState, useEffect } from "react";
import {
    createCategory,
    updateCategory,
    deleteCategory,
    getCategories,
} from "@/services/categoryService";
import type { Category } from "@/types/category";

interface CategoryModalProps {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

export default function CategoryModal({
    open,
    onClose,
    onSuccess,
}: CategoryModalProps) {
    const [view, setView] = useState<'list' | 'form'>('list');
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);

    // Form state
    const [title, setTitle] = useState("");
    const [icon, setIcon] = useState("");
    const [parentId, setParentId] = useState<string | null>(null);

    useEffect(() => {
        if (open) {
            setView('list');
            fetchCategories();
        }
    }, [open]);

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

    const resetForm = () => {
        setTitle("");
        setIcon("");
        setParentId(null);
        setEditingCategory(null);
        setShowDeleteConfirm(null);
    };

    const handleNewCategory = () => {
        resetForm();
        setView('form');
    };

    const handleEditCategory = (category: Category) => {
        setEditingCategory(category);
        setTitle(category.title);
        setIcon(category.icon);
        setParentId(category.parent_id || null);
        setView('form');
    };

    const handleBackToList = () => {
        resetForm();
        setView('list');
        fetchCategories();
    };

    const handleSave = async () => {
        if (!title.trim()) return;

        setIsLoading(true);
        try {
            if (editingCategory) {
                await updateCategory(editingCategory.id ?? "", { title: title.trim(), icon, parent_id: parentId });
            } else {
                await createCategory({ title: title.trim(), icon, parent_id: parentId });
            }
            onSuccess?.();
            handleBackToList();
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (categoryId: string) => {
        setIsLoading(true);
        try {
            await deleteCategory(categoryId);
            onSuccess?.();
            setShowDeleteConfirm(null);
            fetchCategories();
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey && view === 'form') {
            e.preventDefault();
            handleSave();
        }
        if (e.key === "Escape") {
            if (view === 'form') {
                handleBackToList();
            } else {
                onClose();
            }
        }
    };

    // Organize categories into parent-child structure
    const organizeCategories = () => {
        const parentCategories = categories.filter(cat => !cat.parent_id);
        return parentCategories.map(parent => ({
            ...parent,
            children: categories.filter(cat => cat.parent_id === parent.id)
        }));
    };

    if (!open) return null;

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 bg-black/60 backdrop-blur-sm">
            <div className="bg-white rounded-xl w-full max-w-2xl relative shadow-2xl max-h-[90vh] flex flex-col">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 flex items-center justify-between">
                    <h2 className="text-xl font-semibold text-gray-800">
                        {view === 'list' ? 'Kategori Yönetimi' :
                            editingCategory ? 'Kategoriyi Düzenle' : 'Yeni Kategori'}
                    </h2>
                    <button
                        className="text-gray-400 hover:text-gray-600 transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                        onClick={view === 'form' ? handleBackToList : onClose}
                        disabled={isLoading}
                    >
                        {view === 'form' ? '←' : '✖'}
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-hidden">
                    {view === 'list' ? (
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <p className="text-gray-600">Düzenlemek istediğiniz bir kategoriyi seçin</p>
                                <button
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg hover:to-yellow-700 hover:from-orange-400 transition-colors"
                                    onClick={handleNewCategory}
                                >
                                    + Yeni Kategori
                                </button>
                            </div>

                            <div className="space-y-2 max-h-96 overflow-y-auto">
                                {organizeCategories().map((parent) => (
                                    <div key={parent.id} className="border border-gray-200 rounded-lg">
                                        {/* Parent category */}
                                        <div className="p-2 bg-yellow-50 flex items-center justify-between">
                                            <div className="flex items-center gap-3">
                                                <span className="text-lg">{parent.icon}</span>
                                                <span className="font-medium">{parent.title}</span>
                                            </div>
                                            <div className="flex gap-2">
                                                <button
                                                    className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm"
                                                    onClick={() => handleEditCategory(parent)}
                                                >
                                                    Düzenle
                                                </button>
                                                <button
                                                    className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                                                    onClick={() => setShowDeleteConfirm(parent.id ?? null)}
                                                >
                                                    Sil
                                                </button>
                                            </div>
                                        </div>

                                        {/* Child categories */}
                                        {parent.children.map((child) => (
                                            <div key={child.id} className="p-2 border-t border-gray-100 flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <span>-</span>
                                                    <span className="text-base">{child.icon}</span>
                                                    <span>{child.title}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    <button
                                                        className="text-blue-600 hover:text-blue-800 px-2 py-1 text-sm"
                                                        onClick={() => handleEditCategory(child)}
                                                    >
                                                        Düzenle
                                                    </button>
                                                    <button
                                                        className="text-red-600 hover:text-red-800 px-2 py-1 text-sm"
                                                        onClick={() => setShowDeleteConfirm(child.id ?? null)}
                                                    >
                                                        Sil
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}

                                {categories.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <p>No categories yet</p>
                                        <button
                                            className="text-blue-600 hover:text-blue-800 mt-2"
                                            onClick={handleNewCategory}
                                        >
                                            Create your first category
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="p-6">
                            <div className="flex flex-col gap-4" onKeyDown={handleKeyDown}>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Başlık
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="Başlık girin"
                                        className="border border-yellow-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        disabled={isLoading}
                                        autoFocus
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Simge
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="🏷️ Emoji ya da ikon (opsiyonel)"
                                        className="border border-yellow-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                        value={icon}
                                        onChange={(e) => setIcon(e.target.value)}
                                        disabled={isLoading}
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Üst Kategori
                                    </label>
                                    <select
                                        className="border border-yellow-300 p-3 rounded-lg w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                                        value={parentId || ""}
                                        onChange={(e) => setParentId(e.target.value || null)}
                                        disabled={isLoading}
                                    >
                                        <option value="">Üst kategori yok</option>
                                        {categories
                                            .filter((cat) => cat.id !== editingCategory?.id && !cat.parent_id)
                                            .map((cat) => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.icon} {cat.title}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-red-50 transition-colors"
                                    onClick={handleBackToList}
                                    disabled={isLoading}
                                >
                                    Vazgeç
                                </button>
                                <button
                                    className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-2 rounded-lg hover:to-yellow-700 hover:from-orange-400 transition-colors"
                                    onClick={handleSave}
                                    disabled={isLoading || !title.trim()}
                                >
                                    {isLoading ? "Kaydediliyor..." : editingCategory ? "Kaydet" : "Oluştur"}
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-60">
                    <div className="bg-white rounded-lg p-6 max-w-sm mx-4">
                        <h3 className="text-lg font-semibold mb-2">Delete Category</h3>
                        <p className="text-gray-600 mb-4">
                            Silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.
                        </p>
                        <div className="flex justify-end gap-3">
                            <button
                                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                                onClick={() => setShowDeleteConfirm(null)}
                                disabled={isLoading}
                            >
                                Geri al
                            </button>
                            <button
                                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                                onClick={() => handleDelete(showDeleteConfirm)}
                                disabled={isLoading}
                            >
                                {isLoading ? "Siliniyor..." : "Sil"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}