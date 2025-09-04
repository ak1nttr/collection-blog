'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import PostModal from '@/components/PostModal'
import { User } from '@supabase/supabase-js'
import { createPost } from '@/services/postService'
import type { Post } from '@/types/post'
import CategoryModal from '@/components/CategoryModal'

export default function AdminLogin() {
  const [showPostModal, setShowPostModal] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [user, setUser] = useState<User | null>(null)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [checkingAuth, setCheckingAuth] = useState(true)

  useEffect(() => {
    // Check if admin is already logged in
    const getUser = async () => {
      setCheckingAuth(true)
      const { data: { user } } = await supabase.auth.getUser()
      setUser(user)
      setCheckingAuth(false)
    }
    getUser()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null)
    })

    return () => subscription.unsubscribe()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      setError(error.message)
    }
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  const handleCreatePost = async (post: Post) => {
    try {
      await createPost(post);
    } catch (error) {
      console.error("Error creating post:", error);
    }
  }

  // Show spinner while checking auth status
  if (checkingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#213448] to-[#ECEFCA]">
        <div className="flex flex-col items-center">
          <svg className="animate-spin w-10 h-10 text-white mb-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-white text-lg">Yükleniyor...</span>
        </div>
      </div>
    )
  }

  // If admin is logged in
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#213448] to-[#ECEFCA]">
        {/* Header */}
        <header className="bg-white/10 backdrop-blur-lg border-b border-white/20">
          <div className="max-w-7xl mx-auto px-6 py-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h1 className="text-2xl font-bold text-white">Admin Paneli</h1>
              </div>

              <div className="flex items-center space-x-4">
                <div className="text-lg text-gray-300">
                  Merhaba, <span className="text-white font-medium">{user.email}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 bg-red-500/20 text-red-200 hover:bg-red-500/30 border border-red-500/30 rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                  <span>Çıkış Yap</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto px-6 py-8">

          {/* Admin Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Create Post */}
            <div className="bg-gradient-to-b from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group cursor-pointer"
              onClick={() => setShowPostModal(true)}>
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-green-500/30 rounded-xl flex items-center justify-center group-hover:bg-green-500/40 transition-colors">
                  <svg className="w-8 h-8 text-green-300" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-black transition-colors">Gönderi Oluştur</h3>
                  <p className="text-gray-300">Yeni bir gönderi oluştur</p>
                </div>
              </div>
            </div>

            {/* Edit Posts */}
            <div className="bg-gradient-to-b from-blue-500/20 to-cyan-500/20 backdrop-blur-lg rounded-xl p-8 border border-blue-500/30 hover:border-blue-400/50 transition-all duration-300 group cursor-pointer">
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-blue-500/30 rounded-xl flex items-center justify-center group-hover:bg-blue-500/40 transition-colors">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-black transition-colors">Gönderileri Düzenle</h3>
                  <p className="text-gray-300">Varolan gönderileri sil veya düzenle</p>
                </div>
              </div>
            </div>


            {/* Manage Categories */}
            <div
              className='bg-gradient-to-b from-green-500/20 to-emerald-500/20 backdrop-blur-lg rounded-xl p-8 border border-green-500/30 hover:border-green-400/50 transition-all duration-300 group cursor-pointer'
              onClick={() => setShowCategoryModal(true)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="w-16 h-16 bg-green-500/30 rounded-xl flex items-center justify-center group-hover:bg-green-500/40 transition-colors">
                  <svg className="w-8 h-8 text-blue-300" fill="none" stroke="white" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white group-hover:text-black transition-colors">Kategorileri Düzenle</h3>
                  <p className="text-gray-300">Yeni kategori üret, değiştir veya sil</p>
                </div>
              </div>
            </div>
          </div>

          {/* PostModal integration */}
          <PostModal
            isOpen={showPostModal}
            onClose={() => setShowPostModal(false)}
            onSubmit={(post) => {
              handleCreatePost(post); // DB WRITE
              setShowPostModal(false);
            }}
          />

          {/* CategoryModal integration */}
          <CategoryModal
            open={showCategoryModal}
            onClose={() => setShowCategoryModal(false)}
          />

        </main>
      </div>
    )
  }

  // Login Form
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#F6F0F0] to-[#BDB395] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Login Card */}
        <div className="bg-black/50 backdrop-blur-xl rounded-2xl p-8 border border-white/20 shadow-xl">
          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Admin Girişi</h2>
            <p className="text-gray-300">Gönderileri yönetmek için giriş yap</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6" autoComplete='off'>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="admin@mail.com"
                autoComplete="off"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
                Parola
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="••••••••"
                autoComplete='off'
              />
            </div>

            {error && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <div className="flex items-center space-x-2">
                  <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 
                        bg-gradient-to-r from-blue-200 to-blue-300
                        text-white rounded-xl font-semibold 
                        border border-white hover:border-black 
                        transition-all duration-200 
                        disabled:opacity-50 disabled:cursor-not-allowed 
                        flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin w-5 h-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Giriş Yapılıyor...</span>
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Giriş Yap</span>
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}