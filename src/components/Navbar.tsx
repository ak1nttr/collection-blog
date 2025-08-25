'use client'

import Link from 'next/link'

export default function Navbar() {
  return (
  <nav className="bg-white/80 backdrop-blur-lg border-b-2 border-yellow-500 sticky top-0 bottom-0 z-50">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center">
              <img src="https://cdn-icons-png.flaticon.com/512/3199/3199931.png" width="256" height="256" alt="Mona lisa free icon" title="Mona lisa free icon" />
            </div>
            <span className="text-4xl font-bold text-gray-900">Koleksiyon Galerim</span>
          </div>

          {/* Icon Navigation */}
          <div className="flex items-center space-x-6">
            {/* Home Icon */}
            <Link 
              href="/" 
              className="p-2 text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-all duration-200"
              title="Anasayfa"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
            </Link>

            {/* Search Icon */}
            <button 
              className="p-2 text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 cursor-pointer rounded-lg transition-all duration-200"
              title="Ara"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>

            {/* Admin Login Icon */}
            <Link 
              href="/admin" 
              className="p-2 text-gray-600 hover:text-yellow-500 hover:bg-yellow-50 cursor-pointer rounded-lg transition-all duration-200"
              title="Admin Girişi"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}