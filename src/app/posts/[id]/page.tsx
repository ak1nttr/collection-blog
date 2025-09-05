"use client"

import { useParams } from "next/navigation"
import { useEffect, useState } from "react"
import type { Post } from "@/types/post"
import { getPostById } from "@/services/postService"
import PostCard from "@/components/PostCard"
import PostUpdateModal from "@/components/PostUpdateModal"
import { supabase } from "@/lib/supabaseClient"
import { get } from "http"
import { User } from "@supabase/supabase-js"

export default function PostPage() {
    const params = useParams()
    const postId = typeof params.id === "string" ? params.id : undefined

    const [post, setPost] = useState<Post | null>(null)
    const [loading, setLoading] = useState(true)
    const [showUpdatePostModal, setShowUpdatePostModal] = useState(false)
    const [user, setUser] = useState<User | null>(null)

    useEffect(() => {
        const getUser = async () => {
            const { data: { user } } = await supabase.auth.getUser()
            setUser(user)
        }
        getUser()

        const fetchPost = async () => {
            if (!postId) {
                console.error("Post ID is missing or invalid.");
                setLoading(false);
                return;
            }
            try {
                const fetchedPost = await getPostById(postId)
                setPost(fetchedPost)
            } catch (error) {
                console.error("Error fetching post:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchPost()
    }, [postId])

    const refreshPost = async () => {
        if (!postId) return;

        try {
            const fetchedPost = await getPostById(postId)
            setPost(fetchedPost)
        } catch (error) {
            console.error("Error fetching post:", error)
        }
    }

    const backToHome = () => {
        window.location.href = "/";
    }

    if (loading) {
        return <div className="flex items-center justify-center h-screen">Loading...</div>;
    }

    if (!post) {
        return <div className="flex items-center justify-center h-screen">Post not found.</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#FFDAB3] to-[#574964] py-5 flex flex-col items-center">
            <div className="relative">
                <PostCard post={post} />
                
                {/* Edit Button - Only show if user is logged in (admin) */}
                {user && (
                    <div className="flex justify-start">
                        <button
                            onClick={() => setShowUpdatePostModal(true)}
                            className="absolute bottom-4 right-4 cursor-pointer px-4 py-2 bg-gradient-to-r from-yellow-600 to-orange-600 text-white rounded-xl hover:from-yellow-600 hover:to-orange-400 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2 shadow-lg z-10"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Düzenle</span>
                        </button>
                    </div>
                )}


                {/* PostUpdateModal integration */}
                <PostUpdateModal
                    isOpen={showUpdatePostModal}
                    onClose={() => setShowUpdatePostModal(false)}
                    posts={post ? [post] : []}
                    onSuccess={refreshPost}
                    onDelete={backToHome}
                />
            </div>
        </div>
    );
}