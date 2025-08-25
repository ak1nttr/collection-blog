'use client'

import CategoryCard from '@/components/CategoryCard'
import { useState } from 'react'

export default function Home() {
  const [openCategory, setOpenCategory] = useState<string | null>(null)

  const toggleCategory = (category: string) => {
    setOpenCategory(openCategory === category ? null : category)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-yellow-200 to-white">
      <div className="max-w-7xl mx-auto px-6 py-6 space-y-12">

        {/* Categories Section */}
        <div>
          <div className="flex flex-row gap-4">

            <CategoryCard
              title="Madeni Para Koleksiyonu"
              icon="🪙"
              subcategories={[
                'Madalya ve Madalyonlar',
                'Türkiye Cumhuriyeti Madeni Paralar',
                'Osmanlı Dönemi Madeni Paralar',
                'Yabancı Madeni Paralar',
                'Jeton'
              ]}
            />

            <CategoryCard
              title="Pul Koleksiyonu"
              icon="✉️"
            />

            <CategoryCard
              title="Sanat Eserleri"
              icon="🎨"
              subcategories={[
                'Resimler',
                'Heykeller',
              ]}
            />

          </div>
        </div>

        {/* Hot Products Section */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Son Eklenenler</h2>
          <p className="text-gray-600 mb-6">Son eklenen ürünler</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg border border-gray-200 p-6 text-center">
              <div className="text-4xl mb-4">📦</div>
              <p className="text-gray-500">Hot products will be loaded here...</p>
            </div>
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
