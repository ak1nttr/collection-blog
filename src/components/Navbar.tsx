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
              <svg className="w-6 h-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                <path fill="none" strokeWidth={2} d="M8,11 C10.7614237,11 13,8.76142375 13,6 C13,3.23857625 10.7614237,1 8,1 C5.23857625,1 3,3.23857625 3,6 C3,8.76142375 5.23857625,11 8,11 Z M13.0233822,13.0234994 C11.7718684,11.7594056 10.0125018,11 8,11 C4,11 1,14 1,18 L1,23 L8,23 M10,19.5 C10,20.88 11.12,22 12.5,22 C13.881,22 15,20.88 15,19.5 C15,18.119 13.881,17 12.5,17 C11.12,17 10,18.119 10,19.5 L10,19.5 Z M23,15 L20,12 L14,18 M17.5,14.5 L20.5,17.5 L17.5,14.5 Z"></path>
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}