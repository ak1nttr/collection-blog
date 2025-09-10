'use client'

import CategoryCard from '@/components/CategoryCard'
import { useEffect, useState, useRef } from 'react'
import type { Post } from '@/types/post'
import { getPosts } from '@/services/postService'
import PostPreview from '@/components/PostPreview'
import { Category } from '@/types/category'
import { getCategories } from '@/services/categoryService'
import SearchModal from '@/components/SearchModal'

export default function Home() {
  const [searchOpen, setSearchOpen] = useState(false) 
  const [posts, setPosts] = useState<Post[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const searchButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const fetchedPosts = await getPosts()
        setPosts(fetchedPosts)
      } catch (error) {
        console.error('Error fetching posts:', error)
      }
    }

    const fetchCategories = async () => {
      const cats = await getCategories();
      setCategories(cats);
    };

    fetchCategories()
    fetchPosts()  
  }, [])


  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: -320,
        behavior: 'smooth'
      })
    }
  }

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({
        left: 320,
        behavior: 'smooth'
      })
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFDAB3] to-[#574964]">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-8">

        <div className='flex flex-row justify-between items-center'>
          <h2 className="text-3xl font-bold text-gray-900">Kategoriler</h2>
          <div className='flex flex-row gap-2 items-center'>
            <SearchModal 
                isOpen={searchOpen}
                onClose={() => setSearchOpen(false)} 
                buttonRef={searchButtonRef}
            />

            {/* Search Icon */}
            <button
                className="p-2 text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 cursor-pointer rounded-lg transition-all duration-200"
                title="Ara"
                onClick={() => setSearchOpen(!searchOpen)}
                ref={searchButtonRef}
            >
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
            </button>
          </div>
        </div>

          

        {/* Categories Section */}
        <div className='flex flex-row justify-between items-center'>
          <div className="flex flex-row gap-2 flex-wrap">
            {categories.map(c => (
              <CategoryCard
                key={c.title}
                title={c.title}
                icon={c.icon}
                subcategories={c.children}
              />
            ))}
          </div>


        </div>

        {/* Hot Products Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Son Eklenenler</h2>
          <p className="text-gray-600 mb-6">Son eklenen ürünler</p>
          <div className="relative rounded-xl overflow-hidden">
            {/* Left Arrow */}
            {posts.length > 4 && (
              <button
                onClick={scrollLeft}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 z-30 bg-yellow-300/90 hover:bg-yellow-300 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Scroll left"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
            )}
            
            {/* Posts Container */}
            <div 
              ref={scrollContainerRef}
              className="flex flex-row gap-6 overflow-x-auto scrollbar-hide px-4 py-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {posts.length === 0 ? (
                <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
                  <p className="text-gray-500">No posts available.</p>
                </div>
              ) : (
                posts.map(post => {
                  console.log(post.images?.[0])
                  return <PostPreview key={post.id} post={post} />
                })
              )}
            </div>

            {/* Right Arrow */}
            {posts.length > 4 && (
              <button
                onClick={scrollRight}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 z-30 bg-yellow-300/90 hover:bg-yellow-300 rounded-full p-2 shadow-lg transition-all duration-200 hover:scale-110"
                aria-label="Scroll right"
              >
                <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Random Collection Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Karışık Koleksiyon Ürünleri</h2>
          <p className="text-gray-600 mb-6">Her türden koleksiyon ürünlerini keşfet</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-gray-50 rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-4xl mb-4">🎲</div>
              <p className="text-gray-500">Random items will be loaded here...</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
