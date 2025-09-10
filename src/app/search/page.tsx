'use client'

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import CategoryCard from '@/components/CategoryCard';
import PostPreview from '@/components/PostPreview';
import type { Post } from '@/types/post';
import type { Category } from '@/types/category';
import { searchPosts } from '@/services/postService';
import { searchCategories } from '@/services/categoryService';


const SearchPage = () => {
    const router = useRouter();
    const params = useSearchParams();
    const q = params?.get('q') || '';

    const [posts, setPosts] = useState<Post[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        setSearchTerm(q);
    }, [q]);

    useEffect(() => {
        const fetchData = async () => {
            if (!mounted) return;

            setLoading(true);
            try {
                const fetchedPosts: Post[] = await searchPosts(searchTerm);
                const fetchedCategories: Category[] = await searchCategories(searchTerm);

                setPosts(fetchedPosts);
                setCategories(fetchedCategories);
            } catch (error) {
                console.log('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [searchTerm]);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        if (searchTerm.trim()) {
            router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
        }
    };

    return (
        <div className="min-h-screen bg-white">
            {/* Header Section */}
            <div className="border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <h1 className="text-3xl font-bold text-gray-900 mb-4">
                        {q ? `Arama sonuçları - "${q}"` : 'Ara'}
                    </h1>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="max-w-2xl">
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Ürünleri ve kategorileri araştır..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                type="submit"
                                className="px-6 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                Ara
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex justify-center items-center py-12 space-x-4">
                        <div className="animate-spin rounded-full h-14 w-14 border-b-15 border-yellow-500"></div>
                        <span className="ml-2 text-gray-600">Yükleniyor...</span>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Main Content Area */}
                        {/* Sidebar */}
                        <div className="lg:col-span-1">
                            {/* Related Categories Section */}
                            <div className="bg-gradient-to-b rounded-lg p-6 mb-8 from-yellow-200 to-orange-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                                    Alakalı Kategoriler
                                </h3>

                                {categories.length > 0 ? (
                                    <div className="space-y-3">
                                        {categories.map((category) => (
                                            <div key={category.id}>
                                                <CategoryCard title={category.title} icon={category.icon} subcategories={category.children} />
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-gray-500 text-sm">
                                        {q ? 'Alakalı bir kategori bulunamadı.' : 'Aramanızla alakalı kategoriler burada görünecek.'}
                                    </p>
                                )}
                            </div>
                        </div>


                        <div className="lg:col-span-2">
                            {/* Search Results Summary */}
                            {q && (
                                <div className="mb-6">
                                    <p className="text-black font-bold">
                                        İlgili {posts.length} ürün bulundu
                                    </p>
                                </div>
                            )}

                            {/* Posts Section */}
                            <div className="space-y-6">
                                <h2 className="text-2xl font-semibold text-gray-900">Ürünler</h2>

                                {posts.length > 0 ? (
                                    <div className="grid grid-cols-3 gap-20">
                                        {posts.map((post) => (
                                            <PostPreview key={post.id} post={post} />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <p className="text-gray-500">
                                            {q ? 'Aradığınız terim ile alakalı ürün bulunamadı.' : 'Aramak için bir terim girin.'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>


                    </div>
                )}
            </div>
        </div>
    );
};

export default SearchPage;